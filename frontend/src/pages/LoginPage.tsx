import { useState } from "react";
import { Link } from "react-router-dom"
import { Container, Form, Button, Alert, Card } from "react-bootstrap"

const LoginPage = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // handler för När användaren trycker på "Logga in"
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // fetch igen till /login backend
        const res = await fetch('http://localhost:8080/api/auth/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ identifier, password })
        })

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("token", data.token); // Sparar token i localStorage
            window.location.href = '/'; // startsidan 
        } else {
            setError(data.message || "Inloggning misslyckades")
        }
    };

    return (
        <Container className="mt-5 d-flex justify-content-center px-3">
            <Card style={{ width: "100%", maxWidth: "500px" }} className="shadow-sm p-4">
                <h3 className="mb-4 text-center">🔐 Logga in</h3>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                        <Form.Label>Användarnamn/e-post</Form.Label>
                        {/*Kontroll här */}
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
                        <Button type="submit" variant="primary" size="lg" className="w-100">
                            Logga in
                        </Button>
                    </div>
                    <Form.Text className="text-muted text-center d-block mt-3">
                        Inget konto? <Link to="/register">Registrera dig</Link>
                    </Form.Text>
                </Form>
            </Card>
        </Container>
    )
}

export default LoginPage;