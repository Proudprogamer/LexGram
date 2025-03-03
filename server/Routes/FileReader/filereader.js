const express = require('express')
require('dotenv').config();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


const filereader = express.Router();


filereader.post('/reader', async(req,res)=>{

    const body = req.body;
    console.log(body.text)
    const task = "As you can see, i have given you a string which is basically a text which a document had, the document had multiple fiels, so what i want you to do is, i want you to convert this plain string into an object where each key of the object is a field in the document as given in the plain string, do not give me any sentences in response, just give me the json object as a string directly.";

    const message = body.text + " " + task;

    const chat = await groq.chat.completions.create({
        messages: [              
          {                
            role: "user",                
            content: message,               
          },               
        ],               
        model: "llama-3.3-70b-versatile",               
      });

      res.json({ response: chat.choices[0]?.message?.content || "{}" });

})

module.exports = {
    filereader : filereader
}