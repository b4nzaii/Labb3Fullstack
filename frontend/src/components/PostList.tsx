import { useEffect, useState } from "react";
import PostCard from "./PostCard"

//Sätter standard för typdefinitionerna för ett inlägg
interface Post {
    id: number;
    title: string;
    content: string;
    community_name: string
    username: string;
    upvotes: number;
    comments: number;
}

const PostList = () => {
    // State för att lisa över inlägg
    const [posts, setPosts] = useState<Post[]>([])

    //Körs vid sidladdning, hämtar inlägg från backend med fetch anrop igen
    useEffect(() => {
        const fetchPosts = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch('http://localhost:8080/api/posts/foryou', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (res.ok) {
                setPosts(data);
            } else {
                console.error("Kunde inte hämta inlägg", data.message)
            }
        };

        fetchPosts()
    }, []);

    return (
        <>
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    title={post.title}
                    body={post.content}
                    community={post.community_name}
                    username={post.username}
                    upvotes={post.upvotes ?? 0}
                    comments={post.comments ?? 0}
                />
            ))}
        </>
    )
}

export default PostList;