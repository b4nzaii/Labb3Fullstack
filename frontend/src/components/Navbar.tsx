import { Navbar, Nav, Container, Form, FormControl, Button, Image, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import profileImg from '../assets/profilbild.png';
import forosLogo from "../assets/Foros.png"

const Navigation = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profilePic, setProfilePic] = useState<string>(profileImg); // default fallback
    const navigate = useNavigate();

    useEffect(() => {
        const checkTokenAndProfile = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);

            const storedPic = localStorage.getItem("profile_picture");
            if (storedPic) {
                const fullUrl = storedPic.startsWith("http")
                    ? storedPic
                    : `http://localhost:8080${storedPic}`;
                setProfilePic(fullUrl);
            } else {
                setProfilePic(profileImg);
            }
        };

        checkTokenAndProfile(); // kör direkt
        window.addEventListener('storage', checkTokenAndProfile); // vid ändringar
        return () => window.removeEventListener('storage', checkTokenAndProfile); // clean-up
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('profile_picture');
        localStorage.removeItem('dark_mode');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="py-2 shadow-sm" sticky="top">
            <Container fluid className="px-4 d-flex justify-content-between align-items-center">

                <div className="d-flex align-items-center">
                    <Navbar.Brand as={Link} to="/" className="me-4 d-flex align-items-center">
                        <img
                            src={forosLogo}
                            alt="Foros"
                            style={{
                                height: "39px",
                                objectFit: "cover",
                                borderRadius: "40%",
                                width: "80px",
                            }}
                        />
                    </Navbar.Brand>


                    <Nav className="d-none d-lg-flex">
                        <Nav.Link as={Link} to="/">Hem</Nav.Link>
                        {!isLoggedIn && <Nav.Link as={Link} to="/login">Logga in</Nav.Link>}
                    </Nav>
                </div>

                {/* Mitten */}
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

                {/* Höger */}
                <div className="d-flex align-items-center">
                    {isLoggedIn && (
                        <Dropdown align="end">
                            <Dropdown.Toggle variant="link" className="p-0 border-0">
                                <Image
                                    src={profilePic}
                                    alt="Profil"
                                    roundedCircle
                                    style={{
                                        width: '38px',
                                        height: '38px',
                                        objectFit: 'cover',
                                        backgroundColor: 'transparent'
                                    }}
                                    onError={(e) => {
                                        e.currentTarget.src = profileImg;
                                    }}
                                />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to="/profile">Inställningar</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={handleLogout}>Logga ut</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                </div>
            </Container>
        </Navbar>
    );
};

export default Navigation;
