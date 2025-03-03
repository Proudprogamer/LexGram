import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import SupremeCourt from "./SupremeCourt/SupremeCourt";
import HighCourt from "./HighCourt/HighCourt";
import DistrictCourt from "./DistrictCourt/DistrictCourt";

function TrackStatus (){

    let [currentselection, setcurrentselection] = useState();

    const displayer = (message) => {
        setcurrentselection(message);
    }

    return(
        <div className="grid grid-cols-28 bg-black">
            <Sidebar/>
            <Navbar/>     
            <div className="h-fit ml-20 mt-40 col-start-10">
                <select onChange={(e)=>displayer(e.target.value)} className="bg-black text-white p-4 pl-30 pr-30 rounded-lg border-1 border-gray-800" >
                    <option className="text-white hover:bg-blue-400" value="" disabled selected>Select an option...</option>
                    <option className="text-white hover:bg-blue-400" value="Supreme Court">Supreme Court</option>
                    <option className="text-white hover:bg-blue-400" value="High Court">High Court</option>
                    <option className="text-white hover:bg-blue-400" value="District Court">District Court</option>
                    <option className="text-white hover:bg-blue-400" value="Consumer Forum">Consumer Forum</option>
                </select>
                { currentselection == "Supreme Court" ?
                    <SupremeCourt/>
                    :
                    currentselection == "High Court" ? 
                    <HighCourt/> :
                    currentselection == "District Court" ?
                    <DistrictCourt/>
                     :
                    <div>

                    </div>
                }
            </div>
        </div>
    )
}

export default TrackStatus;