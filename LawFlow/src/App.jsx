import React, { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Components/Sidebar/Sidebar";
import Navbar from "./Components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Animation variants for staggered children animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  // Service cards data
  const services = [
    {
      title: "Document Filler",
      description: "Translate documents into any language from a list of over 15 Indian languages and fill them by using speech and download the final document filled in English.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      )
    },
    {
      title: "Legal Forum",
      description: "A legal community which will allow you to get awareness of your legal rights by learning from people who have faced similar problems.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
      )
    },
    {
      title: "Status Tracking",
      description: "Track the status of your case in the District courts, High Courts and the Supreme Court of India.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 0 0 2.25 2.25h.75m0-3.75h3.75m-3.75 3.75h3.75M9 21h3.75m3 0h3.75M9 3h3.75m3 0h3.75M9 6h3.75m3 0h3.75M9 9h3.75m3 0h3.75" />
        </svg>
      )
    }
  ];

  // Steps data
  const steps = [
    {
      number: 1,
      title: "Choose Your Language",
      description: "Select your preferred language and upload the document you need to fill."
    },
    {
      number: 2,
      title: "Speak to Fill",
      description: "Fill the form fields by using speech recognition in your own language."
    },
    {
      number: 3,
      title: "Get Your Document",
      description: "Download the completed document with all fields filled in English."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white overflow-hidden">
      {/* Hamburger menu for mobile/tablet */}
      <div className="lg:hidden">
        {/* Hamburger icon */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="fixed top-3 right-6 z-50 p-2 rounded-md bg-blue-900/50 backdrop-blur-sm border border-gray-800"
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
              <span className="text-xl font-bold text-white">LegalAssist</span>
            </div>
            
            <nav className="flex-1">
              <ul className="space-y-6">
                <li>
                  <a 
                    href="#" 
                    className="flex items-center text-lg font-medium text-white hover:text-blue-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    Home
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
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
                    href="#" 
                    className="flex items-center text-lg font-medium text-white hover:text-blue-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                    </svg>
                    Legal Forum
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="flex items-center text-lg font-medium text-white hover:text-blue-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
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
      
      <div className="lg:ml-20 mt-10">
        {/* Hero Section */}
        <section className="relative pt-16 lg:pt-24 px-4 sm:px-6 lg:px-12 pb-20 ml-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left content */}
              <motion.div 
                className="w-full lg:w-1/2 z-10"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-6 leading-tight">
                  Professional Legal Solutions
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-lg">
                  Expert advice and representation to navigate complex legal challenges with confidence and clarity.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => {
                      navigate('/document-filler');
                      localStorage.setItem("current-tab", "document-filler");
                    }} 
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-full font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300"
                  >
                    Get Started
                  </button>
                  <button className="px-8 py-3 border border-blue-600 text-blue-400 hover:bg-blue-900/20 rounded-full font-medium transition-all duration-300">
                    Learn More
                  </button>
                </div>
              </motion.div>
              
              {/* Right content with animated logo */}
              <motion.div 
                className="w-full lg:w-1/2 flex justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative">
                  {/* Glowing background */}
                  <div className="absolute inset-0 -z-10 bg-blue-600/20 blur-3xl rounded-full"></div>
                  
                  {/* Logo container */}
                  <div className="w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-xl shadow-blue-600/30 p-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={1.5} 
                      stroke="currentColor" 
                      className="w-24 h-24 text-white"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Abstract shapes */}
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-20 left-10 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl -z-10"></div>
        </section>

        {/* Services Section */}
        <motion.section 
          className="py-20 px-4 sm:px-6 lg:px-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              variants={itemVariants}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Services</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-blue-600/50 transition-all duration-300 group"
                >
                  <div className="p-6">
                    <div className="bg-blue-900/20 rounded-lg w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-blue-900/30 transition-all duration-300">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-blue-400 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-gray-400">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
        
        {/* Process Section */}
        <motion.section 
          className="py-20 px-4 sm:px-6 lg:px-12 relative overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              variants={itemVariants}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
            </motion.div>
            
            {/* Steps - Timeline for desktop, Cards for mobile */}
            <div className="relative">
              {/* Mobile/Tablet view - stacked cards */}
              <div className="lg:hidden space-y-8">
                {steps.map((step, index) => (
                  <motion.div 
                    key={index}
                    variants={itemVariants}
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
                  >
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-center text-xl font-bold mr-4">
                        {step.number}
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-400 pl-16">
                      {step.description}
                    </p>
                  </motion.div>
                ))}
              </div>
              
              {/* Desktop view - zig-zag timeline */}
              <div className="hidden lg:block">
                {/* Timeline line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-blue-800 transform -translate-x-1/2 -z-10 rounded-full"></div>
                
                {steps.map((step, index) => (
                  <motion.div 
                    key={index} 
                    variants={itemVariants}
                    className={`flex mb-24 ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}
                  >
                    <div className="w-1/2 px-8">
                      <div className={`bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 ${index % 2 === 0 ? 'mr-8' : 'ml-8'} hover:border-blue-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20`}>
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <span className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-center text-lg font-bold mr-4">
                            {step.number}
                          </span>
                          {step.title}
                        </h3>
                        <p className="text-gray-400">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    <div className="w-1/2"></div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Call to Action Button */}
            <motion.div 
              className="text-center mt-16"
              variants={itemVariants}
            >
              <button 
                onClick={() => {
                  navigate('/document-filler');
                  localStorage.setItem("current-tab", "document-filler");
                }} 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-full font-medium text-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 flex items-center mx-auto"
              >
                <span>Fill a Document</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </motion.div>
          </div>
          
          {/* Background elements */}
          <div className="absolute top-1/2 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-20 right-0 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl -z-10"></div>
        </motion.section>
        
        {/* Footer Section */}
        <footer className="py-12 px-4 sm:px-6 lg:px-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">LegalAssist</span>
              </div>
              <p className="text-gray-400 mt-2 max-w-md">Providing professional legal solutions and document assistance for everyone.</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} LegalAssist. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}