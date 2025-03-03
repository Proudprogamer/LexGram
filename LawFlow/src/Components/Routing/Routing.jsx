import React from "react";
import { Route, Routes } from "react-router-dom";
import App from "../../App";
import TrackStatus from "../TrackStatus/TrackStatus";
import DocumentFiller from "../DocumentFiller/DocumentFiller";
import Forum from "../Forum/Forum";

function Routing (){
    return(
        <>
        <Routes>
            <Route path="/" element={<App/>}/>
            <Route path="/document-filler" element={<DocumentFiller/>}/>
            <Route path="/forum" element={<Forum/>}/>
            <Route path="/track-status" element={<TrackStatus/>}/>
        </Routes>
        </>
    )
}

export default Routing;