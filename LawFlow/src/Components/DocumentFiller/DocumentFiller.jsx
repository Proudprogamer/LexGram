import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import FormCreator from "./FormCreator";

function DocumentFiller() {
  const [currlang, setCurrlang] = useState("");
  const [currfile, setCurrfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [res, setRes] = useState(false);
  const [jsonstring, setJsonstring] = useState("");
  const [translatedDoc, setTranslatedDoc] = useState(""); // NEW for full document translation

  const fileselector = (e) => {
    const file = e.target.files[0];
    setCurrfile(file);
    setError(null);
    
    // Minor validation enhancement
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setError("File size too large. Please select a file smaller than 10MB.");
        setCurrfile(null);
        e.target.value = '';
      }
    }
  };

  const filesubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!currfile) {
      setError("Please select a file!");
      setLoading(false);
      return;
    }

    if (!currlang) {
      setError("Please select a language!");
      setLoading(false);
      return;
    }

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf",
    ];

    if (!allowedTypes.includes(currfile.type)) {
      setError("Invalid file type! Please upload a .docx or .pdf file.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", currfile);

      // Step 1: Send file to backend for AI-based key extraction
      const response = await fetch("http://localhost:3000/document/reader", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(`Failed to fetch document data: ${response.status} ${errorText}`);
      }

      const data_obj = await response.json();
      console.log("Backend response:", data_obj);

      if (!data_obj.response || !data_obj.fullText) {
        throw new Error("Invalid response from backend.");
      }

      // Step 2: Clean AI response (remove markdown formatting)
      const cleanedResponse = data_obj.response.replace(/```json|```/g, "").trim();
      console.log("Cleaned JSON Response:", cleanedResponse);
      localStorage.setItem("cleanedResponse", cleanedResponse);

      let jsonObject;
      try {
        jsonObject = JSON.parse(cleanedResponse);
      } catch (parseError) {
        throw new Error("Failed to parse extracted data. Please try again.");
      }
      
      const extractedKeys = Object.keys(jsonObject).join(", ");
      console.log("Extracted Keys:", extractedKeys);

      // Step 3: Translate extracted keys (for Form)
      const translationBody = {
        language: currlang,
        extractedKeys: extractedKeys,
      };

      const translationResponse = await fetch("http://localhost:3000/v1/english/translate", {
        method: "POST",
        body: JSON.stringify(translationBody),
        headers: { "Content-Type": "application/json" },
      });

      if (!translationResponse.ok) {
        const errorText = await translationResponse.text().catch(() => "Unknown error");
        throw new Error(`Translation API failed: ${translationResponse.status} ${errorText}`);
      }

      const text_data = await translationResponse.json();
      console.log("Translation API Response:", text_data);

      const translatedString = text_data.output?.[0]?.target;
      if (!translatedString) {
        throw new Error("Translation API did not return expected output.");
      }

      // Step 4: Convert translated keys into JSON format
      const translatedKeysArray = translatedString.split(", ");
      const translatedJsonObject = Object.fromEntries(translatedKeysArray.map((key) => [key, ""]));
      const jsonString = JSON.stringify(translatedJsonObject, null, 2);

      setJsonstring(jsonString);
      console.log("Translated JSON for Form:", jsonString);

      // Step 5: NEW - Translate full document
      const fullTranslationResponse = await fetch("http://localhost:3000/v1/fulltranslate/translate-full", {
        method: "POST",
        body: JSON.stringify({
          language: currlang,
          fullText: data_obj.fullText,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!fullTranslationResponse.ok) {
        const errorText = await fullTranslationResponse.text().catch(() => "Unknown error");
        throw new Error(`Full document translation failed: ${fullTranslationResponse.status} ${errorText}`);
      }

      const fullTranslatedData = await fullTranslationResponse.json();
      const translatedDocString = fullTranslatedData.output?.[0]?.target;
      console.log("Full Translated Document:", translatedDocString);

      setTranslatedDoc(translatedDocString || "Translation failed.");
      setRes(true);

    } catch (error) {
      console.error("Error processing document:", error);
      setError(error.message || "An error occurred while processing the document.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrfile(null);
    setCurrlang("");
    setRes(false);
    setError(null);
    setJsonstring("");
    setTranslatedDoc("");
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar - Hidden on mobile, visible on larger screens */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      <div className="flex flex-col flex-1 w-full lg:w-auto">
        <Navbar />
        
        <div className="p-3 sm:p-4 lg:p-6 flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto w-full">
            {/* Header */}
            <div className="mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white text-center lg:text-left">
                📄 Document Filler
              </h1>
              
            </div>

            {/* Upload Section */}
            <div className="bg-gray-900 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg border border-gray-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-0">
                  📤 Upload Document
                </h2>
                {res && (
                  <button
                    onClick={resetForm}
                    className="text-blue-400 hover:text-blue-300 text-sm underline self-start sm:self-auto"
                  >
                    Upload New Document
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Language Selection */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm sm:text-base font-medium">
                    🌐 Select Language
                  </label>
                  <select
                    onChange={(e) => setCurrlang(e.target.value)}
                    value={currlang}
                    className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                    disabled={loading}
                  >
                    <option value="" disabled>Select a language...</option>
                    <option value="Telugu">Telugu (తెలుగు)</option>
                    <option value="Marathi">Marathi (मराठी)</option>
                    <option value="Malayalam">Malayalam (മലയാളം)</option>
                    <option value="Tamil">Tamil (தமிழ்)</option>
                    <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
                    <option value="Bengali">Bengali (বাংলা)</option>
                    <option value="Assasamese">Assamese (অসমীয়া)</option>
                    <option value="Urdu">Urdu (اردو)</option>
                    <option value="Nepali">Nepali (नेपाली)</option>
                    <option value="Goan_Konkani">Goan Konkani</option>
                    <option value="Bodo">Bodo</option>
                    <option value="Sanskrit">Sanskrit (संस्कृत)</option>
                  </select>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm sm:text-base font-medium">
                    📎 Upload File
                  </label>
                  <div className="relative">
                    <input
                      onChange={fileselector}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                      type="file"
                      accept=".docx,.pdf"
                      disabled={loading}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-0">
                    <span>Only .docx or .pdf files supported</span>
                    <span>Max size: 10MB</span>
                  </div>
                  {currfile && (
                    <div className="mt-2 p-2 bg-gray-800 rounded text-sm text-green-400">
                      ✓ Selected: {currfile.name} ({(currfile.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  onClick={filesubmit}
                  disabled={loading || !currfile || !currlang}
                  className={`w-full p-3 sm:p-4 rounded-lg text-sm sm:text-lg font-medium transition-all duration-200 ${
                    loading || !currfile || !currlang
                      ? "bg-gray-700 cursor-not-allowed text-gray-400"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "🚀 Upload & Process"
                  )}
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-gray-900 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-700">
                <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <div className="text-center sm:text-left">
                    <p className="text-white font-medium">Processing document...</p>
                    <p className="text-gray-400 text-sm">This may take a few moments</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg mb-4 sm:mb-6 shadow-lg">
                <div className="flex items-start space-x-2">
                  <span className="text-red-400 text-lg">⚠️</span>
                  <div>
                    <p className="font-bold text-red-100">Error:</p>
                    <p className="text-sm sm:text-base">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {res && (
              <div className="space-y-4 sm:space-y-6">
                {/* Full Document Translation */}
                <div className="bg-gray-900 rounded-lg p-4 sm:p-6 shadow-lg border border-gray-800">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 pb-2 text-white border-b border-gray-700 flex items-center space-x-2">
                    <span>📃</span>
                    <span>Full Translated Document</span>
                  </h2>
                  <div className="bg-gray-800 rounded-lg p-4 max-h-64 sm:max-h-96 overflow-y-auto border border-gray-700">
                    <div className="text-gray-300 whitespace-pre-line text-sm sm:text-base leading-relaxed">
                      {translatedDoc || "Translation in progress..."}
                    </div>
                  </div>
                </div>

                {/* Form Generator */}
                <div className="bg-gray-900 rounded-lg p-4 sm:p-6 shadow-lg border border-gray-800">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 pb-2 text-white border-b border-gray-700 flex items-center space-x-2">
                    <span>📝</span>
                    <span>Form Generator</span>
                  </h2>
                  <div className="overflow-x-auto">
                    {jsonstring && (
                      <FormCreator initialData={JSON.parse(jsonstring)} lang={currlang} />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentFiller;