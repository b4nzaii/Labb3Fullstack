import { useEffect, useState } from "react";
import type { User } from "../types/types";

interface Friend {
    id: number;
    username: string;
    profile_picture?: string;
}

const ProfilePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [darkMode, setDarkMode] = useState(false);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch("http://localhost:8080/api/users/me", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (res.ok) {
                setUser(data);
                setDescription(data.profile_description || "");
                setDarkMode(data.dark_mode || false);

                if (data.profile_picture) {
                    const fullUrl = `http://localhost:8080${data.profile_picture}`;
                    localStorage.setItem("profile_picture", fullUrl);
                }

                localStorage.setItem("dark_mode", data.dark_mode ? "true" : "false");
                document.body.classList.toggle("dark-mode", data.dark_mode);
            } else {
                setError(data.message || "Kunde inte hämta användare.");
            }
        };

        const fetchFriends = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch("http://localhost:8080/api/friends/list", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (res.ok) setFriends(data);
        };

        fetchUser();
        fetchFriends();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) return;

        const formData = new FormData();
        formData.append("profile_description", description);
        formData.append("dark_mode", String(darkMode));
        if (image) formData.append("profile_picture", image);

        try {
            const res = await fetch("http://localhost:8080/api/users/update-profile", {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setMessage("Profilen uppdaterades!");
                localStorage.setItem("dark_mode", darkMode ? "true" : "false");
                document.body.classList.toggle("dark-mode", darkMode);

                if (data.profile_picture) {
                    const fullUrl = `http://localhost:8080${data.profile_picture}`;
                    localStorage.setItem("profile_picture", fullUrl);
                    window.dispatchEvent(new Event("storage"));
                }

                window.location.reload();
            } else {
                setError(data.message || "Uppdatering misslyckades.");
            }
        } catch (err) {
            console.error(err);
            setError("Nätverksfel vid uppdatering.");
        }
    };

    if (!user) return <p>Laddar...</p>;

    return (
        <div className="container mt-4">
            <h2>Min profil</h2>
            {message && <p className="text-success">{message}</p>}
            {error && <p className="text-danger">{error}</p>}

            <div className="card mt-3">
                <div className="card-body">
                    {user.profile_picture && (
                        <img
                            src={`http://localhost:8080${user.profile_picture}`}
                            alt="Profilbild"
                            className="img-thumbnail mb-3"
                            style={{ maxWidth: "150px" }}
                        />
                    )}
                    <h5 className="card-title">{user.username}</h5>
                    <p className="card-text">📧 {user.email}</p>
                    <p className="card-text">📝 {user.profile_description}</p>
                    <p className="card-text">🌙 Dark mode: {user.dark_mode ? "På" : "Av"}</p>
                </div>
            </div>

            <form className="mt-4" onSubmit={handleUpdate}>
                <div className="mb-3">
                    <label className="form-label">Profilbeskrivning</label>
                    <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Ny profilbild</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setImage(file);
                        }}
                    />
                </div>

                <div className="form-check mb-3">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="darkMode"
                        checked={darkMode}
                        onChange={(e) => setDarkMode(e.target.checked)}
                    />
                    <label htmlFor="darkMode" className="form-check-label">
                        Dark mode
                    </label>
                </div>

                <button className="btn btn-primary" type="submit">
                    Uppdatera profil
                </button>
            </form>

            <h4 className="mt-5">Vänner ({friends.length})</h4>
            <ul className="list-group">
                {friends.map((f) => (
                    <li key={f.id} className="list-group-item d-flex align-items-center">
                        {f.profile_picture && (
                            <img
                                src={`http://localhost:8080${f.profile_picture}`}
                                alt="Profil"
                                className="rounded-circle me-2"
                                style={{ width: "40px", height: "40px", objectFit: "cover" }}
                            />
                        )}
                        {f.username}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProfilePage;
