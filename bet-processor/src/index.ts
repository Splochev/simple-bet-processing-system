import dotenv from 'dotenv';
import amqp from 'amqplib';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL!;
const BET_QUEUE = process.env.BET_QUEUE!;
const RESULT_QUEUE = process.env.RESULT_QUEUE!;

interface Bet {
  userId: string;
  game: string;
  amount: number;
}

interface BetResult extends Bet {
  outcome: 'win' | 'lose';
  payout: number;
  timestamp: string;
}

async function processBet(bet: Bet): Promise<BetResult> {
  const outcome: 'win' | 'lose' = Math.random() < 0.5 ? 'win' : 'lose';
  const payout = outcome === 'win' ? bet.amount * 2 : 0;

  return {
    ...bet,
    outcome,
    payout,
    timestamp: new Date().toISOString(),
  };
}

async function start() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(BET_QUEUE, { durable: false });
    await channel.assertQueue(RESULT_QUEUE, { durable: false });

    console.log(`[✔] Waiting for messages in "${BET_QUEUE}"...`);

    channel.consume(BET_QUEUE, async (msg) => {
      if (msg) {
        const bet: Bet = JSON.parse(msg.content.toString());
        console.log('[📥] Received bet:', bet);

        const result = await processBet(bet);
        console.log('[📤] Sending result:', result);

        channel.sendToQueue(RESULT_QUEUE, Buffer.from(JSON.stringify(result)));
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error('[❌] Error starting bet processor:', err);
  }
}

start();
