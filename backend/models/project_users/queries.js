const addUserToProject = `
  INSERT INTO project_users (user_id, project_id, role)
  VALUES ($1, $2, $3)
  ON CONFLICT (user_id, project_id) DO NOTHING;
`;

const removeUserFromProject = `
  DELETE FROM project_users WHERE user_id = $1 AND project_id = $2;
`;

const getUsersForProject = `
  SELECT u.id, u.name, u.email, pu.role
  FROM project_users pu
  JOIN users u ON pu.user_id = u.id
  WHERE pu.project_id = $1;
`;

const updateUserRole = `
  UPDATE project_users
  SET role = $3
  WHERE user_id = $1 AND project_id = $2
`;

module.exports = {
    addUserToProject,
    removeUserFromProject,
    getUsersForProject,
    updateUserRole
};