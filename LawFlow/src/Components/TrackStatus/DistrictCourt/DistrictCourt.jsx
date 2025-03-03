import React, { useState } from "react";

function DistrictCourt (){

    let [field, setfield] = useState();

    const formhandler = async (e) => {
        e.preventDefault();
    
        const data = new FormData(e.target);
        const body = JSON.stringify(Object.fromEntries(data));
    
        console.log("Sending request:", body); // Debugging log
    
        try {
            const response = await fetch("http://localhost:3000/district-court/case", {
                method: "POST",
                body : body,
                headers : {
                    'Content-Type' : 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            const res_data = await response.json();
    
            console.log("Received response:", res_data);
        } catch (error) {
            console.error("Fetch error:", error.message);
        }
    };
    

    return(
        <div>
            <br></br>
            <br></br>
            <select onChange={(e)=>setfield(e.target.value)} className="bg-black text-white p-4 pl-30 pr-28 rounded-lg border-1 border-gray-800" >
                <option className="text-white hover:bg-blue-400" value="" disabled selected>Select an option...</option>
                <option className="text-white hover:bg-blue-400" value="Case Details">Case Details</option>
            </select>

            {
                
                field == "Case Details" ?
                <div>
                    <form id="myform" onSubmit={(e)=>{formhandler(e)}}>
                        <label for="cnr" className="text-white">CNR</label>
                        <input name="cnr" placeholder="Type here..." className="text-white border-1 border-gray-800 rounded-lg p-2 w-[390px]"></input>

                        <button type="submit" className="text-white">Submit</button>
                    </form>
                </div>
                :
                <div>

                </div>
                
            }


        </div>
    )
}

export default DistrictCourt;