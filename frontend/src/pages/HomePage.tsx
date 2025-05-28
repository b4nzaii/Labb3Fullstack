import { useEffect, useState } from "react";
import PostList from "../components/PostList";
import Sidebar from "../components/Sidebar";
import type { Post } from "../types/types";

const HomePage = () => {
    const [posts, setPosts] = useState<Post[]>([]); // Håller koll på inlägg
    const [currentUserId, setCurrentUserId] = useState<number | undefined>(); // Håller koll på aktuell userid

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/posts");
                const data = await res.json();
                if (res.ok) setPosts(data);
            } catch (err) {
                console.error("Kunde inte hämta inlägg", err);
            }
        };

        const userId = localStorage.getItem("userId");
        if (userId) setCurrentUserId(Number(userId));

        fetchPosts();
    }, []);

    const handleDelete = (id: number) => {
        setPosts((prev) => prev.filter((post) => post.id !== id)); // Tar bort inlägg från listan lokalt
    };

    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            <div className="bg-light border-end" style={{ width: '250px' }}>
                <Sidebar />
            </div>
            <div className="flex-grow-1 p-4">
                <h2>FYP</h2>
                <PostList
                    posts={posts}
                    currentUserId={currentUserId}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default HomePage;
