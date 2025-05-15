import { ListGroup, Button, Collapse, Card } from 'react-bootstrap'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
    const [open, setOpen] = useState(true)

    // Mockade communities, vid ett senare tillfälle hämtar jag detta från backend
    const communities = [
        { name: "krig", label: "krig" },
        { name: 'politik', label: 'Politik' },
        { name: 'noje', label: 'Nöje' },
        { name: 'mat', label: 'Mat' },
        { name: 'sport', label: 'Sport' },
    ]

    return (
        <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <strong>Communities</strong>
                <Button
                    variant="outline-light"
                    size="sm"
                    onClick={() => setOpen(!open)}
                    aria-controls="sidebar-list"
                    aria-expanded={open}
                >

                </Button>
            </Card.Header>
            <Collapse in={open}>
                <ListGroup variant="flush" id="sidebar-list">
                    <ListGroup.Item action as={Link} to="/create-community">
                        ➕ Skapa Community
                    </ListGroup.Item>
                    {communities.map((c) => (
                        <ListGroup.Item key={c.name} action as={Link} to={`/c/${c.name}`}>
                            r/{c.name} - {c.label}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Collapse>
        </Card>
    )
}
export default Sidebar