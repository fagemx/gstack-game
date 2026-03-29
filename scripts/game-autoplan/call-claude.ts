/**
 * Shared helper to call claude -p as a subprocess.
 * Uses the user's Claude subscription — no API key needed.
 */

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export interface ClaudeResult {
  text: string;
  cost_usd: number;
  input_tokens: number;
  output_tokens: number;
  duration_ms: number;
}

export async function callClaude(
  prompt: string,
  model: string,
  maxTokens: number = 16384,
): Promise<ClaudeResult> {
  const start = Date.now();

  // Write prompt to temp file to avoid shell escaping issues
  const tmpFile = path.join(
    os.tmpdir(),
    `.game-autoplan-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
  fs.writeFileSync(tmpFile, prompt);

  try {
    const proc = Bun.spawn(
      ['sh', '-c', `cat "${tmpFile}" | claude -p --model ${model} --output-format stream-json --verbose --max-turns 3 --dangerously-skip-permissions`],
      { stdout: 'pipe', stderr: 'pipe' },
    );

    const stdout = await new Response(proc.stdout).text();
    const stderr = await new Response(proc.stderr).text();
    const exitCode = await proc.exited;

    if (exitCode !== 0 && !stdout.trim()) {
      throw new Error(`claude -p exited with code ${exitCode}: ${stderr.slice(0, 500)}`);
    }

    // Parse NDJSON — find the result line and assistant text
    const lines = stdout.split('\n').filter(l => l.trim());
    let resultText = '';
    let cost = 0;
    let inputTokens = 0;
    let outputTokens = 0;

    for (const line of lines) {
      try {
        const event = JSON.parse(line);
        if (event.type === 'assistant' && event.message?.content) {
          for (const block of event.message.content) {
            if (block.type === 'text') {
              resultText += block.text;
            }
          }
        }
        if (event.type === 'result') {
          resultText = resultText || event.result || '';
          cost = event.total_cost_usd || 0;
          inputTokens = event.usage?.input_tokens || 0;
          outputTokens = event.usage?.output_tokens || 0;
        }
      } catch {
        // skip non-JSON lines
      }
    }

    if (!resultText) {
      throw new Error(`claude -p returned empty response. stderr: ${stderr.slice(0, 300)}`);
    }

    return {
      text: resultText,
      cost_usd: cost,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      duration_ms: Date.now() - start,
    };
  } finally {
    try { fs.unlinkSync(tmpFile); } catch {}
  }
}
