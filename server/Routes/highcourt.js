const express = require('express');
const high_court = express.Router();



high_court.post('/case', async(req,res) =>{

    console.log(`Incoming request : ${req.body}`)

    try
    { 
        const response = await axios.post('https://apis.akshit.net/eciapi/17/high-court/case',
            req.body,
            { 
            headers : {
                'Authorization' : 'ECIAPI-d1bVZ0UVnVbUL9MzAJUdc4UIN6zDP9F9',
                'Content-Type' : 'application/json'
                }   
            }
        )
        res.json(response.data);

    }catch(error)
    {
        console.log(error.message);
    }
})

module.exports = {
    high_court : high_court
}







