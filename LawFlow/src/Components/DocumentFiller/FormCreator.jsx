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
          const response = await fetch("http://localhost:3000/v1/att/convert", {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
          });
          const text_data = await response.json();
          console.log("ASR API Response:", text_data);
          const transcribedText = text_data.data?.source;
          if (!transcribedText) {
            console.error("No transcription received from ASR API.");
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

      const translationResponse = await fetch("http://localhost:3000/v1/x/english/translate", {
        method: "POST",
        body: JSON.stringify(translationBody),
        headers: { "Content-Type": "application/json" },
      });
      
      if (!translationResponse.ok) throw new Error("Translation API failed");
      
      const text_data = await translationResponse.json();
      console.log("🌍 Translation API Response:", text_data);
      let translatedString = text_data.output[0]?.target;
      
      if (!translatedString) {
        throw new Error("Translation API did not return expected output.");
      }
      
      console.log("📝 Raw Translated String:", translatedString);

      // Step 2: Send the translated string as plain text to Gemini for answer extraction
      const geminiResponse = await fetch("http://localhost:3000/api/gemini/extract-answers", {
        method: "POST",
        body: translatedString,
        headers: { "Content-Type": "text/plain" },
      });
      
      if (!geminiResponse.ok) {
        const errorData = await geminiResponse.json();
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

  // Generate and download a DOCX file filled with the extracted answers
  const fillDocument = async () => {
    if (!extractedAnswers) {
      console.error("No extracted answers to fill into the document.");
      return;
    }
    
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Form Submission Details",
                  bold: true,
                  size: 28
                })
              ],
              spacing: { after: 200 }
            }),
            ...Object.entries(extractedAnswers).map(([key, value]) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${key}: `,
                    bold: true
                  }),
                  new TextRun({
                    text: value
                  })
                ],
                spacing: { after: 120 }
              })
            )
          ],
        },
      ],
    });
    
    try {
      const blob = await Packer.toBlob(doc);
      saveAs(blob, "filled_document.docx");
      console.log("✅ DOCX file has been generated and downloaded.");
    } catch (error) {
      console.error("❌ Error generating DOCX file:", error);
    }
  };

  return (
    <div className="p-6 bg-black text-white mt-5">
      <form onSubmit={handleSubmit} className="space-y-4 ml-13">
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="mb-1">{key.replace(/_/g, " ")}</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={formData[key]}
                onChange={(e) => handleChange(e, key)}
                className="p-2 rounded-md bg-gray-700 border border-gray-600 text-white w-150"
              />
              {/* Mic Button */}
              <button
                type="button"
                onClick={() =>
                  recordingField === key ? stopRecording() : startRecording(key)
                }
                className={`p-2 rounded-md ${
                  recordingField === key ? "bg-red-500" : "bg-blue-500"
                } text-white`}
                disabled={isProcessing}
              >
                {recordingField === key ? "🛑 Stop" : "🎤 Speak"}
              </button>
            </div>
          </div>
        ))}
        <button
          type="submit"
          className={`${
            isProcessing ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"
          } text-white p-2 rounded-md`}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Submit"}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-600 rounded-md">
          <p>Error: {error}</p>
        </div>
      )}
      
      {extractedAnswers && (
        <div className="mt-6">
          <div className="bg-gray-800 p-4 rounded-md mb-4">
            <h3 className="text-xl mb-3">Extracted Form Data:</h3>
            <div className="space-y-2">
              {Object.entries(extractedAnswers).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 gap-2">
                  <div className="font-medium">{key}:</div>
                  <div className="col-span-2">{value}</div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={fillDocument}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Fill Document & Download DOCX
          </button>
        </div>
      )}
    </div>
  );
}

export default FormCreator;