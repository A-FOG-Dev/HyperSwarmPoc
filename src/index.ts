import { startReceiver } from './receiver';

const args = process.argv.slice(2);
const topicStr = args[0] || 'hyperswarm-beam-demo-topic';
const topic = Buffer.from(topicStr.padEnd(32), 'utf8');

startReceiver(topic); 