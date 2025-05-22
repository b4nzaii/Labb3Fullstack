import { ListGroup, Button, Collapse, Card } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
interface Community {
    id: number;
    name: string;
    description: string;
}
const Sidebar = () => {
    const [open, setOpen] = useState(true)
    const [communities, setCommunities] = useState<Community[]>([])
    useEffect(() => {

        const fetchCommunities = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/communities')
                const data = await res.json();
                setCommunities(data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchCommunities()
    }, [])

    return (
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
    )
}
export default Sidebar