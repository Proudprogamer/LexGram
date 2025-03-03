const express = require('express');
const cors = require('cors')
const { supreme_court } = require('./Routes/supremecourt')
const { high_court } = require('./Routes/highcourt')
const { district_court } = require('./Routes/districtcourt')
const { translator } = require('./Routes/Translators/translator')
const { filereader } = require('./Routes/FileReader/filereader')
const { extranslator } = require('./Routes/E-Xtranslator/E-X.translator')
const { xetranslator } = require('./Routes/X-Etranslator/xetranslator')

const app = express();

app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all methods
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
    credentials: true
}));

app.options('*', cors());

app.use(express.json());

app.use('/supreme-court', supreme_court);
app.use('/high-court', high_court);
app.use('/district-court', district_court);
app.use('/v1/att', translator);
app.use('/document', filereader);
app.use('/v1/english', extranslator);
app.use('/v1/x/english', xetranslator);

app.listen(3000, () =>{
    console.log(`app listening on ${3000}`);
})
