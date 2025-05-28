import type { Post } from "../types/types";
import PostCard from "./PostCard";

interface PostListProps {
    posts: Post[];
    currentUserId?: number; // 
    onDelete: (id: number) => void; // Callback för att ta bort inlägg
    onPostCreated?: (newPost: Post) => void; // För att hantera skapade inlägg
}


const PostList = ({ posts, currentUserId, onDelete }: PostListProps) => {
    return (
        <>
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={currentUserId}
                    onDelete={onDelete}
                />
            ))}
        </>
    );
};

export default PostList;
