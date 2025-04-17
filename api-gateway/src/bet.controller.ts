import { Controller, Post, Body } from '@nestjs/common';
import { connect, Connection } from 'amqplib';

@Controller('bet')
export class BetController {
  @Post()
  async placeBet(@Body() body: any) {
    const connection: Connection = await connect('amqp://user:password@localhost');
    const channel = await connection.createChannel();
    const queue = 'bets';

    await channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(body)));

    console.log('Bet sent:', body);
    return { status: 'Bet submitted!' };
  }
}