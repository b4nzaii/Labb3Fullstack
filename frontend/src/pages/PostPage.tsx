import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, Spinner, Button, Form } from "react-bootstrap";

interface Post { // Gränssnitten för inlägg på hemsidan
    id: number;
    title: string;
    content: string;
    username: string;
    community_name: string;
    preview_image?: string;
    upvotes?: number;
}

interface Comment { // För kommentarer
    id: number;
    content: string;
    username: string;
    created_at: string;
}

const PostPage = () => {
    const { id } = useParams<{ id: string }>(); // Hämtar inläggs-ID från URL
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null); // Inlägget som hämtas från API och kommentarer ⬇️
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [votes, setVotes] = useState(0);

    // Hämta inlägg och kommentarer
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/posts/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setPost(data);
                    setVotes(data.upvotes ?? 0);
                }
            } catch (err) {
                console.error("Kunde inte hämta inlägg", err);
            }
        };

        const fetchComments = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/comments/${id}/comments`);
                const data = await res.json();
                if (res.ok) {
                    setComments(data);
                }
            } catch (err) {
                console.error("Kunde inte hämta kommentarer", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
        fetchComments();
    }, [id]);

    // Skicka ny kommentar
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token || !newComment.trim()) return; // Kontroll för om token finns och att kommentar inte är empty

        try {
            const res = await fetch(`http://localhost:8080/api/comments/${id}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content: newComment }),
            });

            const data = await res.json();
            if (res.ok) {
                setComments((prev) => [...prev, data]);
                setNewComment("");
            }
        } catch (err) {
            console.error("Misslyckades att lägga till kommentar", err);
        }
    };

    // Rösta
    const votePost = async (type: "upvote" | "downvote") => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(`http://localhost:8080/api/posts/${id}/${type}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                setVotes((prev) => prev + (type === "upvote" ? 1 : -1)); //Uppdaterar rösterna lokalt.
            }
        } catch (err) {
            console.error("Misslyckades att rösta", err);
        }
    };

    if (loading || !post) return <Spinner animation="border" />; // Spinner medan inlägget laddar för design syfte

    return (
        <div className="container mt-4">
            <Button variant="secondary" onClick={() => navigate(-1)} className="mb-3">
                Tillbaka
            </Button>

            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        r/{post.community_name} • postat av {post.username}
                    </Card.Subtitle>
                    {post.preview_image && (
                        <img
                            src={`http://localhost:8080${post.preview_image}`}
                            alt="Preview"
                            className="img-fluid rounded mb-3"
                            style={{ maxHeight: "400px", objectFit: "cover" }}
                        />
                    )}
                    <Card.Text>{post.content}</Card.Text>

                    <div className="d-flex align-items-center gap-2 mt-3">
                        <Button size="sm" variant="outline-success" onClick={() => votePost("upvote")}>
                            ▲
                        </Button>
                        <span>{votes}</span>
                        <Button size="sm" variant="outline-danger" onClick={() => votePost("downvote")}>
                            ▼
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            <h5>Kommentarer</h5>
            {comments.length === 0 && <p>Inga kommentarer ännu.</p>}
            {comments.map((comment) => (
                <div key={comment.id} className="mb-2 p-3 rounded comment-box">
                    <p className="mb-1">{comment.content}</p>
                    <small className="text-muted">
                        av <Link to={`/users/${comment.username}`}>{comment.username}</Link> •{" "}
                        {new Date(comment.created_at).toLocaleString()}
                    </small>
                </div>
            ))}


            <Form onSubmit={handleCommentSubmit} className="mt-3">
                <Form.Group className="mb-2">
                    <Form.Label>Lägg till kommentar</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button type="submit" variant="primary">
                    Skicka
                </Button>
            </Form>
        </div>
    );
};

export default PostPage;
