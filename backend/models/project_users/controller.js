const pool = require('../../db/pool');
const queries = require('./queries');

const addUserToProject = async (req, res) => {
  const { user_id, project_id, role } = req.body;
  try {
    await pool.query(queries.addUserToProject, [user_id, project_id, role]);
    res.status(201).json({ message: 'User added to project' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding user to project' });
  }
};

const removeUserFromProject = async (req, res) => {
  const { user_id, project_id } = req.body;
  try {
    await pool.query(queries.removeUserFromProject, [user_id, project_id]);
    res.status(200).json({ message: 'User removed from project' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error removing user from project' });
  }
};

const getUsersForProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const result = await pool.query(queries.getUsersForProject, [projectId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching project users' });
  }
};

const updateUserRole = async (req, res) => {
  const { user_id, project_id, role } = req.body;

  if (!user_id || !project_id || !role) {
    return res.status(400).json({ error: 'Missing user_id, project_id or role' });
  }

  try {
    await pool.query(queries.updateUserRole, [user_id, project_id, role]);
    res.status(200).json({ message: 'User role updated successfully' });
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

module.exports = {
  addUserToProject,
  removeUserFromProject,
  getUsersForProject,
  updateUserRole
};