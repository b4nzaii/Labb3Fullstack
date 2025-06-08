import { Card, Button, Badge, Row, Col } from "react-bootstrap";
import type { Post } from "../types/types";
import { Link } from "react-router-dom";

interface Props {
    post: Post;
    currentUserId?: number;
    onDelete: (id: number) => void;
}

const PostCard = ({ post, currentUserId, onDelete }: Props) => {
    const token = localStorage.getItem("token");

    const handleDelete = async () => {
        if (!token) return;

        try {
            const res = await fetch(`http://localhost:8080/api/posts/${post.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                onDelete(post.id);
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error("Misslyckades att radera inlägget", err);
        }
    };

    const handleUpvote = async () => {
        if (!token) return;

        try {
            await fetch(`http://localhost:8080/api/posts/${post.id}/upvote`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            window.location.reload(); // enkel reload för att se uppdatering
        } catch (err) {
            console.error("Misslyckades att upp-rösta", err);
        }
    };

    const handleDownvote = async () => {
        if (!token) return;

        try {
            await fetch(`http://localhost:8080/api/posts/${post.id}/downvote`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            window.location.reload();
        } catch (err) {
            console.error("Misslyckades att ner-rösta", err);
        }
    };

    return (
        <Card className="mb-3 shadow-sm">
            <Card.Body>
                <Card.Title>
                    <Link to={`/posts/${post.id}`} className="title-link">
                        {post.title}
                    </Link>
                </Card.Title>

                <Card.Subtitle className="mb-2 text-muted">
                    r/{post.community_name} • postat av{" "}
                    <Link to={`/users/${post.username}`}>{post.username}</Link>
                </Card.Subtitle>

                {post.preview_image && (
                    <div className="mb-2">
                        <img
                            src={`http://localhost:8080${post.preview_image}`}
                            alt={`Bild för ${post.title}`}
                            className="img-fluid rounded"
                            style={{ maxHeight: "200px", objectFit: "cover" }}
                        />
                    </div>
                )}

                {post.content && <Card.Text>{post.content}</Card.Text>}

                <Row className="align-items-center mt-3">
                    <Col xs="auto">
                        <Button
                            size="sm"
                            variant="outline-success"
                            className="me-1"
                            onClick={handleUpvote}
                        >
                            ▲ {post.upvotes ?? 0}
                        </Button>
                        <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={handleDownvote}
                        >
                            ▼
                        </Button>
                    </Col>
                    <Col>
                        <Badge bg="secondary">
                            {post.comments ?? 0} Kommentarer
                        </Badge>
                    </Col>
                </Row>

                {currentUserId === post.user_id && (
                    <div className="mt-2 text-end">
                        <Button size="sm" variant="danger" onClick={handleDelete}>
                            Ta bort
                        </Button>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default PostCard;
