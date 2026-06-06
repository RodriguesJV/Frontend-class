const express = require('express');
const cors = require('cors');
const { settingsRouter } = require('./routes/settings.routes');
const { tasksRouter } = require('./routes/tasks.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/settings', settingsRouter);
app.use('/tasks', tasksRouter);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

module.exports = { app };