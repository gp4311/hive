const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/', controller.createProject);
router.get('/', controller.getAllProjects);
router.get('/:id', controller.getProjectById);
router.put('/:id', controller.updateProject);
router.delete('/:id', controller.deleteProject);

module.exports = router;
