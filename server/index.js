const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { supreme_court } = require("./Routes/supremecourt");
const { high_court } = require("./Routes/highcourt");
const { district_court } = require("./Routes/districtcourt");
const { translator } = require("./Routes/Translators/translator");
const { filereader } = require("./Routes/FileReader/filereader");
const { extranslator } = require("./Routes/E-Xtranslator/E-X.translator");
const { xetranslator } = require("./Routes/X-Etranslator/xetranslator");
const { geminiService } = require("./Routes/geminiService");
const { fulltranslator } = require("./Routes/FileReader/fulltranslator");

const app = express();

// ✨ Allow both Local and Deployed frontend
app.use(cors());

app.use(express.json());

// Routes
app.use("/supreme-court", supreme_court);
app.use("/high-court", high_court);
app.use("/district-court", district_court);
app.use("/v1/att", translator);
app.use("/document", filereader);
app.use("/v1/english", extranslator);
app.use("/v1/x/english", xetranslator);
app.use("/api/gemini", geminiService);
app.use("/v1/fulltranslate", fulltranslator);

app.listen(3000, () => {
  console.log(`🚀 Backend running on https://lexgram.onrender.com`);
});
