const multer = require('multer')

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf']
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Only Images (jpeg, jpg, png) and PDFs allowed!'))
    }
}

const storage = multer.memoryStorage()

const upload = multer({
    storage,
    fileFilter,
})

module.exports = upload
