import React, { use, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

function Signup() {
    const [number, setNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [userotp, setuserotp] = useState();

    const otpp = Math.floor(100000 + Math.random() * 900000);

    // Function to send OTP
    const sendOtp = async () => {
        setShowOtpInput(true);

        const body = {
            phone: number,
            message : otpp
        }
        console.log('sending request with body' + body.message);


        const response = await axios.post('http://localhost:3000/sms/send',
            body,
            {
                headers : {
                    'Content-Type' : 'application/json'
                }
            }
        )
        const text = await JSON.stringify(response.config.data).toString().slice(-9);
        
        
    };

    // Function to verify OTP
    const verifyOtp = async () => {

        const body = {
            number : number
        }

        if(otp==otp.toString()){

            const response = await axios.post('http://localhost:3000/user/new-user',
                body,
                {
                    headers:
                    {
                        'Content-Type' : 'application/json'
                    }
                }
            )
            const hash = response.data;
            localStorage.setItem("auth", hash);

            console.log('user created');

            
        }



    };

    return (
        <div>
            <Sidebar />
            <Navbar />

            <div className="bg-black pt-60 pl-120 h-screen flex">
                <div className="bg-black border-2 border-white rounded-lg w-60 h-75">
                    {/* logo */}
                </div>

                <div className="ml-20 mt-20">
                    <label className="text-white" htmlFor="number">Phone Number</label>
                    <br />
                    <input 
                        onChange={(e) => setNumber(e.target.value)} 
                        className="text-white border border-gray-500 rounded-lg p-2 w-80 mt-1 mb-2" 
                        name="number" 
                        placeholder="Type here..." 
                    />
                    
                    <div onClick={()=>{sendOtp();
                        
                    }} className="bg-blue-400 p-2 w-80 rounded-lg text-center cursor-pointer">
                        Get OTP
                    </div>

                    {showOtpInput && (
                        <>
                            <label className="text-white mt-4" htmlFor="otp">Enter OTP</label>
                            <br />
                            <input 
                                onChange={(e) => setOtp(e.target.value)} 
                                className="text-white border border-gray-500 rounded-lg p-2 w-80 mt-1 mb-2" 
                                name="otp" 
                                placeholder="Enter OTP..."
                            />
                            <div onClick={verifyOtp} className="bg-green-400 p-2 w-80 rounded-lg text-center cursor-pointer">
                                Verify OTP
                            </div>
                        </>
                    )}

                    <h1 className="text-white mt-4">
                        Existing User ? <a className="text-blue-500" href="/login">Login here</a>
                    </h1>
                </div>
            </div>
        </div>
    );
}

export default Signup;
