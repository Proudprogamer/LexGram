import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

function Profile() {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Check if user is logged in
    const [userPosts, setUserPosts] = useState([]); // Store user's posts
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulated authentication check (Replace with actual logic)
        const authToken = localStorage.getItem("authToken"); // Check if user is logged in
        if (authToken) {
            setIsAuthenticated(true);
            fetchUserPosts(); // Fetch user posts if authenticated
        } else {
            setIsAuthenticated(false);
            setLoading(false);
        }
    }, []);

    const fetchUserPosts = async () => {
        try {
            const response = await fetch("https://lexgram.onrender.com/forum/user-posts", {
                method: "GET",
                headers: { "Authorization": `Bearer ${localStorage.getItem("authToken")}` }
            });

            if (!response.ok) throw new Error("Failed to fetch user posts");

            const postsData = await response.json();
            setUserPosts(postsData);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken"); // Remove authentication token
        setIsAuthenticated(false);
    };

    return (
        <div className="flex h-screen bg-black text-white">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Navbar />

                <div className="p-6 flex-1 overflow-auto max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>

                    {/* Authentication Controls */}
                    <div className="flex justify-end mb-4">
                        {isAuthenticated ? (
                            <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded">
                                Logout
                            </button>
                        ) : (
                            <p className="text-center text-gray-400">You must be logged in to view your profile.</p>
                        )}
                    </div>

                    {/* Loading & Error Handling */}
                    {loading && <p className="text-center text-gray-400">Loading your posts...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}

                    {/* User Posts Display */}
                    {isAuthenticated && !loading && (
                        <div className="space-y-4">
                            {userPosts.length === 0 ? (
                                <p className="text-center text-gray-400">You have not posted anything yet.</p>
                            ) : (
                                userPosts.map((post, index) => (
                                    <div key={index} className="bg-gray-800 p-4 rounded border border-gray-700">
                                        <p>{post.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
