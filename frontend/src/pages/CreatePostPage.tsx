import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Community {
    id: number;
    name: string;
    description: string;
}

interface Post {
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

const CreatePostPage = ({ onPostCreated }: Props) => { // Komponent för att skapa nytt inlägg med props 
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [communityId, setCommunityId] = useState("");
    const [communities, setCommunities] = useState<Community[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
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

        const token = localStorage.getItem("token"); // Hämtar token från localStorage..
        if (!token) {
            setError("Du måste vara inloggad för att skapa ett inlägg.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("community_id", communityId);
        if (imageFile) {
            formData.append("preview_image", imageFile); // måste matcha multer
        }

        try {
            const res = await fetch("http://localhost:8080/api/posts/create", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                if (onPostCreated) onPostCreated(data);
                navigate("/c/" + communityId);
            } else {
                setError(data.message || "Kunde inte skapa inlägget.");
            }
        } catch (err) {
            setError("Något gick fel.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <h3 className="mb-4 text-center">📝 Skapa ett nytt inlägg</h3>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                            <label htmlFor="postImage" className="form-label">Förhandsbild (valfritt)</label>
                            <input
                                type="file"
                                className="form-control"
                                id="postImage"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
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
