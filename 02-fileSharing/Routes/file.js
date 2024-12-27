import express from "express";

const router = express.Router();

const fileController = require('../Controller/file')

router.post('/file',fileController.saveFile);

router.get('/file/download/:fileId',fileController.downloadFile);

router.delete('/file/:fileId', fileController.deleteFile);

router.post('/file/send', fileController.sendFileLink);

module.exports = router;