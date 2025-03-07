const express = require("express");
const router = express.Router();
const twilio = require("twilio");
require("dotenv").config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// ✅ **Send OTP**
router.post("/send", async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ success: false, message: "Phone number is required" });
        }

        console.log(`📩 Sending OTP to: ${phoneNumber}`);

        const verification = await client.verify.v2
            .services(process.env.TWILIO_SERVICE_SID)
            .verifications.create({ to: phoneNumber, channel: "sms" });

        console.log("✅ OTP Sent:", verification);
        res.json({ success: true, message: "OTP Sent", sid: verification.sid });

    } catch (error) {
        console.error("❌ Error sending OTP:", error);
        res.status(500).json({ success: false, message: "OTP could not be sent", error: error.message });
    }
});

// ✅ **Verify OTP**
router.post("/verify", async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;

        if (!phoneNumber || !otp) {
            return res.status(400).json({ success: false, message: "Phone number and OTP are required" });
        }

        console.log(`🔍 Verifying OTP for: ${phoneNumber}`);

        const verificationCheck = await client.verify.v2
            .services(process.env.TWILIO_SERVICE_SID)
            .verificationChecks.create({ to: phoneNumber, code: otp });

        if (verificationCheck.status === "approved") {
            console.log("✅ OTP Verified:", verificationCheck);
            res.json({ success: true, message: "OTP Verified" });
        } else {
            console.log("❌ Invalid OTP:", verificationCheck);
            res.status(400).json({ success: false, message: "Invalid OTP" });
        }

    } catch (error) {
        console.error("❌ Error verifying OTP:", error);
        res.status(500).json({ success: false, message: "OTP verification failed", error: error.message });
    }
});

module.exports = router;
