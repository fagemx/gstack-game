/**
 * Pipeline runner with concurrency control and review-fix loop.
 * Uses claude -p subprocess — no API key needed.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { PipelineConfig, DocResult, GapAnalysis, ScoreResult, RoundResult } from './types';
import { CostTracker } from './cost-tracker';
import { interrogate } from './stage-interrogate';
import { fix } from './stage-fix';
import { score } from './stage-score';

function docIdFromFile(filename: string): string {
  return filename.replace(/\.md$/, '');
}

async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('rate') && i < retries) {
        const wait = 2000 * (i + 1) + Math.random() * 1000;
        console.warn(`  Rate limited, waiting ${(wait / 1000).toFixed(1)}s...`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }
      if (msg.includes('non-JSON') && i < retries) {
        console.warn(`  JSON parse failed, retrying...`);
        continue;
      }
      throw err;
    }
  }
  throw new Error('Unreachable');
}

async function processDoc(
  config: PipelineConfig,
  costTracker: CostTracker,
  docFile: string,
): Promise<DocResult> {
  const start = Date.now();
  const docId = docIdFromFile(path.basename(docFile));
  const docContent = fs.readFileSync(docFile, 'utf-8');
  const outDir = path.join(config.output_dir, docId);
  fs.mkdirSync(outDir, { recursive: true });

  let totalTokens = { input: 0, output: 0 };
  const addTokens = (t: { input: number; output: number }) => {
    totalTokens.input += t.input;
    totalTokens.output += t.output;
    costTracker.add(t.input, t.output);
  };

  try {
    // --- Resume support: check for existing artifacts ---
    const gapFile = path.join(outDir, 'gap-analysis.json');
    let gapData: GapAnalysis;
    let startRound = 1;
    const rounds: RoundResult[] = [];
    let currentDoc = docContent;
    let lastScore: ScoreResult | undefined;

    if (config.resume && fs.existsSync(gapFile)) {
      gapData = JSON.parse(fs.readFileSync(gapFile, 'utf-8'));
      console.log(`  [${docId}] Stage 1: Resuming from existing gap-analysis.json`);

      // Find the last completed round
      for (let r = 1; r <= config.max_loops; r++) {
        const scoreFile = path.join(outDir, `score-v${r}.json`);
        const revisedFile = path.join(outDir, `revised-v${r}.md`);
        if (fs.existsSync(scoreFile) && fs.existsSync(revisedFile)) {
          const prevScore = JSON.parse(fs.readFileSync(scoreFile, 'utf-8')) as ScoreResult;
          const revisedDoc = fs.readFileSync(revisedFile, 'utf-8');
          rounds.push({ round: r, revised_doc: revisedDoc, score: prevScore });
          currentDoc = revisedDoc;
          lastScore = prevScore;
          startRound = r + 1;
          console.log(`  [${docId}] Found round ${r}: score=${prevScore.average.toFixed(1)}`);
          if (prevScore.average >= config.pass_threshold) break;
        } else {
          break;
        }
      }

      // Already passed?
      if (lastScore && lastScore.average >= config.pass_threshold) {
        console.log(`  [${docId}] Already passed (${lastScore.average.toFixed(1)} >= ${config.pass_threshold})`);
        const bestRound = rounds.reduce((best, r) => r.score.average > best.score.average ? r : best);
        fs.writeFileSync(path.join(outDir, 'final.md'), bestRound.revised_doc);
        return {
          doc_id: docId, doc_file: docFile, gap_analysis: gapData,
          rounds, final_score: bestRound.score.average, final_doc: bestRound.revised_doc,
          status: 'pass', tokens_used: totalTokens, duration_ms: Date.now() - start,
        };
      }
    } else {
      // Stage 1: Interrogate
      console.log(`  [${docId}] Stage 1: Interrogating...`);
      const gapResult = await withRetry(() => interrogate(config.model, docContent, docId));
      addTokens(gapResult.tokens);
      fs.writeFileSync(gapFile, JSON.stringify(gapResult.data, null, 2));
      console.log(`  [${docId}] Stage 1 done. Weakest: ${gapResult.data.weakest_section}`);
      gapData = gapResult.data;
    }

    // Review-fix loop
    for (let round = startRound; round <= config.max_loops; round++) {
      if (costTracker.overBudget()) {
        console.warn(`  [${docId}] Budget exceeded, stopping at round ${round}`);
        break;
      }

      // Stage 2: Fix
      console.log(`  [${docId}] Stage 2 (round ${round}): Fixing...`);
      const fixResult = await withRetry(() =>
        fix(config.model, currentDoc, gapData, round, lastScore),
      );
      addTokens(fixResult.tokens);
      fs.writeFileSync(path.join(outDir, `revised-v${round}.md`), fixResult.data);

      // Stage 3: Score
      console.log(`  [${docId}] Stage 3 (round ${round}): Scoring...`);
      const scoreResult = await withRetry(() =>
        score(config.model, fixResult.data, docId, round),
      );
      addTokens(scoreResult.tokens);
      fs.writeFileSync(
        path.join(outDir, `score-v${round}.json`),
        JSON.stringify(scoreResult.data, null, 2),
      );

      rounds.push({
        round,
        revised_doc: fixResult.data,
        score: scoreResult.data,
      });

      const avg = scoreResult.data.average;
      console.log(`  [${docId}] Round ${round} score: ${avg.toFixed(1)} ${avg >= config.pass_threshold ? '✓' : '✗'}`);

      if (scoreResult.data.pass) {
        break;
      }

      currentDoc = fixResult.data;
      lastScore = scoreResult.data;
    }

    // Pick best round
    const bestRound = rounds.reduce((best, r) =>
      r.score.average > best.score.average ? r : best,
    );
    fs.writeFileSync(path.join(outDir, 'final.md'), bestRound.revised_doc);

    return {
      doc_id: docId,
      doc_file: docFile,
      gap_analysis: gapData!,
      rounds,
      final_score: bestRound.score.average,
      final_doc: bestRound.revised_doc,
      status: bestRound.score.pass ? 'pass' : 'max_loops',
      tokens_used: totalTokens,
      duration_ms: Date.now() - start,
    };
  } catch (err: any) {
    return {
      doc_id: docId,
      doc_file: docFile,
      gap_analysis: {} as GapAnalysis,
      rounds: [],
      final_score: 0,
      final_doc: '',
      status: 'error',
      error: err.message,
      tokens_used: totalTokens,
      duration_ms: Date.now() - start,
    };
  }
}

export async function runPipeline(config: PipelineConfig): Promise<{
  results: DocResult[];
  costSummary: ReturnType<CostTracker['summary']>;
}> {
  const costTracker = new CostTracker(config.budget);

  // Discover documents
  const files = fs.readdirSync(config.input_dir)
    .filter(f => f.endsWith('.md'))
    .sort();

  const docFiles = config.single_doc
    ? files.filter(f => f.includes(config.single_doc!))
    : files;

  if (docFiles.length === 0) {
    throw new Error(`No .md files found in ${config.input_dir} (filter: ${config.single_doc || 'none'})`);
  }

  console.log(`\nGame Design Auto-Review Pipeline (claude -p mode)`);
  console.log(`  Documents: ${docFiles.length}`);
  console.log(`  Model: ${config.model}`);
  console.log(`  Concurrency: ${config.concurrency}`);
  console.log(`  Max loops: ${config.max_loops}`);
  console.log(`  Threshold: ${config.pass_threshold}`);
  console.log(`  Budget: $${config.budget}`);
  console.log(`  Output: ${config.output_dir}\n`);

  if (config.dry_run) {
    console.log('DRY RUN — would process:');
    for (const f of docFiles) {
      const content = fs.readFileSync(path.join(config.input_dir, f), 'utf-8');
      console.log(`  ${f} (${content.length} chars)`);
    }
    const estCost = docFiles.length * 1.5 * 0.12;
    console.log(`\nEstimated cost: $${estCost.toFixed(2)} (avg 1.5 rounds × $0.12/round)`);
    return { results: [], costSummary: costTracker.summary() };
  }

  fs.mkdirSync(config.output_dir, { recursive: true });

  // Semaphore-based concurrency
  const results: DocResult[] = [];
  const inFlight = new Set<Promise<void>>();

  for (const file of docFiles) {
    if (costTracker.overBudget()) {
      console.warn(`\nBudget exceeded ($${costTracker.currentCost().toFixed(2)}). Stopping.`);
      break;
    }

    if (inFlight.size >= config.concurrency) {
      await Promise.race(inFlight);
    }

    const fullPath = path.join(config.input_dir, file);
    console.log(`Starting: ${file}`);

    const p = processDoc(config, costTracker, fullPath)
      .then(r => {
        results.push(r);
        const icon = r.status === 'pass' ? '✓' : r.status === 'error' ? '✗' : '~';
        console.log(`Done: ${r.doc_id} [${icon}] score=${r.final_score.toFixed(1)} rounds=${r.rounds.length}`);
      })
      .catch(e => {
        results.push({
          doc_id: docIdFromFile(file),
          doc_file: fullPath,
          gap_analysis: {} as GapAnalysis,
          rounds: [],
          final_score: 0,
          final_doc: '',
          status: 'error',
          error: e.message,
          tokens_used: { input: 0, output: 0 },
          duration_ms: 0,
        });
        console.error(`Error: ${file} — ${e.message}`);
      })
      .finally(() => { inFlight.delete(p); });

    inFlight.add(p);
  }

  await Promise.allSettled(inFlight);

  results.sort((a, b) => a.doc_id.localeCompare(b.doc_id));
  return { results, costSummary: costTracker.summary() };
}
