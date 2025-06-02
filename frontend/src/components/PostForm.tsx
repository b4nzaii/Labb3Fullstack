import { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import type { Post } from "../types/types";
import { Toast, ToastContainer } from "react-bootstrap";
interface Props {
    communityId: number;
    onPostCreated: (newPost: Post) => void;
}

interface Community {
    id: number;
    name: string;
    description?: string;
}

const PostForm = ({ communityId, onPostCreated }: Props) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [communities, setCommunities] = useState<Community[]>([]);
    const [showToast, setShowToast] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8080/api/communities")
            .then((res) => res.json())
            .then((data) => setCommunities(data))
            .catch((err) => console.error("Kunde inte hämta communities", err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const token = localStorage.getItem("token"); // Hämtar token från localStorage
        if (!token) {
            setError("Du måste vara inloggad.");
            return;
        }

        const formData = new FormData(); // Skapar formData för att skicka filen
        formData.append("title", title);
        formData.append("content", content);
        formData.append("community_id", String(communityId));
        if (image) {
            formData.append("preview_image", image);
        }

        try {
            const res = await fetch("http://localhost:8080/api/posts/create", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`, // Token för autentisering
                },
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                onPostCreated(data);
                setTitle("");
                setContent("");
                setImage(null);
                setShowToast(true)

                const community = communities.find(
                    (c: Community) => c.id === Number(communityId) // Använder communityId från props
                );
                if (community) {
                    navigate(`/c/${community.name}`);
                }
            } else {
                setError(data.message || "Kunde inte skapa inlägg.");
            }
        } catch (err) {
            console.error("Nätverksfel:", err);
            setError("Något gick fel.");
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="mb-4">
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group controlId="title" className="mb-3">
                <Form.Label>Titel</Form.Label>
                <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group controlId="content" className="mb-3">
                <Form.Label>Inlägg</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="image" className="mb-3">
                <Form.Label>Valfri bild (preview)</Form.Label>
                <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const target = e.target as HTMLInputElement; // Typar om target för att få tillgång till files
                        const file = target.files?.[0];
                        if (file) setImage(file); // Sätter bilden om det finns
                    }}
                />
            </Form.Group>

            <Button type="submit" variant="primary">
                Skapa inlägg
            </Button>
            <ToastContainer position="top-center" className="p-3">
                <Toast bg="success" onClose={() => setShowToast(false)} show={showToast} delay={2500} autohide>
                    <Toast.Body className="text-white">✅ Inlägg skapat!</Toast.Body>
                </Toast>
            </ToastContainer>
        </Form>
    );
};

export default PostForm;
