import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const res = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess("Registreringen lyckades! Du kan nu logga in.");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                setError(data.message || "Registrering misslyckades.");
            }
        } catch (err) {
            console.error("Nätverksfel:", err);
            setError("Nätverksfel vid registrering.");
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
                    <h3 className="mb-4 text-center">📝 Registrera dig</h3>

                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Användarnamn</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ditt användarnamn"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Emailadress</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="exempel@mejl.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Lösenord</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Minst 6 tecken"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <div className="d-grid">
                            <Button variant="primary" size="lg" type="submit">
                                Registrera
                            </Button>
                        </div>
                    </Form>
                </Card>
            </Container>
        </div>
    );
};

export default RegisterPage;
