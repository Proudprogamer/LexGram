const express = require("express");
const Groq = require('groq-sdk'); // Import Groq SDK
require("dotenv").config();

const router = express.Router();

// Initialize Groq SDK with your API key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Use express.text() middleware to parse the request body as plain text
router.use(express.text({ type: "*/*" }));

router.post("/extract-answers", async (req, res) => {
  try {
    const inputText = req.body;
    console.log("Received text for Groq extraction:", inputText);

    if (!inputText || inputText.trim().length === 0) {
      return res.status(400).json({ error: "No text provided" });
    }

    // Build a prompt that instructs Groq to create a properly formatted JSON with specific formatting rules
    const prompt = `
      I'll give you text that contains information in a format similar to JSON, but it may not be valid JSON.
      Your task is to extract the key-value pairs and create a properly formatted JSON object.

      Read the text carefully and identify field names and their corresponding values, then apply these specific formatting rules:

      1. DATES:
         - Convert text dates like "twenty-first March two thousand twenty-four" to standard format "21-03-2024"
         - Standardize all dates to DD-MM-YYYY format

      2. PHONE NUMBERS:
         - Format any phone numbers consistently (e.g., "+91-XXXXX-XXXXX" or appropriate regional format)
         - Remove extra words like "phone", "mobile", "number" from the actual value

      3. NUMERIC VALUES:
         - If a field name suggests a number (account number, ID, etc.) but the value is in words, convert to digits
         - For example, "account number: five six seven eight" becomes "account_number": "5678"
         - However, if the field explicitly asks for the number in words, keep it as words

      4. ADDRESSES:
         - Replace "by" with "/" in addresses for location references
         - Format addresses consistently

      5. EMAIL ADDRESSES:
         - Replace phrases like "at the rate of" with "@"
         - Ensure proper email formatting

      6. DESCRIPTIVE TEXT:
         - For any field that contains longer descriptive text (like comments, descriptions, feedback)
         - Improve and professionalize the language while preserving the meaning
         - Fix grammar, spelling, and punctuation errors
         - Use more professional vocabulary and phrasing
         - Remove casual language, slang, or unnecessary repetition
         - Keep the professionalized text concise but complete

      Create a valid JSON object with these formatted key-value pairs.

      Important:
      - Do NOT make up or add any information that's not in the text
      - Remove any trailing commas from values
      - Ensure the resulting JSON is properly formatted
      - Return ONLY the JSON object, nothing else
      - Do NOT include any markdown code blocks (like \`\`\`json) in your response.

      Here's the text:
      ${inputText}
    `;

    // Use a suitable Groq model for structured output
    const modelName = "llama3-8b-8192"; // Or "llama3-70b-8192" or "mixtral-8x7b-32768"

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: modelName,
      temperature: 0.1, // Very low temperature for more deterministic outputs
      response_format: { type: "json_object" } // Instruct Groq to return a JSON object
    });

    const rawOutput = chatCompletion.choices[0]?.message?.content;

    console.log("Groq raw response:", rawOutput);

    try {
      // Groq with `response_format: { type: "json_object" }` should ideally return clean JSON
      // but a quick trim is always good.
      let cleanOutput = rawOutput.trim();

      // Attempt to parse the cleaned Groq response
      const answers = JSON.parse(cleanOutput);

      // Post-processing for any additional formatting that might be needed
      // (This function remains the same as it's client-side formatting)
      const formattedAnswers = postProcessAnswers(answers);

      res.json({ answers: formattedAnswers });
    } catch (parseError) {
      console.error("Failed to parse Groq response:", parseError);
      res.status(500).json({
        error: "Failed to parse Groq response",
        raw: rawOutput,
        message: "The AI generated a response that isn't valid JSON."
      });
    }
  } catch (error) {
    console.error("Error extracting answers from Groq:", error);
    res.status(500).json({
      error: "Groq extraction failed",
      message: error.message,
      details: error.toString()
    });
  }
});

// Identify if a field is likely to contain descriptive text
function isDescriptiveField(key, value) {
  // Check if the key suggests a descriptive field
  const descriptiveKeywords = [
    'description', 'comment', 'feedback', 'review', 'notes', 'details',
    'summary', 'overview', 'reason', 'explanation', 'about', 'message'
  ];

  const keyLower = key.toLowerCase();
  const isDescriptiveKey = descriptiveKeywords.some(keyword => keyLower.includes(keyword));

  // Check if the value looks like descriptive text (more than X words)
  const isLongText = typeof value === 'string' && value.split(' ').length > 8;

  return isDescriptiveKey || isLongText;
}

// Additional post-processing function to apply any JavaScript-based formatting rules
function postProcessAnswers(answers) {
  const result = { ...answers };

  // Iterate through all keys in the result
  Object.keys(result).forEach(key => {
    const value = result[key];

    if (typeof value === 'string') {
      // Additional email formatting
      if (value.includes('at the rate') || value.includes('at the rate of')) {
        result[key] = value
          .replace(/at the rate of/g, '@')
          .replace(/at the rate/g, '@');
      }

      // Additional phone number formatting (if not already handled by Groq)
      if (key.toLowerCase().includes('phone') || key.toLowerCase().includes('mobile')) {
        // Strip out non-numeric characters and format according to length
        const digits = value.replace(/\D/g, '');
        if (digits.length === 10) {
          result[key] = digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        }
      }

      // Additional address formatting
      if (key.toLowerCase().includes('address')) {
        result[key] = value.replace(/ by /g, ' / ');
      }

      // For descriptive fields, Groq should have already professionalized the text,
      // but we can apply additional basic formatting here
      if (isDescriptiveField(key, value)) {
        // Basic cleanup - capitalize first letter of each sentence, ensure proper ending punctuation
        let professionalText = value.trim();

        // Capitalize first letter if needed
        if (professionalText.length > 0 && /[a-z]/.test(professionalText[0])) {
          professionalText = professionalText.charAt(0).toUpperCase() + professionalText.slice(1);
        }

        // Ensure proper ending punctuation
        if (professionalText.length > 0 && !['!', '.', '?'].includes(professionalText[professionalText.length - 1])) {
          professionalText += '.';
        }

        result[key] = professionalText;
      }
    }
  });

  return result;
}

module.exports = { geminiService: router };