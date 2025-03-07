const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const Groq = require("groq-sdk");
const Mammoth = require("mammoth");
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Import Gemini API

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Gemini API

const filereader = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

filereader.post("/reader", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        const fileBuffer = req.file.buffer;
        const fileType = req.file.mimetype;
        let extractedText = "";

        if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            // ✅ Extract text from DOCX
            const { value } = await Mammoth.extractRawText({ buffer: fileBuffer });
            extractedText = value;

        } else if (fileType === "application/pdf") {
            // ✅ Try to Extract Text from PDF
            const pdfData = await pdfParse(fileBuffer);
            extractedText = pdfData.text.trim() ? pdfData.text : "";

            if (!extractedText) {
                // 🔴 No text found, perform OCR
                console.log("Performing OCR on scanned PDF...");
                const tempFilePath = path.join(__dirname, "temp_image.png");
                fs.writeFileSync(tempFilePath, fileBuffer);

                const { data: { text } } = await Tesseract.recognize(tempFilePath, "eng");
                extractedText = text;
                fs.unlinkSync(tempFilePath); // Cleanup temp image
            }
        } else {
            return res.status(400).json({ error: "Unsupported file type. Please upload a .docx or .pdf file." });
        }

        console.log("Extracted Text:", extractedText);

        // ✅ AI API Call to Extract Fields
        const prompt = `
        Extract only the fields that require user input from the provided document text. Ignore any sections labeled "For Office Use Only," "Post Office Use Only," or similar.
        Do not extract fields that require filling by an authorized officer.
        Structure the response as a JSON object where:
        - Each key is the field name.
        - Each value is an empty string (for user input).
        - Do not include any additional text or explanations.
        
        \n\nDocument Text:\n${extractedText}
        `;

        let jsonResponse = "{}";

        try {
            // Try Gemini AI first
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const response = await model.generateContent(prompt);
            jsonResponse = response.response.text(); // Gemini's response

            if (!jsonResponse.includes("{")) throw new Error("Invalid response from Gemini"); // Fallback if Gemini fails
        } catch (err) {
            console.log("Gemini failed. Trying OpenAI...");

            // Fallback to OpenAI GPT-4
            const chat = await groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "llama-3.3-70b-versatile",
            });

            jsonResponse = chat.choices[0]?.message?.content || "{}";
        }

        console.log("Extracted JSON Response:", jsonResponse);
        res.json({ response: jsonResponse });

    } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).json({ error: "Failed to process the document." });
    }
});

module.exports = { filereader };
