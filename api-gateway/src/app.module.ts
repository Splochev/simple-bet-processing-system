import { Module } from '@nestjs/common';
import { BetController } from './bet.controller';

@Module({
  imports: [],
  controllers: [BetController],
  providers: [],
})
export class AppModule {}
