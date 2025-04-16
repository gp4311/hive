const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db/pool');

const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require('./models/users/routes');
const projectRoutes = require('./models/projects/routes');
const projectUserRoutes = require('./models/project_users/routes');
const subsystemRoutes = require('./models/subsystems/routes');
const testCasesRoutes = require('./models/test_cases/routes');

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/project-users', projectUserRoutes);
app.use('/api/subsystems', subsystemRoutes);
app.use('/api/test-cases', testCasesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Hive server running at http://localhost:${PORT}`);
});
