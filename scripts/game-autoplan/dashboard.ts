/**
 * Generate summary dashboard from game-autoplan results.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { DocResult } from './types';

export function generateDashboard(
  results: DocResult[],
  costSummary: any,
  outputDir: string,
): void {
  // Machine-readable
  fs.writeFileSync(
    path.join(outputDir, 'dashboard.json'),
    JSON.stringify({ results: results.map(summarize), cost: costSummary }, null, 2),
  );
  fs.writeFileSync(
    path.join(outputDir, 'cost-report.json'),
    JSON.stringify(costSummary, null, 2),
  );

  // Human-readable
  const md = buildMarkdown(results, costSummary);
  fs.writeFileSync(path.join(outputDir, 'dashboard.md'), md);
  console.log(`\nDashboard written to ${path.join(outputDir, 'dashboard.md')}`);
}

function summarize(r: DocResult) {
  const weakest = r.rounds.length > 0
    ? r.rounds[r.rounds.length - 1].score.dimensions
        .reduce((min, d) => d.score < min.score ? d : min)
    : null;
  const strongest = r.rounds.length > 0
    ? r.rounds[r.rounds.length - 1].score.dimensions
        .reduce((max, d) => d.score > max.score ? d : max)
    : null;

  return {
    doc_id: r.doc_id,
    status: r.status,
    final_score: r.final_score,
    rounds: r.rounds.length,
    weakest: weakest?.dimension,
    strongest: strongest?.dimension,
    error: r.error,
  };
}

function buildMarkdown(results: DocResult[], costSummary: any): string {
  const lines: string[] = [];
  const passed = results.filter(r => r.status === 'pass');
  const maxLoops = results.filter(r => r.status === 'max_loops');
  const errors = results.filter(r => r.status === 'error');

  lines.push('# Game Design Auto-Review Dashboard');
  lines.push(`\n> Generated: ${new Date().toISOString()}`);
  lines.push(`> Documents: ${results.length} | Pass: ${passed.length} | Needs Work: ${maxLoops.length} | Errors: ${errors.length}`);
  lines.push(`> Cost: $${costSummary.total_cost_usd} (${costSummary.budget_used_pct}% of $${costSummary.budget_usd} budget)`);

  // Summary table
  lines.push('\n## Results\n');
  lines.push('| # | Document | Score | Rounds | Status | Weakest | Strongest |');
  lines.push('|---|----------|-------|--------|--------|---------|-----------|');
  for (const r of results) {
    const s = summarize(r);
    const icon = s.status === 'pass' ? '✓' : s.status === 'error' ? '✗' : '~';
    lines.push(`| ${s.doc_id.slice(0, 20)} | ${s.doc_id} | ${s.final_score.toFixed(1)} | ${s.rounds} | ${icon} ${s.status} | ${s.weakest || '-'} | ${s.strongest || '-'} |`);
  }

  // Dimension weakness analysis
  if (results.some(r => r.rounds.length > 0)) {
    const dimTotals: Record<string, { sum: number; count: number }> = {};
    for (const r of results) {
      const lastRound = r.rounds[r.rounds.length - 1];
      if (!lastRound) continue;
      for (const d of lastRound.score.dimensions) {
        if (!dimTotals[d.dimension]) dimTotals[d.dimension] = { sum: 0, count: 0 };
        dimTotals[d.dimension].sum += d.score;
        dimTotals[d.dimension].count += 1;
      }
    }

    lines.push('\n## Dimension Analysis (across all documents)\n');
    lines.push('| Dimension | Avg Score | Interpretation |');
    lines.push('|-----------|-----------|----------------|');
    const sorted = Object.entries(dimTotals)
      .map(([dim, t]) => ({ dim, avg: t.sum / t.count }))
      .sort((a, b) => a.avg - b.avg);
    for (const { dim, avg } of sorted) {
      const interp = avg >= 8 ? 'Strong' : avg >= 7 ? 'OK' : avg >= 5 ? 'Needs work' : 'Weak';
      lines.push(`| ${dim} | ${avg.toFixed(1)} | ${interp} |`);
    }
  }

  // Top / Bottom
  const scored = results.filter(r => r.final_score > 0).sort((a, b) => b.final_score - a.final_score);
  if (scored.length >= 3) {
    lines.push('\n## Top Designs\n');
    for (const r of scored.slice(0, 3)) {
      lines.push(`- **${r.doc_id}** — ${r.final_score.toFixed(1)}`);
    }
    lines.push('\n## Needs Most Work\n');
    for (const r of scored.slice(-3)) {
      lines.push(`- **${r.doc_id}** — ${r.final_score.toFixed(1)}`);
    }
  }

  // Errors
  if (errors.length > 0) {
    lines.push('\n## Errors\n');
    for (const r of errors) {
      lines.push(`- **${r.doc_id}**: ${r.error}`);
    }
  }

  return lines.join('\n');
}
