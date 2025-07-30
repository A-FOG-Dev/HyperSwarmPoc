import { Swarm } from './swarm';
import { Socket } from 'net';
import * as fs from 'fs';
import * as path from 'path';

const RECEIVED_DIR = path.join(process.cwd(), 'received');
if (!fs.existsSync(RECEIVED_DIR)) fs.mkdirSync(RECEIVED_DIR);

export function startReceiver(topic: Buffer) {
  const swarm = new Swarm();
  swarm.join(topic);

  swarm.on('connection', (socket: Socket) => {
    console.log('[Receiver] New peer connected');
    let header = '';
    let headerParsed = false;
    let writeStream: fs.WriteStream | null = null;
    let totalBytes = 0;
    let filename = '';

    socket.on('data', (data: Buffer) => {
      if (!headerParsed) {
        header += data.toString();
        const headerEnd = header.indexOf('\n');
        if (headerEnd !== -1) {
          const headerStr = header.slice(0, headerEnd);
          try {
            const meta = JSON.parse(headerStr);
            filename = meta.filename || `received_${Date.now()}`;
            const filepath = path.join(RECEIVED_DIR, filename);
            writeStream = fs.createWriteStream(filepath);
            headerParsed = true;
            const rest = data.slice(headerEnd + 1);
            if (rest.length && writeStream) {
              writeStream.write(rest);
              totalBytes += rest.length;
              console.log(`[Receiver] Writing to ${filename}: ${totalBytes} bytes`);
            }
            console.log(`[Receiver] Header received. Saving as ${filename}`);
          } catch (e) {
            console.error('[Receiver] Invalid header:', e);
            socket.destroy();
          }
        }
      } else if (writeStream) {
        writeStream.write(data);
        totalBytes += data.length;
        console.log(`[Receiver] Writing to ${filename}: ${totalBytes} bytes`);
      }
    });

    socket.on('end', () => {
      if (writeStream) writeStream.end();
      console.log(`[Receiver] File/note received and saved as ${filename}. Total bytes: ${totalBytes}`);
    });
  });
} 