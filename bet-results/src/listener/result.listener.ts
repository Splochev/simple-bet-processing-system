import * as amqp from 'amqplib';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ResultService } from '../results/result.service';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL!;
const BET_QUEUE = process.env.BET_QUEUE!;

@Injectable()
export class ResultListener implements OnModuleInit {
  constructor(private resultService: ResultService) {}

  async onModuleInit() {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(BET_QUEUE, { durable: false });

    console.log(`[✔] Listening for results on "${BET_QUEUE}"`);

    channel.consume(BET_QUEUE, (msg) => {
      if (msg !== null) {
        const result = JSON.parse(msg.content.toString());
        console.log('[📥] Received result:', result);
        this.resultService.storeResult(result);
        channel.ack(msg);
      }
    });
  }
}
