import { useEffect, useState } from "react";
import type { User } from "../types/types";

const ProfilePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [description, setDescription] = useState("");
    const [picture, setPicture] = useState("");
    const [darkMode, setDarkMode] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Ingen token hittades");
                return;
            }

            try {
                const res = await fetch("http://localhost:8080/api/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                if (res.ok) {
                    setUser(data);
                    localStorage.setItem("profile_picture", data.profile_picture || ""); // Sparar profilbilden i localStorage
                } else {
                    console.error("Fel vid hämtning:", data.message);
                }
            } catch (err) {
                console.error("Kunde inte ladda användarinformation.", err);
            }
        };

        fetchUser();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token"); // Hämtar token från localStorage
        if (!token) return;

        try {
            const res = await fetch("http://localhost:8080/api/users/update-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    profile_description: description,
                    profile_picture: picture,
                    dark_mode: darkMode,
                }),
            });

            if (res.ok) {
                setMessage("Profilen uppdaterades!");
            } else {
                const data = await res.json();
                setError(data.message || "Något gick fel.");
            }
        } catch (err) {
            console.error(err);
            setError("Kunde inte uppdatera profilen.");
        }
    };

    if (error) return <p className="text-danger">{error}</p>;
    if (!user) return <p>Laddar...</p>;

    return (
        <div className="container mt-4">
            <h2>Min profil</h2>

            {message && <p className="text-success">{message}</p>}

            <div className="card mt-3">
                <div className="card-body">
                    {user.profile_picture && (
                        <img
                            src={user.profile_picture}
                            alt="Profilbild"
                            className="img-thumbnail mb-3"
                            style={{ maxWidth: "150px" }}
                        />
                    )}
                    <h5 className="card-title">{user.username}</h5>
                    <p className="card-text">📧 {user.email}</p>
                    {user.profile_description && (
                        <p className="card-text">📝 {user.profile_description}</p>
                    )}
                    <p className="card-text">
                        🌙 Dark mode: {user.dark_mode ? "På" : "Av"}
                    </p>
                </div>
            </div>

            <form className="mt-4" onSubmit={handleUpdate}>
                <div className="mb-3">
                    <label className="form-label">Profilbeskrivning</label>
                    <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Profilbild (URL)</label>
                    <input
                        className="form-control"
                        type="text"
                        value={picture}
                        onChange={(e) => setPicture(e.target.value)}
                    />
                </div>

                <div className="form-check mb-3">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="darkMode"
                        checked={darkMode}
                        onChange={(e) => setDarkMode(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="darkMode">
                        Aktivera dark mode
                    </label>
                </div>

                <button className="btn btn-primary" type="submit">
                    Uppdatera profil
                </button>
            </form>
        </div>
    );
};

export default ProfilePage;
