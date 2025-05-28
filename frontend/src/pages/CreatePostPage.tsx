import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Community {
    id: number;
    name: string;
    description: string;
}

interface Post { // Post-types
    id: number;
    title: string;
    content: string;
    communityId: number;
    userId: number;
    preview_image?: string;
    communityName: string;
}

interface Props {
    onPostCreated?: (newPost: Post) => void;
}

const CreatePostPage = ({ onPostCreated }: Props) => { // Props för att skicka tillbaks det nya inlägget till parent komponenten
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [link, setLink] = useState("");
    const [communityId, setCommunityId] = useState("");
    const [communities, setCommunities] = useState<Community[]>([]);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8080/api/communities")
            .then(res => res.json())
            .then(data => setCommunities(data))
            .catch(err => console.error("Kunde inte hämta communities", err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
            setError("Du måste vara inloggad för att skapa ett inlägg.");
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
            if (onPostCreated) {
                onPostCreated(data); // lägg till i state direkt om parent vill
            }
            navigate("/c/" + communityId); // navigera till community
        } else {
            setError(data.message || "Kunde inte skapa inlägget.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <h3 className="mb-4 text-center">📝 Skapa ett nytt inlägg</h3>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="postTitle" className="form-label">Titel</label>
                            <input
                                type="text"
                                className="form-control"
                                id="postTitle"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="postContent" className="form-label">Innehåll</label>
                            <textarea
                                className="form-control"
                                id="postContent"
                                rows={4}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="postLink" className="form-label">Länk (valfritt)</label>
                            <input
                                type="url"
                                className="form-control"
                                id="postLink"
                                placeholder="https://..."
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="postCommunity" className="form-label">Välj community</label>
                            <select
                                id="postCommunity"
                                className="form-select"
                                value={communityId}
                                onChange={(e) => setCommunityId(e.target.value)}
                                required
                            >
                                <option value="">-- Välj --</option>
                                {communities.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        r/{c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary w-100">
                            Publicera
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePostPage;
