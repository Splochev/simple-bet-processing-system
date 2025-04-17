import * as amqp from 'amqplib';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ResultService } from '../results/result.service';
import dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class ResultListener implements OnModuleInit {
  constructor(private resultService: ResultService) {}

  async onModuleInit() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    const channel = await connection.createChannel();

    const queue = process.env.RESULT_QUEUE!;
    await channel.assertQueue(queue, { durable: false });

    console.log(`[✔] Listening for results on "${queue}"`);

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const result = JSON.parse(msg.content.toString());
        console.log('[📥] Received result:', result);
        this.resultService.storeResult(result);
        channel.ack(msg);
      }
    });
  }
}
