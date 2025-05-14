import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'


const Navigation = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Forum</Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" /> {/* (hamburgermeny) för mindre skärmar */}

                <Navbar.Collapse id="basic-navbar-nav"> {/* collapse bar, visas bredvid sido namn eller under på mobil */}
                    <Nav className="me-auto">
                        {/* Länkarna */}
                        <Nav.Link as={Link} to="/">Hem</Nav.Link>
                        <Nav.Link as={Link} to="/login">Logga in</Nav.Link>
                        <Nav.Link as={Link} to="/register">Registrera</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navigation
