const express = require('express');
const district_court = express.Router();
const axios = require('axios');


district_court.post('/case', async(req,res) =>{

    console.log(`Incoming request : ${req.body}`)

    try
    { 
        const response = await axios.post('https://apis.akshit.net/eciapi/17/district-court/case',
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


district_court.post('/filing-number', async(req,res)=>{
    console.log(`Incoming request : ${req.body}`)

    try
    { 
        const response = await axios.post('https://apis.akshit.net/eciapi/17/district-court/search/filing-number',
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
    district_court : district_court
}
