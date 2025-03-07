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
const otpAuth = require("./Routes/otpAuth"); // ✅ Import OTP Authentication route
const { newuser } = require('./Routes/User/user');
const { sender } = require('./Routes/SMS/smssender')

const app = express();

// ✅ Fix CORS to allow frontend connection
app.use(cors({
    origin: "http://localhost:5175",  // Allow React frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.options("*", cors());
app.use(express.json());

// ✅ Register API routes
app.use("/supreme-court", supreme_court);
app.use("/high-court", high_court);
app.use("/district-court", district_court);
app.use("/v1/att", translator);
app.use("/document", filereader);
app.use("/v1/english", extranslator);
app.use("/v1/x/english", xetranslator);
app.use("/api/otp", otpAuth); // ✅ Add Twilio OTP API
app.use('/user', newuser);
app.use('/sms', sender);



// ✅ Start server
app.listen(3000, () => {
    console.log(`🚀 Backend running on http://localhost:3000`);
});
