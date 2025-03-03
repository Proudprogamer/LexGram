const express = require('express')
const translator = express.Router();
const axios = require('axios');

translator.post('/convert', async (req, res) => {

    try {
        const response = await axios.post(
            'https://meity-auth.ulcacontrib.org/ulca/apis/asr/v1/model/compute',
            req.body,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error("There was an error: ", error?.response?.data || error.message);
        res.status(error?.response?.status || 500).json({ error: error?.message || "Internal Server Error" });
    }
});

module.exports = {
    translator : translator
}