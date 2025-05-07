const express = require('express');
const router = express.Router();
const controller = require('./controller');
const authenticateUser = require('../../middlewares/authenticate');

router.post('/register', controller.registerUser);
router.post('/login', controller.loginUser);
router.get('/me', authenticateUser, controller.getCurrentUser);
router.post('/logout', controller.logoutUser);
router.get('/', controller.getAllUsers);

module.exports = router;
