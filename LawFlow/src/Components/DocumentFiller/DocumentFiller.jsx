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
    
        if (currfile.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            alert("Invalid file type! Please upload a .docx file.");
            return;
        }
    
        try {
            const reader = new FileReader();
            reader.readAsArrayBuffer(currfile);
            reader.onload = async (e) => {
                const arrayBuffer = e.target.result;
                const result = await Mammoth.extractRawText({ arrayBuffer });
    
                // ✅ Step 1: Send extracted text to backend for key extraction
                const response = await fetch("http://localhost:3000/document/reader", {
                    method: "POST",
                    body: JSON.stringify({ text: result.value }),
                    headers: { "Content-Type": "application/json" },
                });
    
                if (!response.ok) throw new Error("Failed to fetch document data");
    
                const data_obj = await response.json();
                console.log("Backend response:", data_obj);
    
                if (!data_obj.response) {
                    console.error("Invalid response from backend.");
                    return;
                }
    
                settext(data_obj.response);
    
                try {
                    // ✅ Step 2: Parse and extract keys
                    const jsonObject = JSON.parse(data_obj.response);
                    const separr = Object.keys(jsonObject).join(", ");
                    console.log("Extracted keys:", separr);
    
                    // ✅ Step 3: Translate extracted keys
                    const body = {
                        modelId: "65686cca00d64169e2f8f3e7",
                        task: "translation",
                        input: [{ source: separr }],
                        userId: null,
                    };
    
                    const translationResponse = await fetch("http://localhost:3000/v1/english/translate", {
                        method: "POST",
                        body: JSON.stringify(body),
                        headers: { "Content-Type": "application/json" },
                    });
    
                    if (!translationResponse.ok) throw new Error("Translation API failed");
    
                    const text_data = await translationResponse.json();
                    console.log("Translation API response:", text_data);
    
                    const inputString = text_data.output[0]?.target;
                    if (!inputString) {
                        console.error("Translation API did not return expected output.");
                        return;
                    }
    
                    // ✅ Step 4: Prepare translated JSON
                    const keysArray = inputString.split(", ");
                    const translatedJsonObject = Object.fromEntries(keysArray.map((key) => [key, ""]));
                    const jsonString = JSON.stringify(translatedJsonObject, null, 2);
    
                    setjsonstring(jsonString);
                    console.log("Translated JSON:", jsonString);
                    setres(true);
                } catch (error) {
                    console.error("Error processing JSON:", error);
                }
            };
        } catch (error) {
            console.error("File processing error:", error);
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
