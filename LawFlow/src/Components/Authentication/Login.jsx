import React, { useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import { motion } from "framer-motion";

function Login() {
    const [number, setNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // ✅ **Send OTP**
    const sendOtp = async () => {
        if (!number) return;
        
        setIsLoading(true);
        try {
            const response = await axios.post("https://lexgram.onrender.com/api/otp/send", {
                phoneNumber: number
            });

            if (response.data.success) {
                setShowOtpInput(true);
                alert("OTP sent successfully!");
            } else {
                alert("Failed to send OTP");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            alert("Error sending OTP");
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ **Verify OTP**
    const verifyOtp = async () => {
        if (!otp) return;
        
        setIsLoading(true);
        try {
            const response = await axios.post("https://lexgram.onrender.com/api/otp/verify", {
                phoneNumber: number,
                otp: otp
            });

            if (response.data.success) {
                alert("OTP verified successfully!");
            } else {
                alert("Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            alert("Error verifying OTP");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
            <Sidebar />
            <Navbar />

            <div className="flex justify-center items-center min-h-screen pt-20 px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row"
                >
                    {/* Left Section - Branding */}
                    <div className="bg-indigo-600 p-8 md:w-2/5 flex flex-col justify-between">
                        <div>
                        <div className="w-20 h-20 bg-black rounded-lg flex items-center justify-center mb-8">
                                {/* Your logo here */}
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    strokeWidth={1.75} 
                                    stroke="currentColor" 
                                    className="size-8 text-white"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                                </svg>
                            </div>
                            <h2 className="text-white text-3xl font-bold mb-4">Welcome</h2>
                            <p className="text-indigo-100 mb-6">Log in to access your account and continue where you left off with our legal services.</p>
                        </div>
                        <div className="hidden md:block">
                            <p className="text-indigo-100 text-sm">© 2025 LawFlow. All rights reserved.</p>
                        </div>
                    </div>

                    {/* Right Section - Form */}
                    <div className="p-8 md:w-3/5 bg-gray-800">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">Login to Your Account</h2>
                            <p className="text-gray-400">Please enter your phone number to continue</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="number">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <input
                                        onChange={(e) => setNumber(e.target.value)}
                                        className="bg-gray-700 text-white w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                        name="number"
                                        placeholder="Enter your phone number"
                                        type="tel"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={sendOtp}
                                disabled={isLoading || !number}
                                className={`w-full py-3 rounded-lg font-medium transition-all ${
                                    isLoading || !number 
                                        ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
                                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                }`}
                            >
                                {isLoading ? "Sending..." : "Get OTP"}
                            </button>

                            {showOtpInput && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <div className="mt-6">
                                        <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="otp">
                                            Enter OTP
                                        </label>
                                        <div className="relative">
                                            <input
                                                onChange={(e) => setOtp(e.target.value)}
                                                className="bg-gray-700 text-white w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                                name="otp"
                                                placeholder="Enter the 6-digit OTP"
                                                type="text"
                                                maxLength="6"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={verifyOtp}
                                        disabled={isLoading || !otp}
                                        className={`w-full py-3 rounded-lg font-medium transition-all ${
                                            isLoading || !otp
                                                ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
                                                : "bg-green-600 hover:bg-green-700 text-white"
                                        }`}
                                    >
                                        {isLoading ? "Verifying..." : "Verify OTP"}
                                    </button>
                                </motion.div>
                            )}

                            <div className="pt-4 text-center">
                                <p className="text-gray-400">
                                    New User? <a className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors" href="/sign-up">Sign Up</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default Login;