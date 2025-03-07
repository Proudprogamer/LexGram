import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import SupremeCourt from "./SupremeCourt/SupremeCourt";
import HighCourt from "./HighCourt/HighCourt";
import DistrictCourt from "./DistrictCourt/DistrictCourt";

function TrackStatus() {
  const [currentSelection, setCurrentSelection] = useState("");

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <Sidebar />
      <Navbar />
      
      <div className="w-full px-6 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Case Tracking System</h1>
          
          <div className="flex justify-center mb-12">
            <select
              onChange={(e) => setCurrentSelection(e.target.value)}
              className="bg-black text-white text-xl p-4 px-12
               rounded-lg border border-gray-700 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue=""
            >
              <option value="" disabled>Select a court...</option>
              <option value="Supreme Court">Supreme Court</option>
              <option value="High Court">High Court</option>
              <option value="District Court">District Court</option>
            </select>
          </div>
          
          <div className="w-full">
            {currentSelection === "Supreme Court" && <SupremeCourt />}
            {currentSelection === "High Court" && <HighCourt />}
            {currentSelection === "District Court" && <DistrictCourt />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackStatus;