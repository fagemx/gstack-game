/**
 * Types for the game-autoplan pipeline.
 * Adapted from batch-memo-review for game design documents.
 */

export interface GapFinding {
  question_id: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Q5' | 'Q6';
  question_label: string;
  severity: number;             // 0-10 (10 = fully addressed, 0 = missing)
  evidence_found: string;       // What the GDD actually says
  gap_description: string;      // What's weak or missing
  affected_sections: string[];  // Which GDD sections need work
  push_back: string;            // Producer's pushback
  designer_honest_answer: string;
}

export interface GapAnalysis {
  doc_id: string;
  doc_title: string;
  findings: GapFinding[];
  overall_assessment: string;
  strongest_section: string;
  weakest_section: string;
}

export interface DimensionScore {
  dimension: string;
  score: number;           // 0-10
  evidence: string;        // Quote or reference from GDD
  improvement_note: string;
}

export interface ScoreResult {
  doc_id: string;
  round: number;
  dimensions: DimensionScore[];
  average: number;
  pass: boolean;
  summary: string;
}

export interface RoundResult {
  round: number;
  revised_doc: string;
  score: ScoreResult;
}

export interface DocResult {
  doc_id: string;
  doc_file: string;
  gap_analysis: GapAnalysis;
  rounds: RoundResult[];
  final_score: number;
  final_doc: string;
  status: 'pass' | 'max_loops' | 'error';
  error?: string;
  tokens_used: { input: number; output: number };
  duration_ms: number;
}

export interface PipelineConfig {
  input_dir: string;
  output_dir: string;
  concurrency: number;
  max_loops: number;
  pass_threshold: number;
  model: string;
  budget: number;
  dry_run: boolean;
  resume: boolean;
  single_doc?: string;
}

export interface ApiCallResult<T> {
  data: T;
  tokens: { input: number; output: number };
}
