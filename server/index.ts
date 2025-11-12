import express from 'express';
import cors from 'cors';
import { db } from './db';
import { logs } from '../shared/schema';
import { eq } from 'drizzle-orm';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Get all logs
app.get('/api/logs', async (req, res) => {
  try {
    const allLogs = await db.select().from(logs);
    res.json(allLogs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// Create a new log
app.post('/api/logs', async (req, res) => {
  try {
    const newLog = req.body;
    const logData = {
      ...newLog,
      timestamp: new Date(newLog.timestamp),
    };
    const [insertedLog] = await db.insert(logs).values(logData).returning();
    res.status(201).json(insertedLog);
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({ error: 'Failed to create log' });
  }
});

// Delete a log
app.delete('/api/logs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(logs).where(eq(logs.id, id));
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting log:', error);
    res.status(500).json({ error: 'Failed to delete log' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
