/**
 * Token usage and cost tracking for the game-autoplan pipeline.
 * Sonnet pricing: $3/M input, $15/M output.
 */

const INPUT_COST_PER_M = 3;
const OUTPUT_COST_PER_M = 15;

export class CostTracker {
  private totalInput = 0;
  private totalOutput = 0;
  private budget: number;
  private warned80 = false;

  constructor(budget: number) {
    this.budget = budget;
  }

  add(input: number, output: number): void {
    this.totalInput += input;
    this.totalOutput += output;

    const cost = this.currentCost();
    if (!this.warned80 && cost >= this.budget * 0.8) {
      this.warned80 = true;
      console.warn(`⚠ Budget 80% reached: $${cost.toFixed(2)} / $${this.budget}`);
    }
  }

  currentCost(): number {
    return (this.totalInput / 1_000_000) * INPUT_COST_PER_M
      + (this.totalOutput / 1_000_000) * OUTPUT_COST_PER_M;
  }

  overBudget(): boolean {
    return this.currentCost() >= this.budget;
  }

  summary() {
    return {
      total_input_tokens: this.totalInput,
      total_output_tokens: this.totalOutput,
      total_cost_usd: Number(this.currentCost().toFixed(4)),
      budget_usd: this.budget,
      budget_used_pct: Number(((this.currentCost() / this.budget) * 100).toFixed(1)),
    };
  }
}
