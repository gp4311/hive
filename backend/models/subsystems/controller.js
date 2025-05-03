const pool = require('../../db/pool');
const queries = require('./queries');

const getSubsystemsByProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const result = await pool.query(queries.getSubsystemsByProject, [projectId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error getting subsystems:', err);
    res.status(500).json({ error: 'Failed to get subsystems' });
  }
};

const addSubsystem = async (req, res) => {
  const { project_id, name, description } = req.body;

  try {
    const result = await pool.query(queries.addSubsystem, [project_id, name, description]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding subsystem:', err);
    res.status(500).json({ error: 'Failed to add subsystem' });
  }
};

const updateSubsystem = async (req, res) => {
  const { id, name, description } = req.body;

  try {
    const result = await pool.query(queries.updateSubsystem, [id, name, description]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error updating subsystem:', err);
    res.status(500).json({ error: 'Failed to update subsystem' });
  }
};

const deleteSubsystem = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(queries.deleteSubsystem, [id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting subsystem:', err);
    res.status(500).json({ error: 'Failed to delete subsystem' });
  }
};

const getSubsystemCountByProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const result = await pool.query(queries.getSubsystemCountByProject, [projectId]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error getting subsystem count:', err);
    res.status(500).json({ error: 'Failed to get subsystem count' });
  }
};

const getRequirementCountPerSubsystem = async (req, res) => {
  const { projectId } = req.params;

  try {
    const result = await pool.query(queries.getRequirementCountPerSubsystem, [projectId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error getting requirements per subsystem:', err);
    res.status(500).json({ error: 'Failed to get requirement counts' });
  }
};

module.exports = {
  getSubsystemsByProject,
  addSubsystem,
  updateSubsystem,
  deleteSubsystem,
  getSubsystemCountByProject,
  getRequirementCountPerSubsystem
};