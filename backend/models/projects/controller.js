const pool = require('../../db/pool');
const queries = require('./queries');

const createProject = async (req, res) => {
  const { name, description, status, start_date, end_date} = req.body;
  try {
    const result = await pool.query(queries.createProject, [
      name,
      description,
      status,
      start_date,
      end_date
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating project' });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const result = await pool.query(queries.getAllProjects);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching projects' });
  }
};

const getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(queries.getProjectById, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching project' });
  }
};

const getProjectsForUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(queries.getProjectsForUser, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching user projects' });
  }
};

const updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description, status, start_date, end_date } = req.body;
  try {
    const result = await pool.query(queries.updateProject, [
      name,
      description,
      status,
      start_date,
      end_date,
      id
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating project' });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(queries.deleteProject, [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting project' });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  getProjectsForUser,
  updateProject,
  deleteProject,
};
