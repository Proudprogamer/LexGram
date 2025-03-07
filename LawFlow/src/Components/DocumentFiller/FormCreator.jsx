import React, { useState } from "react";
import RecordRTC from "recordrtc";

function FormCreator({ initialData, jsonstring }) {
    const [formData, setFormData] = useState(() => ({ ...initialData }));
    const [recordingField, setRecordingField] = useState(null); // Track which field is recording
    const [recorder, setRecorder] = useState(null);

    // ✅ Handle text input changes
    const handleChange = (e, key) => {
        setFormData({ ...formData, [key]: e.target.value });
    };

    // ✅ Start Recording for a Specific Field
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

    // ✅ Stop Recording & Process Audio
    const stopRecording = async () => {
        if (!recorder) return;

        recorder.stopRecording(async () => {
            const blob = recorder.getBlob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);

            reader.onloadend = async () => {
                const base64Audio = reader.result.split(",")[1]; // Extract actual Base64 data
                console.log("Base64 Audio:", base64Audio);

                const body = {
                    audioContent: base64Audio,
                    modelId: "660e9e144e7d42484da6356d",
                    source: "te",
                    task: "asr",
                    userId: null
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

                    // ✅ Update the correct form field with transcribed text
                    setFormData(prevData => ({
                        ...prevData,
                        [recordingField]: transcribedText
                    }));

                    setRecordingField(null);
                    setRecorder(null);
                } catch (e) {
                    console.error("Error in ASR API:", e.message);
                }
            };
        });
    };

    // ✅ Handle Form Submission
    const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("📝 Final Form Data Before Translation:", JSON.stringify(formData));

    // ✅ Get English keys from `cleanedResponse`
    const jsonObject = JSON.parse(localStorage.getItem("cleanedResponse")); // Get extracted English keys
    const englishKeys = Object.keys(jsonObject); // ✅ English keys from AI extraction
    const values = Object.values(formData); // ✅ Extract user-filled values for translation

    const body = {
        modelId: "67b871747d193a1beb4b847e", // ✅ Ensure this is the correct translation model
        task: "translation",
        input: [{ source: JSON.stringify(values) }], // ✅ Translate only values
        userId: null,
    };

    try {
        const translationResponse = await fetch("http://localhost:3000/v1/x/english/translate", {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        });

        if (!translationResponse.ok) throw new Error("Translation API failed");

        const text_data = await translationResponse.json();
        console.log("🌍 Translation API Response:", text_data);

        let translatedString = text_data.output[0]?.target;
        if (!translatedString) {
            console.error("Translation API did not return expected output.");
            return;
        }

        // ✅ Fix JSON formatting issues (if any)
        translatedString = translatedString
            .replace(/“|”/g, '"') // Convert fancy quotes to normal quotes
            .replace(/'([^']+)'/g, '"$1"') // Fix single quotes inside values
            .replace(/(\w+)\s*:\s*([^\{\["\d][^,]*)/g, '"$1": "$2"') // Ensure missing quotes around values
            .replace(/,([^}\]])/g, ',$1') // Fix missing commas
            .replace(/(\w+):(?=[^"{}\[\],])/g, '"$1":'); // Ensure keys are enclosed in quotes

        console.log("📝 Cleaned JSON String:", translatedString);

        // ✅ Parse translated JSON safely
        try {
            let translatedValues = JSON.parse(translatedString);

            // ✅ Map translated values back to extracted English keys
            const translatedJson = {};
            englishKeys.forEach((key, index) => {
                translatedJson[key] = translatedValues[index] || ""; // Assign translated value to corresponding key
            });

            console.log("✅ Final Translated JSON with English Keys:", translatedJson);
        } catch (parseError) {
            console.error("❌ Error parsing translated JSON:", parseError);
            console.error("❌ Raw Response:", translatedString); // ✅ Log incorrect format for debugging
        }

    } catch (error) {
        console.error("❌ Error processing translation:", error);
    }
};


    return (
        <div className="p-6 bg-black text-white mt-5">
            <form onSubmit={handleSubmit} className="space-y-4 ml-110">
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
                            {/* Mic Button to Start/Stop Recording */}
                            <button
                                type="button"
                                onClick={() =>
                                    recordingField === key ? stopRecording() : startRecording(key)
                                }
                                className={`p-2 rounded-md ${
                                    recordingField === key ? "bg-red-500" : "bg-blue-500"
                                } text-white`}
                            >
                                {recordingField === key ? "🛑 Stop" : "🎤 Speak"}
                            </button>
                        </div>
                    </div>
                ))}

                <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default FormCreator;
