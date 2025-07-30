declare module 'hyperswarm' {
  import { EventEmitter } from 'events';
  import { Duplex } from 'stream';

  export interface PeerInfo {
    publicKey: Buffer;
    topics: Buffer[];
    prioritized: boolean;
    ban: (banStatus?: boolean) => void;
  }

  export interface HyperswarmOptions {
    keyPair?: any;
    seed?: Buffer;
    maxPeers?: number;
    firewall?: (remotePublicKey: Buffer) => boolean;
    dht?: any;
  }

  export class Hyperswarm extends EventEmitter {
    constructor(options?: HyperswarmOptions);
    join(topic: Buffer, opts?: { lookup?: boolean; announce?: boolean }): any;
    leave(topic: Buffer): Promise<void>;
    destroy(): void;
    on(event: 'connection', listener: (socket: Duplex, peerInfo: PeerInfo) => void): this;
  }

  export default Hyperswarm;
} 