import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import SupremeCourt from "./SupremeCourt/SupremeCourt";
import HighCourt from "./HighCourt/HighCourt";
import DistrictCourt from "./DistrictCourt/DistrictCourt";
import { useNavigate } from "react-router-dom";

function TrackStatus() {
  const [currentSelection, setCurrentSelection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Hamburger menu for mobile/tablet */}
      <div className="lg:block">
        {/* Hamburger icon */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="fixed top-3 right-6 z-50 p-2 rounded-md bg-blue-900/50 backdrop-blur-sm border border-gray-800 lg:hidden"
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
        
        {/* Mobile Menu */}
        <div 
          className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-md transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full p-8 pt-24">
            <div className="flex items-center mb-12">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">LexGram</span>
            </div>
            
            <nav className="flex-1">
              <ul className="space-y-6">
                <li>
                  <a 
                    className="flex items-center text-lg font-medium text-white hover:text-blue-400 transition-colors"
                    onClick={() => {
                      navigate('/');
                      localStorage.setItem("current-tab", "home");
                      setMobileMenuOpen(false)
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    Home
                  </a>
                </li>
                <li>
                  <a 
                    className="flex items-center text-lg font-medium text-white hover:text-blue-400 transition-colors"
                    onClick={() => {
                      navigate('/document-filler');
                      localStorage.setItem("current-tab", "document-filler");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    Document Filler
                  </a>
                </li>
                
                <li>
                  <a 
                    className="flex items-center text-lg font-medium text-white hover:text-blue-400 transition-colors"
                    onClick={() => {
                      navigate('/track-status');
                      localStorage.setItem("current-tab", "track-status");
                      setMobileMenuOpen(false)
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 0 0 2.25 2.25h.75m0-3.75h3.75m-3.75 3.75h3.75M9 21h3.75m3 0h3.75M9 3h3.75m3 0h3.75M9 6h3.75m3 0h3.75M9 9h3.75m3 0h3.75" />
                    </svg>
                    Status Tracking
                  </a>
                </li>
              </ul>
            </nav>
            
            <div className="mt-auto pt-6 border-t border-gray-800">
              <button 
                onClick={() => {
                  navigate('/document-filler');
                  localStorage.setItem("current-tab", "document-filler");
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
        
        <Navbar />
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full mb-4 sm:mb-6 shadow-lg shadow-blue-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 sm:w-10 sm:h-10 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 0 0 2.25 2.25h.75m0-3.75h3.75m-3.75 3.75h3.75M9 21h3.75m3 0h3.75M9 3h3.75m3 0h3.75M9 6h3.75m3 0h3.75M9 9h3.75m3 0h3.75" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
              Case Tracking System
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto px-4">
              Track your legal cases across different court levels with real-time updates and comprehensive status information
            </p>
          </div>
          
          {/* Court Selection */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="w-full max-w-md">
              <label className="block text-sm font-medium text-gray-300 mb-3 text-center">
                Select Court Level
              </label>
              <div className="relative">
                <select
                  onChange={(e) => setCurrentSelection(e.target.value)}
                  className="w-full bg-gray-900/50 backdrop-blur-sm text-white text-base sm:text-lg p-4 sm:p-5 
                   rounded-xl border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   appearance-none cursor-pointer shadow-lg hover:bg-gray-800/50 transition-all duration-300"
                  defaultValue=""
                >
                  <option value="" disabled className="bg-gray-900 text-gray-400">
                    Choose a court level...
                  </option>
                  <option value="Supreme Court" className="bg-gray-900 text-white py-2">
                    Supreme Court of India
                  </option>
                  <option value="High Court" className="bg-gray-900 text-white py-2">
                    High Court
                  </option>
                  <option value="District Court" className="bg-gray-900 text-white py-2">
                    District Court
                  </option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Court Components Container */}
          <div className="w-full">
            {!currentSelection && (
              <div className="text-center py-12 sm:py-16">
                <div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-gray-800/50 rounded-full mb-6 sm:mb-8">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25A1.125 1.125 0 0 1 2.25 18.375v-2.25Z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-300 mb-3 sm:mb-4">
                  Select a Court Level
                </h3>
                <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto px-4">
                  Choose from Supreme Court, High Court, or District Court to start tracking your case status
                </p>
              </div>
            )}
            
            {/* Court Components with Animation */}
            <div className={`transition-all duration-500 ease-in-out ${currentSelection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {currentSelection === "Supreme Court" && <SupremeCourt />}
              {currentSelection === "High Court" && <HighCourt />}
              {currentSelection === "District Court" && <DistrictCourt />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackStatus;