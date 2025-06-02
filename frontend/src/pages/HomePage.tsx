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

        const fetchCurrentUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await fetch("http://localhost:8080/api/users/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setCurrentUserId(data.id);
                }
            } catch (err) {
                console.error("Kunde inte hämta användare", err);
            }
        };
        fetchCurrentUser();
        fetchPosts();
    }, []);

    const handleDelete = (id: number) => {
        setPosts((prev) => prev.filter((post) => post.id !== id)); // Tar bort inlägg från listan lokalt
    };

    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            <div className={`border-end px-2 ${document.body.classList.contains('dark-mode') ? 'bg-dark text-light' : 'bg-light'}`} style={{ width: '250px' }}>                <Sidebar />
            </div>
            <div className="flex-grow-1 p-4">
                <h2 className="mb-4">FYP</h2>
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
