const express = require('express')
const xetranslator = express.Router();
const axios = require('axios');



xetranslator.post('/translate', async (req, res) => {

    try {
        const response = await axios.post(
            'https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/compute',
            req.body,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        res.send(response.data);
    } catch (error) {
        console.error("There was an error: ", error?.response?.data || error.message);
        res.status(error?.response?.status || 500).json({ error: error?.message || "Internal Server Error" });
    }
});

module.exports = {
    xetranslator : xetranslator
}