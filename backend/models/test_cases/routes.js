const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/:projectId', controller.getTestCasesByProject);
router.post('/add', controller.addTestCase);
router.put('/update', controller.updateTestCase);
router.delete('/:id', controller.deleteTestCase);

module.exports = router;