import { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

const LoginPage = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ identifier, password }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                if (data.profile_picture) {
                    localStorage.setItem("profile_picture", data.profile_picture);
                }
                if (data.dark_mode !== undefined) {
                    localStorage.setItem("dark_mode", data.dark_mode ? "true" : "false");
                    document.body.classList.toggle("dark-mode", data.dark_mode);
                }
                window.location.href = "/";
            } else {
                setError(data.message || "Inloggning misslyckades.");
            }
        } catch (err) {
            console.error("Inloggningsfel:", err);
            setError("Nätverksfel vid inloggning.");
        }
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #a2cefa, #9bace9)",
            }}
        >
            <Container className="px-3">
                <Card style={{ maxWidth: "500px", margin: "0 auto" }} className="shadow-sm p-4">
                    <h3 className="mb-4 text-center">🔐 Logga in</h3>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Label>Användarnamn eller e-post</Form.Label>
                            <Form.Control
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Lösenord</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <div className="d-grid">
                            <Button type="submit" variant="primary" size="lg">
                                Logga in
                            </Button>
                        </div>

                        <Form.Text className="text-muted text-center d-block mt-3">
                            Inget konto? <Link to="/register">Registrera dig</Link>
                        </Form.Text>
                    </Form>
                </Card>
            </Container>
        </div>
    );
};

export default LoginPage;
