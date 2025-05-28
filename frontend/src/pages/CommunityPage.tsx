import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostList from "../components/PostList";
import PostForm from "../components/PostForm";
import type { Post } from "../types/types";

interface Community {
    id: number;
    name: string;
    description?: string;
}

const CommunityPage = () => {
    const { name } = useParams<{ name: string }>(); // Hämtar namnet från URL
    const [community, setCommunity] = useState<Community | null>(null); // Håller koll på community-info
    const [posts, setPosts] = useState<Post[]>([]); // Inlägg i comminutyt
    const [currentUserId, setCurrentUserId] = useState<number | null>(null); // Aktuell userId

    useEffect(() => {
        const fetchCommunity = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/communities/name/${name}`);
                const data = await res.json();
                if (res.ok) {
                    setCommunity(data);
                }
            } catch (err) {
                console.error("Kunde inte hämta community-info", err);
            }
        };

        const fetchCommunityPosts = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/posts/community/${name}`);
                const data = await res.json();
                if (res.ok) {
                    setPosts(data);
                }
            } catch (err) {
                console.error("Kunde inte hämta community-inlägg", err);
            }
        };

        const fetchCurrentUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const res = await fetch("http://localhost:8080/api/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const userData = await res.json();
                if (res.ok) {
                    setCurrentUserId(userData.id);
                }
            } catch (err) {
                console.error("Kunde inte hämta användare", err);
            }
        };

        fetchCommunity();
        fetchCommunityPosts();
        fetchCurrentUser();
    }, [name]);

    const handleDelete = (id: number) => {
        setPosts((prev) => prev.filter((post) => post.id !== id));
    };

    const handlePostCreated = (newPost: Post) => {
        setPosts((prev) => [newPost, ...prev]);
    };

    return (
        <div className="container mt-4">
            <h2>r/{name}</h2>
            {community && currentUserId && (
                <PostForm
                    communityId={community.id}
                    onPostCreated={handlePostCreated}
                />
            )}
            <PostList
                posts={posts}
                currentUserId={currentUserId ?? undefined}
                onDelete={handleDelete}
                onPostCreated={handlePostCreated}
            />
        </div>
    );
};

export default CommunityPage;
