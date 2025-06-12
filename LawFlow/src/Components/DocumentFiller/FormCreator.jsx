import React, { useState } from "react";
import RecordRTC from "recordrtc";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

function FormCreator({ initialData, lang }) {
  const [formData, setFormData] = useState(() => ({ ...initialData }));
  const [recordingField, setRecordingField] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [extractedAnswers, setExtractedAnswers] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  console.log("Language:", lang);

  // Handle input changes
  const handleChange = (e, key) => {
    setFormData({ ...formData, [key]: e.target.value });
  };

  // Start recording for a specific field
  const startRecording = async (key) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const newRecorder = new RecordRTC(stream, { type: "audio" });
      newRecorder.startRecording();
      setRecorder(newRecorder);
      setRecordingField(key);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setError("Unable to access microphone. Please check permissions.");
    }
  };

  // Stop recording, send audio to ASR API, and update field with transcription
  const stopRecording = async () => {
    if (!recorder) return;
    recorder.stopRecording(async () => {
      const blob = recorder.getBlob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = reader.result.split(",")[1];
        console.log("Base64 Audio:", base64Audio);
        const body = {
          audioContent: base64Audio,
          language: lang,
        };
        try {
          const response = await fetch("https://lexgram.onrender.com/v1/att/convert", {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
          });
          
          if (!response.ok) {
            throw new Error(`ASR API failed: ${response.status}`);
          }
          
          const text_data = await response.json();
          console.log("ASR API Response:", text_data);
          const transcribedText = text_data.data?.source;
          if (!transcribedText) {
            console.error("No transcription received from ASR API.");
            setError("No transcription received. Please try again.");
            return;
          }
          setFormData((prev) => ({
            ...prev,
            [recordingField]: transcribedText,
          }));
          setRecordingField(null);
          setRecorder(null);
        } catch (e) {
          console.error("Error in ASR API:", e.message);
          setError(`Transcription failed: ${e.message}`);
        }
      };
    });
  };

  // Handle form submission:
  // 1. Translate the entire formData (keys and values) into English  
  // 2. Send the resulting JSON string as plain text to Gemini for final answer extraction  
  // 3. Store the extracted answers (final mapping) in state
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    
    console.log("📝 Final Form Data Before Translation:", JSON.stringify(formData));
    const finalFormDataString = JSON.stringify(formData);

    try {
      // Step 1: Translate the entire JSON (keys and values) into English
      const translationBody = {
        modelId: "67b871747d193a1beb4b847e", // Your translation model ID
        task: "translation",
        input: [{ source: finalFormDataString }],
        userId: null,
        language: lang,
      };

      const translationResponse = await fetch("https://lexgram.onrender.com/v1/x/english/translate", {
        method: "POST",
        body: JSON.stringify(translationBody),
        headers: { "Content-Type": "application/json" },
      });
      
      if (!translationResponse.ok) {
        const errorText = await translationResponse.text().catch(() => "Unknown error");
        throw new Error(`Translation API failed: ${translationResponse.status} ${errorText}`);
      }
      
      const text_data = await translationResponse.json();
      console.log("🌍 Translation API Response:", text_data);
      let translatedString = text_data.output?.[0]?.target;
      
      if (!translatedString) {
        throw new Error("Translation API did not return expected output.");
      }
      
      console.log("📝 Raw Translated String:", translatedString);

      // Step 2: Send the translated string as plain text to Gemini for answer extraction
      const geminiResponse = await fetch("https://lexgram.onrender.com/api/gemini/extract-answers", {
        method: "POST",
        body: translatedString,
        headers: { "Content-Type": "text/plain" },
      });
      
      if (!geminiResponse.ok) {
        const errorData = await geminiResponse.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || "Gemini extraction failed");
      }
      
      const geminiData = await geminiResponse.json();
      console.log("🔍 Gemini Extracted Answers:", geminiData);
      setExtractedAnswers(geminiData.answers);
    } catch (error) {
      console.error("❌ Error processing form:", error);
      setError(error.message || "An error occurred while processing the form");
    } finally {
      setIsProcessing(false);
    }
  };
  

  const resetForm = () => {
    setFormData({ ...initialData });
    setExtractedAnswers(null);
    setError(null);
    if (recorder) {
      recorder.destroy();
      setRecorder(null);
    }
    setRecordingField(null);
  };

  return (
    <div className="w-full">
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
            Dynamic Form Fields
          </h3>
          <p className="text-gray-400 text-sm">
            Fill out the form using text input or voice recording
          </p>
        </div>
        {Object.keys(formData).length > 0 && (
          <button
            onClick={resetForm}
            className="text-blue-400 hover:text-blue-300 text-sm underline mt-2 sm:mt-0 self-start sm:self-auto"
            disabled={isProcessing}
          >
            Reset Form
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid gap-4 sm:gap-6">
          {Object.keys(formData).map((key, index) => (
            <div key={key} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex flex-col space-y-3">
                {/* Field Label */}
                <div className="flex items-center justify-between">
                  <label className="text-sm sm:text-base font-medium text-gray-200 capitalize">
                    {key.replace(/_/g, " ")}
                  </label>
                  <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                    Field {index + 1}
                  </span>
                </div>
                
                {/* Input and Mic Button Container */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  {/* Text Input */}
                  <input
                    type="text"
                    value={formData[key]}
                    onChange={(e) => handleChange(e, key)}
                    className="flex-1 p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                    disabled={isProcessing}
                  />
                  
                  {/* Voice Recording Button */}
                  <button
                    type="button"
                    onClick={() =>
                      recordingField === key ? stopRecording() : startRecording(key)
                    }
                    className={`px-4 py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 whitespace-nowrap ${
                      recordingField === key
                        ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                        : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    disabled={isProcessing || (recordingField && recordingField !== key)}
                  >
                    {recordingField === key ? (
                      <span className="flex items-center space-x-2">
                        <span>🛑</span>
                        <span className="hidden sm:inline">Stop Recording</span>
                        <span className="sm:hidden">Stop</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <span>🎤</span>
                        <span className="hidden sm:inline">Voice Input</span>
                        <span className="sm:hidden">Speak</span>
                      </span>
                    )}
                  </button>
                </div>

                {/* Recording Status */}
                {recordingField === key && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>Recording... Click "Stop" when done</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className={`w-full p-3 sm:p-4 rounded-lg text-sm sm:text-lg font-medium transition-all duration-200 ${
              isProcessing
                ? "bg-gray-700 cursor-not-allowed text-gray-400"
                : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            }`}
            disabled={isProcessing || recordingField}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span>Processing Form...</span>
              </div>
            ) : (
              "🚀 Submit & Process Form"
            )}
          </button>
        </div>
      </form>
      
      {/* Error Display */}
      {error && (
        <div className="mt-4 sm:mt-6 bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg shadow-lg">
          <div className="flex items-start space-x-2">
            <span className="text-red-400 text-lg">⚠️</span>
            <div>
              <p className="font-bold text-red-100">Error:</p>
              <p className="text-sm sm:text-base">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Extracted Results */}
      {extractedAnswers && (
        <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-0">
              ✅ Extracted Form Data
            </h3>
            
          </div>

          {/* Results Display */}
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700 shadow-lg">
            <div className="space-y-4">
              {Object.entries(extractedAnswers).map(([key, value], index) => (
                <div key={key} className="border-b border-gray-700 last:border-b-0 pb-4 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 space-y-2 sm:space-y-0">
                    {/* Field Number */}
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs rounded-full">
                        {index + 1}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-200 mb-1 text-sm sm:text-base">
                        {key}:
                      </div>
                      <div className="text-gray-300 text-sm sm:text-base break-words">
                        {typeof value === "object" && value !== null ? (
                          <div className="bg-gray-700 rounded-lg p-3 mt-2">
                            <ul className="space-y-1">
                              {Object.entries(value).map(([subKey, subValue]) => (
                                <li key={subKey} className="flex flex-col sm:flex-row sm:space-x-2">
                                  <strong className="text-gray-200 text-sm">{subKey}:</strong>
                                  <span className="text-gray-300 text-sm">{subValue ?? "N/A"}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <span className="bg-gray-700 px-3 py-2 rounded-lg inline-block">
                            {value ?? "N/A"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormCreator;