const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db/pool');

const app = express();
app.use(cors());
app.use(express.json());

// Test route to check DB connection
app.get('/api/ping-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Database connected', time: result.rows[0].now });
  } catch (err) {
    console.error('DB connection error:', err.message);
    res.status(500).json({ error: 'Database not connected' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Hive server running at http://localhost:${PORT}`);
});
