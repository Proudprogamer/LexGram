import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

function Forum (){
    return(
        <div className="grid grid-cols-28 bg-black">
            <Sidebar/>
            <Navbar/>     
        </div>
    )
}

export default Forum;