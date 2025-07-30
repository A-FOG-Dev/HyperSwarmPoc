# Hyperswarm Beam

A peer-to-peer file & note beaming tool using [Hyperswarm](https://github.com/hyperswarm/hyperswarm).

## Architecture

The project is organized into three main components:

- **swarm.ts**: A thin wrapper over Hyperswarm for peer discovery and connection management. It exposes a simple interface for joining topics and handling peer connections.
- **receiver.ts**: Handles incoming connections, parses headers, and saves received files or notes to a local `received/` folder. It listens on a specified topic.
- **cli.ts**: A command-line tool for sending files or notes to peers on a specified topic. It connects to peers and sends a JSON header followed by the file or note data.

## Getting Started

### Install dependencies
```sh
npm install
```

### Build the project
```sh
npm run build
```

## Usage

### 1. Start the Receiver
The receiver listens for incoming files or notes on a given topic and saves them to the `received/` folder.

```sh
npm start -- <topic>
```
- Replace `<topic>` with your chosen topic string (must be the same for sender and receiver).
- If no topic is provided, the default is `hyperswarm-beam-demo-topic`.

### 2. Send a File or Note (CLI)
The CLI tool sends a file or note to peers on the same topic.

```sh
node dist/cli.js <topic> <file|note>
```
- `<topic>`: The topic string (must match the receiver's topic).
- `<file|note>`: Path to a file to send, or a text note to beam.

**Examples:**

- Send a file:
  ```sh
  node dist/cli.js mytopic ./path/to/file.txt
  ```
- Send a note:
  ```sh
  node dist/cli.js mytopic "Hello, peer!"
  ```
- Start the receiver for the same topic:
  ```sh
  npm start -- mytopic
  ```

## Roadmap
- [x] Modular architecture (swarm, receiver, cli)
- [x] Topic-based beaming
- [x] File and note transfer
- [ ] CLI improvements (flags, help)
- [ ] Encrypted transfers
- [ ] Progress reporting

## License
MIT 