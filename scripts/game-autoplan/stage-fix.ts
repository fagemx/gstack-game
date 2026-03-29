/**
 * Stage 2: Auto-Fix
 * Revises weak sections of the game design doc based on gap analysis.
 * Output is markdown (not JSON).
 */

import type { GapAnalysis, ScoreResult, ApiCallResult } from './types';
import { fixPrompt } from './prompts';
import { callClaude } from './call-claude';

export async function fix(
  model: string,
  docContent: string,
  gapAnalysis: GapAnalysis,
  round: number,
  previousScore?: ScoreResult,
): Promise<ApiCallResult<string>> {
  const gapJson = JSON.stringify(gapAnalysis, null, 2);
  const prevScoreStr = previousScore
    ? previousScore.dimensions.map(d => `${d.dimension}: ${d.score}/10`).join(', ')
    : undefined;

  const prompt = fixPrompt(docContent, gapJson, round, prevScoreStr);
  const result = await callClaude(prompt, model, 8192);

  return {
    data: result.text.trim(),
    tokens: { input: result.input_tokens, output: result.output_tokens },
  };
}
