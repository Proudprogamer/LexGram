const express = require('express')
const xetranslator = express.Router();
const axios = require('axios');
const models = require('../Models/models');



xetranslator.post('/translate', async (req, res) => {

    const lang = req.body.language;

    const body = {
        modelId: models.models[lang].XE, // ✅ Ensure this is the correct translation model
        task: "translation",
        input: req.body.input, // ✅ Translate only values
        userId: null,
    };


    try {
        const response = await axios.post(
            'https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/compute',
            body,
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