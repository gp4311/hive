const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/add', controller.addUserToProject);
router.post('/remove', controller.removeUserFromProject);
router.post(':projectId', controller.getUsersForProject);

module.exports = router;