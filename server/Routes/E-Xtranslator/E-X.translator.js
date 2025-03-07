const express = require('express')
const extranslator = express.Router();
const axios = require('axios');
const models = require('../Models/models');

extranslator.post('/translate', async (req, res) => {

    console.log(req.body.language);
    const lang = req.body.language;
    console.log(models.models[lang].EX)

    const translationBody = {
        modelId: models.models[lang].EX, // Use the correct translation model
        task: "translation",
        input: [{ source: req.body.extractedKeys }],
        userId: null,
      };

    try {
        const response = await axios.post(
            'https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/compute',
            translationBody,
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
    extranslator : extranslator
}