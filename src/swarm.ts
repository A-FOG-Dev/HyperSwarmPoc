import Hyperswarm, { Hyperswarm as HyperswarmType, HyperswarmOptions, PeerInfo } from 'hyperswarm';
import { EventEmitter } from 'events';
import { Duplex } from 'stream';

export class Swarm extends EventEmitter {
  private swarm: HyperswarmType;

  constructor(options?: HyperswarmOptions) {
    super();
    this.swarm = new Hyperswarm(options);
    console.log('[Swarm] Swarm instance created');
    this.swarm.on('connection', (socket: Duplex, details: PeerInfo) => {
      console.log('[Swarm] Connection event: new peer connected');
      this.emit('connection', socket, details);
    });
  }

  join(topic: Buffer, opts = { lookup: true, announce: true }) {
    this.swarm.join(topic, opts);
    console.log(`[Swarm] Joined topic: ${topic.toString('hex')}`);
  }

  destroy() {
    this.swarm.destroy();
    console.log('[Swarm] Swarm destroyed');
  }
} 