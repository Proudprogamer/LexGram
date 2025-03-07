const express = require('express');
const district_court = express.Router();
const axios = require('axios');

// ✅ Fetch Case Details by CNR
district_court.post('/case', async (req, res) => {
    console.log(`Incoming request:`, req.body);

    try {
        const response = await axios.post(
            'https://apis.akshit.net/eciapi/17/district-court/case',
            req.body,
            {
                headers: {
                    'Authorization': 'ECIAPI-d1bVZ0UVnVbUL9MzAJUdc4UIN6zDP9F9',
                    'Content-Type': 'application/json'
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching case details:", error.message);
        res.status(500).json({ error: "Failed to fetch case details", details: error.message });
    }
});

// ✅ Fetch Case Details by Filing Number
district_court.post('/filing-number', async (req, res) => {
    console.log(`Incoming request:`, req.body);

    try {
        const response = await axios.post(
            'https://apis.akshit.net/eciapi/17/district-court/search/filing-number',
            req.body,
            {
                headers: {
                    'Authorization': 'ECIAPI-d1bVZ0UVnVbUL9MzAJUdc4UIN6zDP9F9',
                    'Content-Type': 'application/json'
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching case details:", error.message);
        res.status(500).json({ error: "Failed to fetch case details", details: error.message });
    }
});

module.exports = { district_court };
