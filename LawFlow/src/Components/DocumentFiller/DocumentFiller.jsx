import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import Mammoth from "mammoth";
import FormCreator from "./FormCreator";

function DocumentFiller() {
    const [currlang, setcurrlang] = useState();
    const [currfile, setcurrfile] = useState();
    const [text, settext] = useState();
    const [res, setres] = useState(false);
    const [jsonstring, setjsonstring] = useState("");

    const fileselector = (e) => {
        setcurrfile(e.target.files[0]);
    };

   const filesubmit = async (e) => {
    e.preventDefault();

    if (!currfile) {
        alert("Please select a file!");
        return;
    }

    const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/pdf",
    ];

    if (!allowedTypes.includes(currfile.type)) {
        alert("Invalid file type! Please upload a .docx or .pdf file.");
        return;
    }

    try {
        const formData = new FormData();
        formData.append("file", currfile);

        // ✅ Step 1: Send file to backend for AI-based key extraction
        const response = await fetch("http://localhost:3000/document/reader", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Failed to fetch document data");

        const data_obj = await response.json();
        console.log("Backend response:", data_obj);

        if (!data_obj.response) {
            console.error("Invalid response from backend.");
            return;
        }

        // ✅ Step 2: Clean AI response (remove markdown formatting)
        const cleanedResponse = data_obj.response.replace(/```json|```/g, "").trim();
        console.log("Cleaned JSON Response:", cleanedResponse);

        const jsonObject = JSON.parse(cleanedResponse);
        const extractedKeys = Object.keys(jsonObject).join(", ");
        console.log("Extracted Keys:", extractedKeys);

        // ✅ Step 3: Translate extracted keys into Telugu
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
            console.error("Translation API did not return expected output.");
            return;
        }

        // ✅ Step 4: Convert translated keys into JSON format
        const translatedKeysArray = translatedString.split(", ");
        const translatedJsonObject = Object.fromEntries(translatedKeysArray.map((key) => [key, ""]));
        const jsonString = JSON.stringify(translatedJsonObject, null, 2);

        setjsonstring(jsonString);
        console.log("Translated JSON:", jsonString);
        setres(true);

    } catch (error) {
        console.error("Error processing JSON:", error);
    }
};

    
    
    

    return (
        <div>
            <Sidebar />
            <Navbar />
            <div className="bg-black ml-15 h-screen">
                <select
                    onChange={(e) => setcurrlang(e.target.value)}
                    className="text-white bg-gray-700 w-60 rounded-lg p-2 ml-8 mt-5 border-gray-600 border-1"
                >
                    <option value="" selected disabled>
                        Select a language...
                    </option>
                    <option value="Hindi">Hindi</option>
                    <option value="Telugu">Telugu</option>
                </select>

                <div className="mt-10 ml-7">
                    <input
                        onChange={fileselector}
                        className="bg-gray-700 text-white border-1 border-gray-600 rounded-lg p-2"
                        type="file"
                    />
                    <br />
                    <button
                        onClick={filesubmit}
                        className="bg-gray-700 text-white p-1 rounded-md mt-2 border-1 border-gray-600"
                    >
                        Upload
                    </button>
                </div>

                {res ? <FormCreator initialData={JSON.parse(jsonstring)} /> : <div></div>}
            </div>
        </div>
    );
}

export default DocumentFiller;
