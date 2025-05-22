import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';

const CreateCommunityPage = () => {
    // Sparar formulärdata + eventuella errors
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => { // När användaren skickar in formuläret
        e.preventDefault();
        setError('');

        const token = localStorage.getItem('token');
        if (!token) { // Hämtar token för att autentisera
            setError('Du måste vara inloggad för att skapa ett community.');
            return;
        }
        // Skickar en standard POST-request till min backend
        const res = await fetch('http://localhost:8080/api/communities/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, description })
        });

        const data = await res.json();

        if (res.ok) {
            navigate('/'); // back to homepage ifall skapande lyckades annars error
        } else {
            setError(data.message || 'Något gick fel');
        }
    };

    return (
        <Container className="mt-5 d-flex justify-content-center">
            <Card style={{ width: '100%', maxWidth: '600px' }} className="shadow-sm p-4">
                <h3 className="mb-4 text-center">📢 Skapa ett nytt community</h3>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Community-namn</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="t.ex. programmering, gaming, mat"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Beskrivning (valfritt)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Vad handlar ditt community om?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>

                    <div className="d-grid">
                        <Button type="submit" variant="primary" size="lg">
                            Skapa Community
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};

export default CreateCommunityPage;
