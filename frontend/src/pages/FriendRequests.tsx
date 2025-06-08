import { useEffect, useState } from "react";
import { Button, Card, Spinner, Alert } from "react-bootstrap";

interface FriendRequest {
    id: number;
    from_user: string;
}

const FriendRequests = () => {
    const [requests, setRequests] = useState<FriendRequest[]>([]); // Lista över vänförfrågningar
    const [message, setMessage] = useState<string | null>(null); // Meddelande att visa användaren
    const [loading, setLoading] = useState(true); // Laddningsstatus

    const token = localStorage.getItem("token");

    const fetchRequests = async () => {
        if (!token) return;

        try {
            setLoading(true);
            const res = await fetch("http://localhost:8080/api/friends/requests", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setRequests(data);
        } catch (error) {
            setMessage("Kunde inte hämta vänförfrågningar.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const respond = async (id: number, action: "accept" | "reject") => { // Skickar svar på vänförfrågan
        try {
            const res = await fetch(`http://localhost:8080/api/friends/requests/${id}/respond`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ action }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setRequests((prev) => prev.filter((r) => r.id !== id)); // Ta bort förfrågan från listan
            } else {
                setMessage(data.message || "Något gick fel.");
            }
        } catch (err) {
            setMessage("Något gick fel vid svar.");
        }
    };

    return (
        <div className="container mt-4">
            <h4 className="mb-3">🔔 Inkommande vänförfrågningar</h4>

            {message && <Alert variant="info">{message}</Alert>}
            {loading && <Spinner animation="border" variant="primary" />}

            {!loading && requests.length === 0 && (
                <p className="text-muted">Du har inga nya vänförfrågningar just nu.</p>
            )}

            {requests.map((req) => (
                <Card key={req.id} className="mb-3 shadow-sm">
                    <Card.Body className="d-flex justify-content-between align-items-center">
                        <div>{req.from_user} vill bli vän</div>
                        <div>
                            <Button
                                variant="success"
                                size="sm"
                                className="me-2"
                                onClick={() => respond(req.id, "accept")}
                            >
                                ✔ Acceptera
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => respond(req.id, "reject")}
                            >
                                ✖ Neka
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export default FriendRequests;
