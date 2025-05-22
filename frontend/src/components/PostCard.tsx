import { Card, Button, Badge, Row, Col } from "react-bootstrap";

// Typdefinitioner för postcard props
interface PostCardProps {
    title: string;
    body: string;
    community: string;
    username: string;
    upvotes: number;
    comments: number;
}

const PostCard = ({
    title,
    body,
    community,
    username,
    upvotes,
    comments
}: PostCardProps) => {
    return (
        <Card className="mb-3 shadow-sm">
            <Card.Body>
                {/* Titel och info här*/}
                <Card.Title>{title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    r/{community} • postat av {username}
                </Card.Subtitle>
                {/* Själva inlägget */}
                <Card.Text>{body}</Card.Text>
                {/* Upvote/downvote samt kommentarer*/}
                <Row className="align-items-center">
                    <Col xs="auto">
                        <Button size="sm" variant="outline-success" className="me-1">
                            ▲ {upvotes}
                        </Button>
                        <Button size="sm" variant="outline-danger">▼</Button>
                    </Col>
                    <Col>
                        <Badge bg="secondary">{comments} Kommentarer</Badge>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}
export default PostCard