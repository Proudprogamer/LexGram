import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    // Check authentication status on mount and when localStorage changes
    useEffect(() => {
        const checkAuth = () => {
            const authToken = localStorage.getItem("authToken");
            setIsAuthenticated(!!authToken);
        };

        // Initial check
        checkAuth();

        // Listen for storage changes (in case user logs in/out in another tab)
        window.addEventListener('storage', checkAuth);
        
        return () => {
            window.removeEventListener('storage', checkAuth);
        };
    }, []);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        setShowDropdown(false);
        navigate("/login");
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        if (showDropdown) {
            const handleClickOutside = (event) => {
                if (!event.target.closest('.profile-menu')) {
                    setShowDropdown(false);
                }
            };
            
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showDropdown]);

    return (
        <div>
            <div className="flex bg-black w-full h-16 items-center border-b border-gray-800 fixed z-10">
                {/* Logo and brand name */}
                <div className="flex items-center ml-8">
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
                    <h1 className="pl-2 text-2xl text-white font-bold cursor-default">
                        LawFlow
                    </h1>
                </div>

                {/* Center search bar */}
                <div className="flex-1 flex justify-center px-4">
                    <div className="relative max-w-md w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-5 w-5 text-gray-500" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            className="block w-full bg-gray-900 border border-gray-800 rounded-lg py-2 pl-10 pr-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-700 transition duration-150 ease-in-out"
                            placeholder="Search..."
                            type="search"
                        />
                    </div>
                </div>

                {/* Right side controls */}
                <div className="flex items-center mr-8 space-x-4">
                    {/* Theme toggle */}
                    <button className="text-gray-400 hover:text-white focus:outline-none">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={2} 
                            stroke="currentColor" 
                            className="size-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                        </svg>
                    </button>

                    {/* Conditional rendering based on authentication status */}
                    {isAuthenticated ? (
                        <div className="relative profile-menu">
                            <svg
                                onClick={() => setShowDropdown(!showDropdown)}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.75}
                                stroke="currentColor"
                                className="size-8 text-white cursor-pointer hover:text-gray-300"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>

                            {/* Dropdown always appears when clicked if authenticated */}
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-800 rounded-lg shadow-lg">
                                    <button 
                                        onClick={() => {
                                            navigate("/profile");
                                            setShowDropdown(false);
                                        }} 
                                        className="block text-left w-full px-4 py-2 text-white hover:bg-gray-900 rounded-t-lg"
                                    >
                                        Profile
                                    </button>
                                    <button 
                                        onClick={() => {
                                            navigate("/settings");
                                            setShowDropdown(false);
                                        }} 
                                        className="block text-left w-full px-4 py-2 text-white hover:bg-gray-900"
                                    >
                                        Settings
                                    </button>
                                    <div className="border-t border-gray-800 my-1"></div>
                                    <button 
                                        onClick={handleLogout} 
                                        className="block text-left w-full px-4 py-2 text-gray-400 hover:bg-gray-900 hover:text-red-500 rounded-b-lg"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button 
                            onClick={() => navigate("/login")} 
                            className="bg-black text-white px-4 py-2 rounded-lg border border-gray-800 hover:bg-gray-900"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navbar;