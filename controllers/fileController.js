const cloudinary = require('../config/cloudinary')
const AsyncHandler = require('express-async-handler')
const extractTextFromFile = require('../services/fileExtractor')
const summarizeTextWithGemini = require('../services/geminiService')

const uploadFile = AsyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400)
        throw new Error('No file uploaded')
    }
    const streamUpload = (fileBuffer, fileName) => {
        return new Promise((resolve, reject) => {
            const isPDF = fileName.toLowerCase().endsWith('.pdf');
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: isPDF ? 'raw' : 'auto' },
                (error, result) => {
                    if (result) {
                        resolve(result)
                    } else {
                        reject(error)
                    }
                }
            )
            stream.end(fileBuffer)
        })
    }

    try {
        const result = await streamUpload(req.file.buffer, req.file.originalname)
        res.json({
            message: 'File uploaded successfully',
            url: result.secure_url,
            public_id: result.public_id,
            resource_type: result.resource_type,
        })
    } catch (error) {
        res.status(500)
        throw new Error('Cloudinary upload failed')
    }
})

const uploadAndSummarizeFile = AsyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400)
        throw new Error('No file uploaded')
    }

    const uploadResult = await new Promise((resolve, reject) => {
        const fileName = req.file.originalname.toLowerCase();
        const isPDF = fileName.endsWith('.pdf');

        const stream = cloudinary.uploader.upload_stream(
            { resource_type: isPDF ? 'raw' : 'auto' },      
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        stream.end(req.file.buffer)
    })

    const { secure_url, public_id, resource_type } = uploadResult
    console.log('Uploaded Resource Type:', resource_type)

    try {
        const extractedText = await extractTextFromFile(secure_url, req.file.originalname);
        console.log('Extracted Text:', extractedText)

        const summary = await summarizeTextWithGemini(extractedText)

        res.json({
            message: 'File uploaded & summarized successfully',
            url: secure_url,
            public_id,
            resource_type,
            summary,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: error.message,
            gemini: error.geminiDetails || error.response?.data || null
        });
    }
})

module.exports = { uploadFile, uploadAndSummarizeFile }
