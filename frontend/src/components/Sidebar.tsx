import { ListGroup, Button, Collapse, Card } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Community {
    id: number;
    name: string;
    description: string;
}

interface UserStats { // AnvändarStatistik
    post_count: number;
    comment_count: number;
    upvote_count: number;
}

const Sidebar = () => {
    const [open, setOpen] = useState(true); // Hanterar om sidomenyn är öppen eller stängd
    const [communities, setCommunities] = useState<Community[]>([]); // Lista över communities
    const [stats, setStats] = useState<UserStats | null>(null);

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/communities'); //Hämtar communities
                const data = await res.json();
                setCommunities(data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchUserStats = async () => { // Hämtar användarstatistik
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch('http://localhost:8080/api/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setStats({
                        post_count: data.post_count ?? 0,
                        comment_count: data.comment_count ?? 0,
                        upvote_count: data.upvote_count ?? 0
                    });
                }
            } catch (err) {
                console.error('Kunde inte hämta statistik:', err);
            }
        };

        fetchCommunities();
        fetchUserStats();
    }, []);

    return (
        <>
            <Card className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <strong>Communities</strong>
                    <Button variant="outline-light"
                        size="sm"
                        onClick={() => setOpen(!open)}
                        aria-controls="sidebar-list"
                        aria-expanded={open}
                    >
                        {open ? '-' : '+'}
                    </Button>
                </Card.Header>
                <Collapse in={open}>
                    <ListGroup variant="flush" id="sidebar-list">
                        <ListGroup.Item action as={Link} to="/create-community">
                            ➕ Skapa Community
                        </ListGroup.Item>
                        {communities.map((c) => (
                            <ListGroup.Item key={c.id} action as={Link} to={`/c/${c.name}`}>
                                r/{c.name}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Collapse>
            </Card>

            {stats && (
                <Card className="mb-4">
                    <Card.Header>
                        <strong>📊 Din statistik</strong>
                    </Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item>📝 Inlägg: {stats.post_count}</ListGroup.Item>
                        <ListGroup.Item>💬 Kommentarer: {stats.comment_count}</ListGroup.Item>
                        <ListGroup.Item>👍 Upvotes: {stats.upvote_count}</ListGroup.Item>
                    </ListGroup>
                </Card>
            )}
            {/* Footer links */}
            <div className="mt-auto px-3 pb-3">

                <Link to="#" style={{ fontSize: '1.2rem', display: 'block' }}>
                    🛟 <strong>Hjälp</strong>
                </Link>

            </div>

        </>
    );
};

export default Sidebar;

///