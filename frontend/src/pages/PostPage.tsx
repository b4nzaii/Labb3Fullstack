import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Spinner, Button } from "react-bootstrap";

interface Post {
    id: number;
    title: string;
    content: string;
    username: string;
    community_name: string;
    preview_image?: string;
}

const PostPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/posts/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setPost(data);
                }
            } catch (err) {
                console.error("Kunde inte hämta inlägg", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) return <Spinner animation="border" />;
    if (!post) return <div>Inlägget finns inte.</div>;

    return (
        <div className="container mt-4">
            <Button variant="secondary" onClick={() => navigate(-1)} className="mb-3">
                Tillbaka
            </Button>
            <Card>
                <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        r/{post.community_name} • postat av {post.username}
                    </Card.Subtitle>
                    {post.preview_image && (
                        <img
                            src={post.preview_image}
                            alt="Preview"
                            className="img-fluid rounded mb-3"
                            style={{ maxHeight: "300px", objectFit: "cover" }}
                        />
                    )}
                    <Card.Text>{post.content}</Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
};

export default PostPage;
