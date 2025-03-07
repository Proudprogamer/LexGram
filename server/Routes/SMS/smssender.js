const express = require('express');
require('dotenv').config();
const axios = require('axios');

const sender = express.Router();


sender.post('/send', async(req, res) =>{

    console.log(`received request ${req.body}`)

    const message = req.body.message;

    const response = await axios.post("https://www.fast2sms.com/dev/bulkV2", {
            route: "q",
            message,
            language: "english",
            flash: 0,
            numbers: req.body.phone,
        }, {
            headers: { authorization: process.env.SMS_API_KEY,
                'Content-Type' : 'application/json'
             }
        });
    
        res.send(response.data);


})


module.exports = {
    sender:sender
}