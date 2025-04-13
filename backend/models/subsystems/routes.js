const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/:projectId', controller.getSubsystemsByProject);
router.post('/add', controller.addSubsystem);
router.put('/update', controller.updateSubsystem);
router.delete('/:id', controller.deleteSubsystem);

module.exports = router;
