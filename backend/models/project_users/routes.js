const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/add', controller.addUserToProject);
router.post('/remove', controller.removeUserFromProject);
router.get('/:projectId', controller.getUsersForProject);
router.post('/update-role', controller.updateUserRole);

module.exports = router;