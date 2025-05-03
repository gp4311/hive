const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/project/:projectId', controller.getTestCasesByProject);
router.get('/:id', controller.getTestCaseById);
router.post('/add', controller.addTestCase);
router.put('/update', controller.updateTestCase);
router.delete('/:id', controller.deleteTestCase);
router.get('/count/:projectId', controller.getTestCaseCountByProject);
router.get('/status-count/:projectId', controller.getTestCaseCountByStatus);
router.get('/pass-percentage/:projectId', controller.getTestCasePassPercentage);

module.exports = router;