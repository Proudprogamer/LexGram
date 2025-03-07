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

  const fileselector = (e) => {
    setCurrfile(e.target.files[0]);
    setError(null);
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

      if (!response.ok) throw new Error("Failed to fetch document data");

      const data_obj = await response.json();
      console.log("Backend response:", data_obj);

      if (!data_obj.response) {
        throw new Error("Invalid response from backend.");
      }

      // Step 2: Clean AI response (remove markdown formatting)
      const cleanedResponse = data_obj.response.replace(/```json|```/g, "").trim();
      console.log("Cleaned JSON Response:", cleanedResponse);
      localStorage.setItem("cleanedResponse", cleanedResponse);

      const jsonObject = JSON.parse(cleanedResponse);
      const extractedKeys = Object.keys(jsonObject).join(", ");
      console.log("Extracted Keys:", extractedKeys);

      // Step 3: Translate extracted keys
      const translationBody = {
        modelId: "65686cca00d64169e2f8f3e7", // Use the correct translation model
        task: "translation",
        input: [{ source: extractedKeys }],
        userId: null,
      };

      const translationResponse = await fetch("http://localhost:3000/v1/english/translate", {
        method: "POST",
        body: JSON.stringify(translationBody),
        headers: { "Content-Type": "application/json" },
      });

      if (!translationResponse.ok) throw new Error("Translation API failed");

      const text_data = await translationResponse.json();
      console.log("Translation API Response:", text_data);

      const translatedString = text_data.output[0]?.target;
      if (!translatedString) {
        throw new Error("Translation API did not return expected output.");
      }

      // Step 4: Convert translated keys into JSON format
      const translatedKeysArray = translatedString.split(", ");
      const translatedJsonObject = Object.fromEntries(translatedKeysArray.map((key) => [key, ""]));
      const jsonString = JSON.stringify(translatedJsonObject, null, 2);

      setJsonstring(jsonString);
      console.log("Translated JSON:", jsonString);
      setRes(true);
    } catch (error) {
      console.error("Error processing JSON:", error);
      setError(error.message || "An error occurred while processing the document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <div className="p-6 flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Document Filler</h1>
            
            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Upload Document</h2>
              
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Select Language</label>
                <select
                  onChange={(e) => setCurrlang(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700"
                  defaultValue=""
                >
                  <option value="" disabled>Select a language...</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Telugu">Telugu</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Upload File (.docx or .pdf)</label>
                <input
                  onChange={fileselector}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3"
                  type="file"
                />
                <p className="mt-2 text-sm text-gray-500">Only .docx and .pdf files are supported</p>
              </div>
              
              <button
                onClick={filesubmit}
                disabled={loading}
                className={`w-full p-3 rounded-lg text-lg font-medium ${
                  loading 
                    ? "bg-gray-700 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Processing..." : "Upload & Process"}
              </button>
            </div>
            
            {loading && (
              <div className="w-full flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                <p className="ml-3">Processing document...</p>
              </div>
            )}
            
            {error && (
              <div className="w-full bg-red-900 text-white p-4 rounded-lg mb-6">
                <p className="font-bold">Error:</p>
                <p>{error}</p>
              </div>
            )}
            
            {res && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Form Generator</h2>
                <FormCreator initialData={JSON.parse(jsonstring)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentFiller;