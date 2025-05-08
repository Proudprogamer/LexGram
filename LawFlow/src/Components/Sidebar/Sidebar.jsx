import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Sidebar(){
    const [currtab, setcurrtab] = useState(localStorage.getItem("current-tab"));
    const navigate = useNavigate();

    useEffect(()=>{
        localStorage.setItem("current-tab",currtab);
    },[currtab])

    return(
        <div className="fixed top-0 left-0 h-screen bg-black w-[60px] pl-[15px] pt-[80px] z-40 border-r border-gray-800"> {/* Added pt-[80px] */}
            <div className="mt-4"> {/* Added additional top margin */}
                {/* Menu Items */}
                <div onClick={() => {
                    navigate('/');
                    setcurrtab("home");
                }} 
                className={`group relative transition-all duration-200 hover:bg-blue-600/15 mb-10 p-3 pl-2 ml-[-7px] rounded-lg ${currtab === "home" ? "bg-blue-700/30" : "bg-black"}`}>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.75} 
                        stroke="currentColor" 
                        className={`size-7 ${currtab === "home" ? "text-blue-500" : "text-white"}`}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    <span className="absolute left-16 top-2 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                        Home
                    </span>
                </div>

                <div onClick={() => {
                    navigate('/document-filler');
                    setcurrtab("document-filler");
                }} 
                className={`group relative transition-all duration-200 hover:bg-blue-600/15 mb-10 p-3 pl-2 ml-[-7px] rounded-lg ${currtab === "document-filler" ? "bg-blue-700/30" : "bg-black"}`}>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.75} 
                        stroke="currentColor" 
                        className={`size-7 ${currtab === "document-filler" ? "text-blue-500" : "text-white"}`}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    <span className="absolute left-16 top-2 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                        Document Filler
                    </span>
                </div>

                <div onClick={() => {
                    navigate('/track-status');
                    setcurrtab("track-status");
                }} 
                className={`group relative transition-all duration-200 hover:bg-blue-600/15 mb-10 p-3 pl-2 ml-[-7px] rounded-lg ${currtab === "track-status" ? "bg-blue-700/30" : "bg-black"}`}>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.75} 
                        stroke="currentColor" 
                        className={`size-7 ${currtab === "track-status" ? "text-blue-500" : "text-white"}`}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span className="absolute left-16 top-2 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                        Track Status
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;