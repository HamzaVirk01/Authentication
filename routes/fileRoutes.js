const express = require('express')
const upload = require('../middleware/upload')
const { uploadFile, uploadAndSummarizeFile } = require('../controllers/fileController')

const router = express.Router()

router.post('/upload', upload.single('file'), uploadFile)
router.post('/upload-summary', upload.single('file'), uploadAndSummarizeFile)

module.exports = router
