import { Card, Button, Badge } from "react-bootstrap"

interface PostCardProps {
    title: string
    body: string
    community: string
    username: string
    upvotes: number
    comments: number
}

const PostCard = ({ title, body, community, username, upvotes, comments }: PostCardProps) => {
    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Subtitle>
                    r/{community} • postat av {username}
                </Card.Subtitle>
                <Card.Text>{body}</Card.Text>
                <div>
                    <Button size="sm" variant="outline-success" className="me-1">
                        ▲ {upvotes}
                    </Button>
                    <Button size="sm" variant="outline-danger">
                        ▼
                    </Button>
                </div>
                <div>
                    <Badge bg="secondary">{comments} kommentarer</Badge>
                </div>
            </Card.Body>
        </Card>
    )
}

export default PostCard