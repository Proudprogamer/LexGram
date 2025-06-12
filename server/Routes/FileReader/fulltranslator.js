const express = require("express");
const axios = require("axios");
const models = require("../Models/models");

const fulltranslator = express.Router();

fulltranslator.post("/translate-full", async (req, res) => {
  const { language, fullText } = req.body;

  if (!fullText || !language) {
    return res.status(400).json({ error: "Missing fullText or language" });
  }

  // 🧹 Step 1: Clean the extracted text
  let cleanedText = fullText
    .replace(/&amp;/g, "&")              // Replace &amp; with &
    .replace(/\s+/g, " ")                 // Collapse multiple spaces/newlines
    .replace(/([a-z])([A-Z])/g, "$1 $2")   // Add space between lowercase and uppercase
    .replace(/([a-zA-Z])(\d)/g, "$1 $2")   // Add space between letters and numbers
    .replace(/(\d)([a-zA-Z])/g, "$1 $2")   // Add space between numbers and letters
    .trim();

  console.log("✅ Cleaned Text ready for translation");

  const translationBody = {
    modelId: models.models[language].EX,
    task: "translation",
    input: [{ source: cleanedText }],
    userId: null,
  };

  try {
    const response = await axios.post(
      "https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/compute",
      translationBody,
      {
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

    console.log("✅ Full document translated successfully");
    res.send(response.data);
  } catch (error) {
    console.error("❌ Full translation error:", error?.response?.data || error.message);
    res.status(error?.response?.status || 500).json({ error: error?.message || "Internal Server Error" });
  }
});

module.exports = { fulltranslator };