import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import sdk from './server-sdk';

const app = express();
const port = 3000;
const server = new http.Server(app);
const io = new Server(server);

server.listen(port, () => {
  console.log('Listening on port 3000');
});
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.redirect('index.html');
});
sdk.connect(io);

sdk.on('message', (message) => {
  // TS infers the type of `message`
  console.log(
    'Received',
    message.id, // Random id of your preference
    message.content, // String or JSON object
    message.sentAt // Message sent at
  );
});

io.on('connection', (socket) => {
  console.log('connection', socket.id);
  socket.on('close', () => {
    sdk.disconnect();
  });
  const entries = Object.entries(sdk.handlers);
  entries.forEach((entry) => {
    socket.on(entry[0], (message) => {
      entry[1](message);
    });
  });
  socket.on('disconnect', () => {
    console.log('disconnect', socket.id);
  });
  setTimeout(() => {
    const content = { message: 'initial' };
    sdk.send(content);
  }, 5000);
});
