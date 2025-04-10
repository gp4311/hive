const createUser = `
  INSERT INTO users (name, email, password_hash)
  VALUES ($1, $2, $3)
  RETURNING id, name, email, created_at;
`;

const findUserByEmail = `
  SELECT * FROM users WHERE email = $1;
`;

const getAllUsers = `
  SELECT id, name, email FROM users ORDER BY name;
`;

module.exports = {
  createUser,
  findUserByEmail,
  getAllUsers,
};