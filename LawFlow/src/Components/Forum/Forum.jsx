import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

function Forum() {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state
    const [posts, setPosts] = useState([]); // Store posts
    const [newPost, setNewPost] = useState(""); // New post input

    useEffect(() => {
        // Fetch forum posts when the component loads
        fetch("http://localhost:3000/forum/posts")
            .then((res) => res.json())
            .then((data) => setPosts(data))
            .catch((error) => console.error("❌ Error fetching posts:", error));
    }, []);

    const handleLogin = () => {
        // Simulated authentication (replace with actual auth)
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            alert("❌ You must be logged in to post.");
            return;
        }

        const postData = { content: newPost };

        try {
            const response = await fetch("http://localhost:3000/forum/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postData),
            });

            if (!response.ok) throw new Error("❌ Failed to post");

            const newPostData = await response.json();
            setPosts([newPostData, ...posts]); // Add the new post to the list
            setNewPost(""); // Clear input field
        } catch (error) {
            console.error("❌ Error posting:", error);
        }
    };

    return (
        <div className="flex h-screen bg-black text-white">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Navbar />

                <div className="p-6 flex-1 overflow-auto max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6 text-center">Forum</h1>

                    {/* Authentication Controls */}
                    <div className="flex justify-end mb-4">
                        {isAuthenticated ? (
                            <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded">
                                Logout
                            </button>
                        ) : (
                            <button onClick={handleLogin} className="bg-green-600 px-4 py-2 rounded">
                                Login
                            </button>
                        )}
                    </div>

                    {/* Post Submission (Only if Authenticated) */}
                    {isAuthenticated && (
                        <form onSubmit={handlePostSubmit} className="mb-6">
                            <textarea
                                className="w-full bg-gray-800 text-white p-3 rounded border border-gray-700"
                                rows="3"
                                placeholder="Write your post..."
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                            />
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-3 w-full">
                                Post
                            </button>
                        </form>
                    )}

                    {/* Display Forum Posts */}
                    <div className="space-y-4">
                        {posts.length === 0 ? (
                            <p className="text-center text-gray-400">No posts yet. Be the first to post!</p>
                        ) : (
                            posts.map((post, index) => (
                                <div key={index} className="bg-gray-800 p-4 rounded border border-gray-700">
                                    <p>{post.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Forum;
