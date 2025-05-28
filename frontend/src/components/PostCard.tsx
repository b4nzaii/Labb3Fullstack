import { Card, Button, Badge, Row, Col } from "react-bootstrap";
import type { Post } from "../types/types";

interface Props {
    post: Post;
    currentUserId?: number;
    onDelete: (id: number) => void;
}

const PostCard = ({ post, currentUserId, onDelete }: Props) => {
    const handleDelete = async () => {
        const token = localStorage.getItem("token");
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

    return (
        <Card className="mb-3 shadow-sm">
            <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    r/{post.community_name} • postat av {post.username}
                </Card.Subtitle>

                {post.preview_image && (
                    <div className="mb-2">
                        <img
                            src={post.preview_image}
                            alt="preview"
                            className="img-fluid rounded"
                            style={{ maxHeight: "200px", objectFit: "cover" }}
                        />
                    </div>
                )}

                <Card.Text>{post.content}</Card.Text>

                <Row className="align-items-center mt-3">
                    <Col xs="auto">
                        <Button size="sm" variant="outline-success" className="me-1">
                            ▲ {post.upvotes ?? 0}
                        </Button>
                        <Button size="sm" variant="outline-danger">
                            ▼
                        </Button>
                    </Col>
                    <Col>
                        <Badge bg="secondary">{post.comments ?? 0} Kommentarer</Badge>
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
