/**
 * Stage 1: Game Design Interrogation
 * Agent plays Senior Producer + Designer dual role, produces gap analysis.
 */

import type { GapAnalysis, ApiCallResult } from './types';
import { interrogatePrompt } from './prompts';
import { callClaude } from './call-claude';

export async function interrogate(
  model: string,
  docContent: string,
  docId: string,
): Promise<ApiCallResult<GapAnalysis>> {
  const prompt = interrogatePrompt(docContent, docId);
  const result = await callClaude(prompt, model, 16384);

  const jsonMatch = result.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Stage 1 returned non-JSON for ${docId}: ${result.text.slice(0, 200)}`);
  }

  return {
    data: JSON.parse(jsonMatch[0]) as GapAnalysis,
    tokens: { input: result.input_tokens, output: result.output_tokens },
  };
}
