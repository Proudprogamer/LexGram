import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

function Forum() {
   

    return (
        <div className="flex h-screen bg-black text-black">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Navbar />

                <p className="mt-90 ml-170 text-white">We'll be available shortly!!</p>
            </div>
        </div>
    );
}

export default Forum;
