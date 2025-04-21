const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/upload', controller.upload.single('file'), controller.uploadFile);
router.get('/:link', controller.getFileByLink);
router.delete('/:link', controller.deleteFileByLink);

module.exports = router;
