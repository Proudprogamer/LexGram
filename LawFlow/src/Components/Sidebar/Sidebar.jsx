import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Sidebar(){

    let [buttonstate, setbuttonstate] = useState(false); 
    let [currtab, setcurrtab] = useState(localStorage.getItem("current-tab")) || "home";
    const navigate = useNavigate();

    useEffect(()=>{
        localStorage.setItem("current-tab",currtab);
    },[currtab])


    return(
        <div className={`translate-all duration-200 h-screen bg-black pl-[15px] pt-[10px] ${buttonstate ? "w-80" : "w-15"} z-1 border-r-1 border-gray-800 fixed`}>
                    <div>
                        <button onClick={()=>{setbuttonstate(!buttonstate)}}>
                            {buttonstate ? 
                                <div className="flex ">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className=" size-7 text-white text-white mt-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                                <h1 className={`text-lg ml-2 mt-1 cursor-default text-white text-xl font-primary`}>Menu</h1>
                                </div>

                            :
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-7 text-white text-white mt-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            }  
                             
                        </button> 
                        <div className={`translate-all duration-200 ${buttonstate ? "w-[290px]" : "w-[35px]"} mt-15`}>
                            <div onClick = {()=>{navigate('/');setcurrtab("home")}} className={`translate-all duration-200 hover:bg-blue-600/15 ${buttonstate ? "mb-10 p-3 pl-2 ml-[-7px]" : "mb-10 p-3 pl-2 ml-[-7px]"} rounded-lg ${currtab == "home" ? "bg-blue-700/30" : "bg-black"}`}>
                                <div className={`${buttonstate ? "flex pl-0.3" : ""}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className={`translate-all duration-200 size-7 ${currtab == "home" ? "text-blue-500" : "text-white"}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                    </svg>
                                    {buttonstate ?
                                        <h1 className={`text-lg ml-1.5 ${currtab == "home" ? "text-blue-500" : "text-white"} cursor-default font-primary`}>Home</h1>
                                        :
                                        <></>
                                    }
                                </div>
                            </div>

                            <div onClick = {()=>{navigate('/document-filler');setcurrtab("document-filler")}} className={`translate-all duration-200 hover:bg-blue-600/15 ${buttonstate ? "mb-10 p-3 pl-2 ml-[-7px]" : "mb-10 p-3 pl-2 ml-[-7px]"} rounded-lg ${currtab == "document-filler" ? "bg-blue-700/30" : "bg-black"}`}>
                                <div className={`translate-all duration-200 ${buttonstate ? "flex pl-0.3" : ""}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className={`translate-all duration-200 size-7 ${currtab == "document-filler" ? "text-blue-500" : "text-white"}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />                                    </svg>
                                    {buttonstate ?
                                        <h1 className={`text-lg ml-1.5 ${currtab == "document-filler" ? "text-blue-500" : "text-white"} cursor-default font-primary`}>Document Filler</h1>
                                        :
                                        <></>
                                    }
                                </div>
                            </div>

                    

                            <div onClick = {()=>{navigate('/track-status');setcurrtab("track-status")}} className={`translate-all duration-200 hover:bg-blue-600/15 ${buttonstate ? "mb-10 p-3 pl-2 ml-[-7px]" : "mb-10 p-3 pl-2 ml-[-7px]"} rounded-lg ${currtab == "track-status" ? "bg-blue-700/30" : "bg-black"}`}>
                                <div className={`translate-all duration-200 ${buttonstate ? "flex pl-0.3" : ""}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className={`translate-all duration-200 size-7 ${currtab == "track-status" ? "text-blue-500" : "text-white"}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />                                    </svg>
                                    {buttonstate ?
                                        <h1 className={`text-lg ml-1.5 ${currtab == "track-status" ? "text-blue-500" : "text-white"} cursor-default font-primary`}>Track Status</h1>
                                        :
                                        <></>
                                    }
                                </div>
                            </div>
                        </div>
          
                    </div>                                          
            </div>
    )
}

export default Sidebar;