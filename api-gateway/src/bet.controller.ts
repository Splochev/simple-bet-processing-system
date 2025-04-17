import dotenv from 'dotenv';
import { Controller, Post, Body } from '@nestjs/common';
import { connect, Connection } from 'amqplib';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL!;
const BET_QUEUE = process.env.BET_QUEUE!;

@Controller('bet')
export class BetController {
  @Post()
  async placeBet(@Body() body: any) {
    const connection: Connection = await connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(BET_QUEUE, { durable: false });
    channel.sendToQueue(BET_QUEUE, Buffer.from(JSON.stringify(body)));

    console.log('Bet sent:', body);
    return { status: 'Bet submitted!' };
  }
}