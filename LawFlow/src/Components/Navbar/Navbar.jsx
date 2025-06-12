import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const authToken = localStorage.getItem("authToken");
            setIsAuthenticated(!!authToken);
        };
        checkAuth();
        window.addEventListener('storage', checkAuth);
        return () => {
            window.removeEventListener('storage', checkAuth);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        setShowDropdown(false);
        navigate("/login");
    };

    const handleLogoClick = () => {
        navigate('/');
        localStorage.setItem("current-tab", "home");
    };

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
            <div className="flex bg-black w-full h-16 items-center border-b border-gray-800 fixed z-20">
                {/* Logo and brand name */}
                <button
                    onClick={handleLogoClick}
                    className="flex items-center ml-4 md:ml-8 hover:opacity-80 transition-opacity duration-300 lg:pl-10"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.75}
                        stroke="currentColor"
                        className="size-6 sm:size-7 md:size-8 text-white"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                    </svg>
                    <span className="pl-1 sm:pl-2 text-lg sm:text-xl md:text-2xl text-white font-bold">
                        LexGram
                    </span>
                </button>

                {/* Mobile spacing adjustment - push content to account for hamburger menu */}
                <div className="md:hidden ml-auto mr-16">
                    {/* This creates space for the hamburger menu button on mobile */}
                </div>
            </div>
        </div>
    );
}

export default Navbar;