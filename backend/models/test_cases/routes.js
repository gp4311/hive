const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/project/:projectId', controller.getTestCasesByProject);
router.get('/:id', controller.getTestCaseById);
router.post('/add', controller.addTestCase);
router.put('/update', controller.updateTestCase);
router.delete('/:id', controller.deleteTestCase);

module.exports = router;