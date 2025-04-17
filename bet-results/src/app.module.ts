import { Module } from '@nestjs/common';
import { ResultService } from './results/result.service';
import { ResultController } from './results/result.controller';
import { ResultListener } from './listener/result.listener';

@Module({
  controllers: [ResultController],
  providers: [ResultService, ResultListener],
})
export class AppModule {}
