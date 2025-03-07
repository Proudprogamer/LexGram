const express = require('express')
const translator = express.Router();
const axios = require('axios');
const models = require('../Models/models');

translator.post('/convert', async (req, res) => {

    const lang = req.body.language;

    // console.log("language received" + models.models[lang].ST);

    

    const body = {
        audioContent: req.body.audioContent,
        modelId: models.models[lang].ST,
        source: models.models[lang].code,
        task: "asr",
        userId: null
    };


    try {
        const response = await axios.post(
            'https://meity-auth.ulcacontrib.org/ulca/apis/asr/v1/model/compute',
            body,
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