import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import type { Post } from "../types/types";

interface Props {
    communityId: number;
    onPostCreated: (newPost: Post) => void;
}

const PostForm = ({ communityId, onPostCreated }: Props) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [link, setLink] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
            setError("Du måste vara inloggad.");
            return;
        }

        try {
            console.log("Skickar inlägg med:", {
                title,
                content,
                link,
                communityId,
            });
            if (!communityId || communityId <= 0) {
                setError("Ogiltigt community");
                return;
            }
            const res = await fetch("http://localhost:8080/api/posts/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content, link, communityId }),
            });

            const data = await res.json();

            if (res.ok) {
                onPostCreated(data);
                setTitle("");
                setContent("");
                setLink("");
                navigate(`/c/${communityId}`);
            } else {
                console.error("Fel från server:", data.message);
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
            <Form.Group controlId="link" className="mb-3">
                <Form.Label>Länk (valfritt)</Form.Label>
                <Form.Control
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
            </Form.Group>
            <Button type="submit" variant="primary">
                Skapa inlägg
            </Button>
        </Form>
    );
};

export default PostForm;
