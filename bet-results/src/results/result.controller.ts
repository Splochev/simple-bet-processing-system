import { Controller, Get, Param } from '@nestjs/common';
import { ResultService, BetResult } from './result.service';

@Controller('results')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Get(':userId')
  getResults(@Param('userId') userId: string): BetResult[] {
    return this.resultService.getResultsForUser(userId);
  }
}
