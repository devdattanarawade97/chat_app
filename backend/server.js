import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000','https://chat-app-snowy-six.vercel.app/'] ,// Frontend URL
    methods: ['GET', 'POST'],
  },
});



app.use(cors());

const PORT = 5000;

let users = [];

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (name) => {
    // Add user to the user list
    users.push({ id: socket.id, username: name });

    // Emit updated user list to all clients
    io.emit('updateUserList', users);

    // Notify user that they have joined
    console.log(`${name} has joined`);

    
  });
    
  socket.on('disconnectNow', (name) => {
    // Remove user from the list on disconnect
    users = users.filter((user) => user.id !== socket.id);

    // Emit updated user list to all clients
    io.emit('updateUserList', users);
    console.log(`${name} has disconnected`);
  });
    
  socket.on('sendMessage', ({ sender, recipient, message }) => {
    io.to(recipient).emit('receiveMessage', { sender, message });
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
