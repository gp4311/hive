const express = require('express');
const router = express.Router();
const controller = require('./controller');
const authenticateUser = require('../../middlewares/authenticate');

router.post('/', controller.createProject);
router.get('/', controller.getAllProjects);
router.get('/my', authenticateUser, controller.getProjectsForUser);
router.get('/:id', controller.getProjectById);
router.put('/:id', controller.updateProject);
router.delete('/:id', controller.deleteProject);

module.exports = router;
