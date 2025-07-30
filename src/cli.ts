#!/usr/bin/env node
import { Swarm } from './swarm';
import * as fs from 'fs';
import * as path from 'path';

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: cli <topic> <file|note>');
  process.exit(1);
}

const [topicStr, input] = args;
const topic = Buffer.from(topicStr.padEnd(32), 'utf8');

const swarm = new Swarm();
swarm.join(topic);

console.log('[Sender] Waiting for peer to connect...');
swarm.on('connection', (socket) => {
  let header: any;
  let data: Buffer;
  if (fs.existsSync(input) && fs.statSync(input).isFile()) {
    // Send file
    const filename = path.basename(input);
    header = { filename };
    data = fs.readFileSync(input);
    console.log(`[Sender] Sending file: ${filename} (${data.length} bytes)`);
  } else {
    // Send note
    header = { filename: `note_${Date.now()}.txt` };
    data = Buffer.from(input, 'utf8');
    console.log(`[Sender] Sending note: ${header.filename} (${data.length} bytes)`);
  }
  socket.write(JSON.stringify(header) + '\n');
  console.log('[Sender] Header sent');
  socket.write(data);
  console.log(`[Sender] Data sent (${data.length} bytes)`);
  socket.end();
  console.log('[Sender] Transfer complete.');
  process.exit(0);
}); 