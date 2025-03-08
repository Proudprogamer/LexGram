import React, { useState } from "react";
import RecordRTC from "recordrtc";

const AudioRecorder = () => {
  const [recorder, setRecorder] = useState(null);
  const [audioBase64, setAudioBase64] = useState("");

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const newRecorder = new RecordRTC(stream, { type: "audio" });
    newRecorder.startRecording();
    setRecorder(newRecorder);
  };

  const stopRecording = async() => {
    if (recorder) {
      recorder.stopRecording(() => {
        const blob = recorder.getBlob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async() => {
          setAudioBase64(reader.result); // Base64 version
          console.log("Base64 Audio:", reader.result.substr(22,));

          const body = {
            audioContent: reader.result.substr(22,),
            modelId : "660e9e144e7d42484da6356d",
            source : "te",
            task : "asr",
            userId : null
                   
          }

          try
          {

              const response = await fetch('https://lfbackend-hazel.vercel.app/v1/att/convert',{
              method : "POST",
              body : JSON.stringify(body),
              headers :{
                'Content-Type' : 'application/json'
              }
             })
             const text_data = await response.json();
             console.log("Translated Response:", text_data.data.source);

          }
          catch(e)
          {
            console.log("there was an error : " + e.message);
          }

        };
      });
    }
  };

  return (
    <div>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      {audioBase64 && <p>Base64 Audio Data Generated!</p>}

    </div>
  );
};

export default AudioRecorder;
