const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use express.text() middleware to parse the request body as plain text
router.use(express.text({ type: "*/*" }));

router.post("/extract-answers", async (req, res) => {
  try {
    const inputText = req.body;
    console.log("Received text for Gemini extraction:", inputText);
    
    if (!inputText || inputText.trim().length === 0) {
      return res.status(400).json({ error: "No text provided" });
    }
    
    // Build a prompt that instructs Gemini to create a properly formatted JSON with specific formatting rules
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
      
      Here's the text:
      ${inputText}
    `;
    
    // Use the correct model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Configure safety settings
    const generationConfig = {
      temperature: 0.1,  // Very low temperature for more deterministic outputs
      topP: 0.8,
      topK: 40,
    };
    
    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });
    
    const rawOutput = response.response.text();
    
    console.log("Gemini raw response:", rawOutput);
    
    try {
      // Clean up the response before parsing
      let cleanOutput = rawOutput.trim();
      
      // Remove any markdown code block markers
      if (cleanOutput.startsWith("```json")) {
        cleanOutput = cleanOutput.replace(/```json\n|\n```/g, "");
      } else if (cleanOutput.startsWith("```")) {
        cleanOutput = cleanOutput.replace(/```\n|\n```/g, "");
      }
      
      // Additional cleanup for common JSON parsing issues
      cleanOutput = cleanOutput
        .replace(/,\s*}/g, '}')  // Remove trailing commas before closing braces
        .replace(/,\s*]/g, ']'); // Remove trailing commas before closing brackets
      
      // Try parsing the cleaned Gemini response
      const answers = JSON.parse(cleanOutput);
      
      // Post-processing for any additional formatting that might be needed
      const formattedAnswers = postProcessAnswers(answers);
      
      res.json({ answers: formattedAnswers });
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError);
      res.status(500).json({ 
        error: "Failed to parse Gemini response", 
        raw: rawOutput,
        message: "The AI generated a response that isn't valid JSON."
      });
    }
  } catch (error) {
    console.error("Error extracting answers from Gemini:", error);
    res.status(500).json({ 
      error: "Gemini extraction failed",
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
      
      // Additional phone number formatting (if not already handled by Gemini)
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
      
      // For descriptive fields, Gemini should have already professionalized the text,
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