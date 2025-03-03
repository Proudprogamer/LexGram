const express = require('express');
const axios = require('axios');

const supreme_court = express.Router();

supreme_court.post('/case',async (req,res) =>{
    console.log(req.body);
    try {
            console.log("Received request:", req);
    
            const response = await axios.post(
                'https://apis.akshit.net/eciapi/17/supreme-court/case',
                req.body,
                { 
                    headers: { 
                        'Authorization': 'ECIAPI-d1bVZ0UVnVbUL9MzAJUdc4UIN6zDP9F9', 
                        'Content-Type': 'application/json' 
                    } 
                }
            );
    
            console.log("API Response:", response.data); 
            res.json(response.data);
        } catch (error) {
            console.error("Error Message:", error.message);
    
            if (error.response) {
                console.error("Error Data:", error.response.data);
                console.error("Error Status:", error.response.status);
                return res.status(error.response.status).json({ error: error.response.data });
            }
    
            res.status(500).json({ error: "Internal Server Error" });
        }
})

module.exports = {
    supreme_court : supreme_court
}