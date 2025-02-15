import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST']
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

const documentState = {
  content: '',
  version: 0,
  lastModified: new Date(),
  history: []
};

const connectedUsers = new Map();
const MAX_HISTORY_LENGTH = 100;

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

function generateUserId() {
  return `user-${Math.random().toString(16).slice(2, 10)}`;
}

function updateDocumentState(delta, userId) {
  documentState.content += delta;
  documentState.version += 1;
  documentState.lastModified = new Date();
  documentState.history.push({
    delta,
    userId,
    timestamp: new Date(),
    version: documentState.version
  });
  if (documentState.history.length > MAX_HISTORY_LENGTH) {
    documentState.history.shift();
  }
  return documentState.content;
}

function getUserInfo(userId) {
  return {
    id: userId,
    lastActive: new Date(),
    cursor: null
  };
}

io.on('connection', (socket) => {
  const userId = generateUserId();
  const userInfo = getUserInfo(userId);
  connectedUsers.set(socket.id, userInfo);

  socket.emit('init', {
    content: documentState.content,
    userId,
    users: Array.from(connectedUsers.values()),
    version: documentState.version
  });

  socket.broadcast.emit('user-connected', userInfo);

  socket.on('text-update', ({ delta, userId, cursorPosition }) => {
    try {
      if (typeof delta !== 'string' || delta.length === 0) {
        throw new Error('Invalid delta');
      }
      updateDocumentState(delta, userId);
      if (cursorPosition !== undefined) {
        const user = connectedUsers.get(socket.id);
        if (user) {
          user.cursor = cursorPosition;
          user.lastActive = new Date();
        }
      }
      socket.broadcast.emit('text-update', {
        delta,
        userId,
        version: documentState.version,
        cursorPosition
      });
    } catch (error) {
      console.error('Error processing text update:', error);
      socket.emit('error', {
        message: 'Failed to process text update',
        code: 'UPDATE_FAILED'
      });
    }
  });

  socket.on('cursor-update', ({ position }) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      user.cursor = position;
      user.lastActive = new Date();
      socket.broadcast.emit('cursor-update', { userId, position });
    }
  });

  socket.on('activity', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      user.lastActive = new Date();
    }
  });

  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      connectedUsers.delete(socket.id);
      io.emit('user-disconnected', user.id);
    }
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
    socket.emit('error', {
      message: 'An unexpected error occurred',
      code: 'SOCKET_ERROR'
    });
  });
});

app.get('/api/document/status', (_, res) => {
  res.json({
    version: documentState.version,
    lastModified: documentState.lastModified,
    activeUsers: connectedUsers.size
  });
});

app.get('/api/document/history', (_, res) => {
  res.json({
    history: documentState.history
  });
});

app.use((err, _, res, __) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

server.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});