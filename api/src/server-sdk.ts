import fs from 'fs';
import { Server } from 'socket.io';

interface Message {
  id: number;
  content: any;
  sentAt: number;
}
type Handler = (message: Message) => void;
const handlers: Record<string, Handler> = {};
let io: Server;
const sdk = {
  handlers,
  connect(ioServer: Server) {
    io = ioServer;
  },
  on(key: string, handler: Handler) {
    sdk.handlers[key] = (message: Message) => {
      console.log('message', message);
      const string = JSON.stringify(message.content);
      const log = `RECV:${string}\n`;
      fs.appendFileSync('./log.txt', log);
      io.emit('relay', message);
      handler(message);
    };
  },
  send(content: any) {
    const string = JSON.stringify(content);
    const log = `SEND:${string}\n`;
    fs.appendFileSync('./log.txt', log);
    io.emit('message', {
      id: Math.random(),
      content,
      sentAt: Date.now(),
    });
  },
  disconnect() {
    io.close();
  },
};

export default sdk;
