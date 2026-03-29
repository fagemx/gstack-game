/**
 * Stage 3: Independent Game Design Scoring
 * Scores a document on 6 game dimensions (0-10). Does NOT see the fixer's reasoning.
 */

import type { ScoreResult, ApiCallResult } from './types';
import { scorePrompt } from './prompts';
import { callClaude } from './call-claude';

export async function score(
  model: string,
  docContent: string,
  docId: string,
  round: number,
): Promise<ApiCallResult<ScoreResult>> {
  const prompt = scorePrompt(docContent, docId, round);
  const result = await callClaude(prompt, model, 8192);

  const jsonMatch = result.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Stage 3 returned non-JSON for ${docId}: ${result.text.slice(0, 200)}`);
  }

  const data = JSON.parse(jsonMatch[0]) as ScoreResult;
  // Recalculate average to prevent model arithmetic errors
  if (data.dimensions?.length) {
    data.average = Number(
      (data.dimensions.reduce((sum, d) => sum + d.score, 0) / data.dimensions.length).toFixed(1),
    );
    data.pass = data.average >= 7;
  }

  return {
    data,
    tokens: { input: result.input_tokens, output: result.output_tokens },
  };
}
