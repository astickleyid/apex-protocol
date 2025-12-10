import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ideaRoutes from './routes/ideas.js';
import chatRoutes from './routes/chat.js';
import pitchRoutes from './routes/pitch.js';
import warRoomRoutes from './routes/warroom.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/ideas', ideaRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/pitch', pitchRoutes);
app.use('/api/warroom', warRoomRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Apex Protocol Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
