const createUser = `
  INSERT INTO users (name, email, password_hash)
  VALUES ($1, $2, $3)
  RETURNING id, name, email, created_at;
`;

const findUserByEmail = `
  SELECT * FROM users WHERE email = $1;
`;

const getUserById = `
  SELECT id, name, email FROM users WHERE id = $1;
`;

const getAllUsers = `
  SELECT id, name, email FROM users ORDER BY name;
`;

const getUserProjectRoles = `
  SELECT 
    p.id AS project_id, 
    p.name AS project_name, 
    pu.role 
  FROM project_users pu
  JOIN projects p ON pu.project_id = p.id
  WHERE pu.user_id = $1;
`;

module.exports = {
  createUser,
  findUserByEmail,
  getUserById,
  getAllUsers,
  getUserProjectRoles
};