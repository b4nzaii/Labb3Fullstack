import { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

const RegisterPage = () => {
    // Form states
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    // När användarenn skickar formuläret ⬇️
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // fetch
        const res = await fetch("http://localhost:8080/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        })
        const data = await res.json()

        if (res.ok) {
            // om registrering lyckas så sparar vi token och navigerar tillbaks
            localStorage.setItem("token", data.token)
            window.location.href = '/';
        } else {
            setError(data.message || "Registrering misslyckades")
        }
    }

    return (
        <Container className="mt-5 d-flex justify-content-center px-3">
            <Card style={{ width: "100%", maxWidth: "500px" }} className="shadow-sm p-4">
                <h3 className="mb-4 text-center">👤 Skapa konto</h3>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleRegister}>
                    <Form.Group className="mb-3">
                        <Form.Label>Användarnamn</Form.Label>
                        <Form.Control
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Ditt användarnamn"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>E-postadress</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="exempel@gmail.com"
                        />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label>Lösenord</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Minst 6 tecken"
                        />
                    </Form.Group>

                    <div className="d-grid mb-3">
                        <Button type="submit" variant="success" size="lg" className="w-100">
                            Registrera konto
                        </Button>
                    </div>
                    <Form.Text className="text-muted text-center d-block">
                        Har du redan ett konto? <Link to="/login">Logga in här</Link>
                    </Form.Text>
                </Form>
            </Card>
        </Container>
    )
}
export default RegisterPage