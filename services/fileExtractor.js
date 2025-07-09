const axios = require('axios')
const pdfParse = require('pdf-parse')
const Tesseract = require('tesseract.js')

const extractTextFromFile = async (fileUrl, fileName) => {
    try {
        console.log('Starting text extraction from:', fileUrl)

        const response = await axios.get(fileUrl, { responseType: 'arraybuffer' })
        const buffer = Buffer.from(response.data)

        const fileExtension = fileName.split('.').pop().toLowerCase()
        console.log('Detected file extension:', fileExtension)

        if (['jpg', 'jpeg', 'png', 'webp', 'bmp'].includes(fileExtension)) {
            console.log('Detected resourceType: image')
            const { data: { text } } = await Tesseract.recognize(buffer, 'eng')
            return text.trim() || 'No text found in image.'
        } else if (fileExtension === 'pdf') {
            console.log('Detected resourceType: pdf')
            const data = await pdfParse(buffer)
            return data.text.trim() || 'No text found in PDF.'
        } else {
            throw new Error(`Unsupported file type: .${fileExtension}`)
        }
    } catch (error) {
        console.error('File Extraction Error:', error.message)
        throw new Error('Failed to extract text from file.')
    }
}

module.exports = extractTextFromFile
