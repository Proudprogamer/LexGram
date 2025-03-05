import React, { useState } from "react";
import RecordRTC from "recordrtc";

function FormCreator({ initialData }) {
    const [formData, setFormData] = useState(() => ({ ...initialData }));
    const [recordingField, setRecordingField] = useState(null); // Track which field is recording
    const [recorder, setRecorder] = useState(null);

    // Function to handle text input changes
    const handleChange = (e, key) => {
        setFormData({ ...formData, [key]: e.target.value });
    };

    // Function to start recording for a specific field
    const startRecording = async (key) => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const newRecorder = new RecordRTC(stream, { type: "audio" });
        newRecorder.startRecording();
        setRecorder(newRecorder);
        setRecordingField(key);
    };

    // Function to stop recording and process audio
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
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
    
                    const text_data = await response.json();
                    console.log("ASR API Response:", text_data);
    
                    const transcribedText = text_data.data?.source;
    
                    if (!transcribedText) {
                        console.error("No transcription received from ASR API.");
                        return;
                    }
    
                    // ✅ Set transcribed text in form field
                    setFormData(prevData => ({
                        ...prevData,
                        [recordingField]: transcribedText
                    }));
    
                    setRecordingField(null);
                    setRecorder(null);
                } catch (e) {
                    console.log("There was an error:", e.message);
                }
            };
        });
    };
    

    const handlesubmit = async(e)=>{
        e.preventDefault();
        console.log("Final form data : "+ JSON.stringify(formData));
        
        const body = {
            modelId: "67b871747d193a1beb4b847e",
            task: "translation",
            input: [{ source: JSON.stringify(formData)}],
            userId: null,
        };

        try {
            const translationResponse = await fetch("http://localhost:3000/v1/x/english/translate", {
                method: "POST",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" },
            });

            if (!translationResponse.ok) throw new Error("Translation API failed");

            const text_data = await translationResponse.text();
            // const translated = JSON.parse(text_data);
            console.log(JSON.parse(JSON.parse(text_data).output[0].target));
            
            } catch (error) {
                console.error("Error processing JSON:", error);
            }
            
        //convert to english here

    }

    return (
        <div className="p-6 bg-black text-white mt-5">
            <form onSubmit={(e) => handlesubmit(e)} className="space-y-4 ml-110">
                {Object.keys(formData).map((key) => (
                    <div key={key} className="flex flex-col">
                        <label className="mb-1">{key}</label>
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
