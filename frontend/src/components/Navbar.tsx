import { Navbar, Nav, Container, Form, FormControl, Button, Image, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import profileImg from '../assets/profilbild.png';
import forosLogo from "../assets/Foros.png";
import { FaUserFriends } from "react-icons/fa";

const Navigation = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profilePic, setProfilePic] = useState<string>(profileImg);
    const [requestCount, setRequestCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
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

        checkAuth();
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    useEffect(() => {
        const fetchRequests = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch("http://localhost:8080/api/friends/requests", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (res.ok) setRequestCount(data.length || 0);
        };

        fetchRequests();
        const interval = setInterval(fetchRequests, 10000); // Uppdatera var 10:e sekund
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
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

                {/* Sökfält */}
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

                {/* Höger sektion */}
                <div className="d-flex align-items-center">
                    {isLoggedIn && (
                        <>
                            {/* Vänförfrågan ikon */}
                            <Nav.Link as={Link} to="/friend-requests" className="me-3 text-white position-relative">
                                <FaUserFriends size={20} />
                                {requestCount > 0 && (
                                    <span
                                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                        style={{ fontSize: "0.7rem" }}
                                    >
                                        {requestCount}
                                    </span>
                                )}
                            </Nav.Link>

                            {/* Profil dropdown */}
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
                        </>
                    )}
                </div>
            </Container>
        </Navbar>
    );
};

export default Navigation;
