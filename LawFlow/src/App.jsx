import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Components/Sidebar/Sidebar";
import Navbar from "./Components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 ml-[60px] pt-16">
        <Navbar />
        <main className="container mx-auto px-4 lg:px-6">
          {/* Hero Section */}
          <div className="pt-8 lg:pt-24">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              {/* Left side */}
              <motion.div 
                className="w-full lg:w-1/2 mb-10 lg:mb-0"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  Professional Legal Solutions For Your Needs
                </h1>
                <p className="text-xl text-white">
                  Expert advice and representation to navigate complex legal challenges
                </p>
              </motion.div>
              
              {/* Right side */}
              <motion.div 
                className="w-full lg:w-1/2 flex justify-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="w-48 h-48 lg:w-64 lg:h-64 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.75} 
                    stroke="currentColor" 
                    className="w-24 h-24 lg:size-25 text-white"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                  </svg>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="py-16 lg:py-20 mt-8 lg:mt-16">
            <div className="mx-auto">
              <h2 className="text-3xl font-bold text-center text-white mb-12">
                Our Services
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Feature Cards */}
                <div className="bg-black rounded-lg shadow-md p-6 hover:shadow-lg hover:bg-blue-800/15 border border-gray-800 transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Document Filler
                  </h3>
                  <p className="text-gray-600">
                    Translate documents into any language from a list of over 15 Indian languages and fill them by using speech and download the final document filled in English.
                  </p>
                </div>
                
                <div className="bg-black rounded-lg shadow-md p-6 hover:shadow-lg hover:bg-blue-800/15 border border-gray-800 transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Legal Forum
                  </h3>
                  <p className="text-gray-600">
                    A legal community which will allow you to get awareness of your legal rights by learning from people who have faced similar problems.
                  </p>
                </div>
                
                <div className="bg-black rounded-lg shadow-md p-6 hover:shadow-lg hover:bg-blue-800/15 border border-gray-800 transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Status Tracking
                  </h3>
                  <p className="text-gray-600">
                    Track the status of your case in the District courts, High Courts and the Supreme Court of India.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Process Section */}
          <div className="py-16 lg:py-20 bg-black">
            <div className="mx-auto">
              <h2 className="text-3xl font-bold text-center text-white mb-16">
                Getting Started
              </h2>
              
              <div className="relative">
                {/* Step 1 */}
                <div className="flex flex-col lg:flex-row items-center mb-16">
                  <div className="w-full lg:w-1/2">
                    <div className="bg-black border border-gray-800 hover:bg-blue-800/15 rounded-lg shadow-md p-6 mx-0 lg:mx-4">
                      <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-4">1</div>
                      <h3 className="text-xl font-semibold text-white mb-4">Step: 1</h3>
                      <p className="text-gray-600">Choose the desired language and upload a document.</p>
                    </div>
                  </div>
                  <div className="hidden lg:block w-1/2"></div>
                </div>

                {/* Connector Line - Only visible on desktop */}
                <div className="hidden lg:block absolute left-1/2 top-24 h-full w-0.5 bg-blue-200 -z-10 transform -translate-x-1/2"></div>
                
                {/* Step 2 */}
                <div className="flex flex-col lg:flex-row items-center mb-16">
                  <div className="hidden lg:block w-1/2"></div>
                  <div className="w-full lg:w-1/2">
                    <div className="bg-black border border-gray-800 hover:bg-blue-800/15 rounded-lg shadow-md p-6 mx-0 lg:mx-4">
                      <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-4">2</div>
                      <h3 className="text-xl font-semibold text-white mb-4">Step: 2</h3>
                      <p className="text-gray-600">Fill the form fields by using speech in your own language.</p>
                    </div>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="flex flex-col lg:flex-row items-center mb-8">
                  <div className="w-full lg:w-1/2">
                    <div className="bg-black border border-gray-800 hover:bg-blue-800/15 rounded-lg shadow-md p-6 mx-0 lg:mx-4">
                      <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-4">3</div>
                      <h3 className="text-xl font-semibold text-white mb-4">Step: 3</h3>
                      <p className="text-gray-600">Download the final document with form fields filled in English.</p>
                    </div>
                  </div>
                  <div className="hidden lg:block w-1/2"></div>
                </div>
              </div>
              
              {/* CTA Button */}
              <div className="text-center mt-16">
                <button 
                  onClick={() => {
                    navigate('/document-filler');
                    localStorage.setItem("current-tab", "document-filler");
                  }} 
                  className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                >
                  Fill a Document
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}