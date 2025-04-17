import { Injectable } from '@nestjs/common';

export interface BetResult {
  userId: string;
  game: string;
  amount: number;
  outcome: 'win' | 'lose';
  payout: number;
  timestamp: string;
}

@Injectable()
export class ResultService {
  private results: Record<string, BetResult[]> = {};

  storeResult(result: BetResult) {
    if (!this.results[result.userId]) {
      this.results[result.userId] = [];
    }
    this.results[result.userId].push(result);
  }

  getResultsForUser(userId: string): BetResult[] {
    return this.results[userId] || [];
  }
}
