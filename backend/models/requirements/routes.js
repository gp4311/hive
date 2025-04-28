const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/project/:projectId', controller.getRequirementsByProject);
router.get('/:id', controller.getRequirementById);
router.post('/add', controller.addRequirement);
router.put('/update', controller.updateRequirement);
router.delete('/:id', controller.deleteRequirement);

router.post('/link-subsystem', controller.linkSubsystem);
router.post('/unlink-subsystem', controller.unlinkSubsystem);

router.post('/link-testcase', controller.linkTestCase);
router.post('/unlink-testcase', controller.unlinkTestCase);

module.exports = router;