const pool = require('../../db/pool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const queries = require('./queries');

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(queries.createUser, [name, email, hashedPassword]);
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(queries.findUserByEmail, [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const logoutUser = (req, res) => {
  res.json({ message: 'Logout successful (client should remove token)' });
};

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(queries.getAllUsers);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching users' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers
};
