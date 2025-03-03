import React from "react";
import Sidebar from "./Components/Sidebar/Sidebar";
import Navbar from "./Components/Navbar/Navbar";

export default function App(){
  return(
    <>
      <div>
          <Sidebar/>
          <Navbar/>  
          <div className="h-screen bg-black">
            
          </div>   
      </div>
    </>
    
    
  )
}