import { Navbar, Nav, Container, Form, FormControl, Button, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import profileImg from '../assets/profilbild.png'

const Navigation = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="py-2 shadow-sm" sticky="top">
            <Container fluid className="px-4 d-flex justify-content-between align-items-center">

                {/* Vänster sida Logga & nav */}
                <div className="d-flex align-items-center">
                    <Navbar.Brand as={Link} to="/" className="fw-bold me-4">
                        Forum
                    </Navbar.Brand>

                    <Nav className="d-none d-lg-flex">
                        <Nav.Link as={Link} to="/">Hem</Nav.Link>
                        <Nav.Link as={Link} to="/login">Logga in</Nav.Link>
                        <Nav.Link as={Link} to="/register">Registrera</Nav.Link>
                    </Nav>
                </div>

                {/* Sökruta */}
                <div className="flex-grow-1 d-none d-lg-flex justify-content-center px-3">
                    <Form className="d-flex" style={{ maxWidth: '500px', width: '100%' }}>
                        <FormControl
                            type="search"
                            placeholder="Sök efter community"
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button variant="outline-light" size="sm">Sök</Button>
                    </Form>
                </div>

                {/* Höger sida för ens Profilbild */}
                <div className="d-flex align-items-center">
                    <Nav.Link as={Link} to="/profile" className="p-0">
                        <Image
                            src={profileImg}
                            alt="Profil"
                            roundedCircle
                            style={{ width: '38px', height: '40px', objectFit: 'cover', color: "white" }}
                        />
                    </Nav.Link>
                </div>
            </Container>
        </Navbar>
    )
}

export default Navigation

