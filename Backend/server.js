// backend/server.js
require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors()); 
app.use(express.json()); // Parse JSON request bodies

// ✅ Serve frontend files (make sure "Frontend" matches your folder name exactly!)
app.use(express.static(path.resolve(__dirname, '../Frontend')));

let topicsCache = null;

// --- Load topics.json into memory ---
async function loadTopicsFromFile() {
    try {
        const data = await fs.readFile(path.join(__dirname, 'topics.json'), 'utf-8');
        topicsCache = JSON.parse(data);
        console.log('Topics loaded into cache successfully.');
    } catch (error) {
        console.error('Failed to load topics.json:', error);
    }
}

/**
 * @route   GET /api/topics
 * @desc    Get all learning topics
 * @access  Public
 */
app.get('/api/topics', (req, res) => {
    if (topicsCache) {
        res.json(topicsCache);
    } else {
        res.status(500).json({ error: 'Topics are not loaded. Server error.' });
    }
});

/**
 * @route   POST /api/run
 * @desc    Run user-submitted code using Judge0 API
 * @access  Public
 */
app.post('/api/run', async (req, res) => {
    const { language_id, code, stdin } = req.body;

    if (!language_id || code === undefined) {
        return res.status(400).json({ error: 'Language ID and code are required.' });
    }

    // Judge0 API Configuration
    const JUDGE0_API_HOST = process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';
    const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

    if (!JUDGE0_API_KEY) {
        console.error("FATAL ERROR: Judge0 API key is not set in the .env file.");
        process.exit(1); 
    }

    const options = {
        method: 'POST',
        url: `https://${JUDGE0_API_HOST}/submissions`,
        params: { base64_encoded: 'false', wait: 'true', fields: '*' },
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Host': JUDGE0_API_HOST,
            'X-RapidAPI-Key': JUDGE0_API_KEY,
        },
        data: {
            language_id: language_id,
            source_code: code,
            stdin: stdin 
        },
    };

    try {
        console.log(`Sending code to Judge0 for language ID: ${language_id}`);
        const response = await axios.request(options);
        console.log('Received response from Judge0:', response.data.status.description);
        res.json(response.data);
    } catch (error){
        console.error('Error calling Judge0 API:', error.response ? error.response.data : error.message);
        const status = error.response ? error.response.status : 500;
        const message = error.response ? error.response.data : 'An error occurred while executing the code.';
        res.status(status).json({ error: message });
    }
});

// ✅ Catch-all: send index.html for frontend routes
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../Frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    loadTopicsFromFile();
});
