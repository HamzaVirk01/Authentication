const axios = require('axios')

const USE_MOCK = false

const summarizeTextWithGemini = async (text) => {   
    try {
        if (USE_MOCK) {
            console.log('⚠️ Using MOCK Gemini API response for testing.')
            return `This is a mocked summary of your text: "${text.slice(0, 100)}..." (truncated)`
        }
        const API_KEY = process.env.GEMINI_API_KEY
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`

        const limitedText = text.slice(0, 10000)
        const payload = {
            contents: [
                {
                    parts: [{ text: `Summarize the following text:\n\n${limitedText}` }]
                }
            ]
        }

        const response = await axios.post(url, payload, {
            headers: { 'Content-Type': 'application/json' }
        })

        const summary = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary generated.'
        return summary
    } catch (error) {
        console.error('Gemini API Error:', error.response?.data || error.message);
        const err = new Error('Failed to summarize text with Gemini API');
        err.geminiDetails = error.response?.data || error.message;
        throw err;
    }
}

module.exports = summarizeTextWithGemini
