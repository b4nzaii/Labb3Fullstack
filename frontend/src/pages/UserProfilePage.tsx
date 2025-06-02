import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

interface UserProfile {
    username: string;
    email: string;
    profile_description?: string;
    profile_picture?: string;
    is_friend?: boolean;
}

interface Post {
    id: number;
    title: string;
    content?: string;
    created_at: string;
}

const UserProfilePage = () => {
    // Hämta användarnamn från URL
    const { username } = useParams();

    // States för profil, inlägg och meddelande
    const [user, setUser] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [message, setMessage] = useState("");

    // Hämta användardata från backend
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || !username) return;

        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/users/${username}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();

                if (res.ok) {
                    // Spara användare och deras inlägg
                    setUser({
                        username: data.username,
                        email: "",
                        profile_description: data.profile_description,
                        profile_picture: data.profile_picture,
                    });

                    setPosts(data.posts || []);

                }
            } catch (err) {
                console.error("Fel vid hämtning av användarprofil", err);
            }
        };

        fetchData();
    }, [username]);

    // Funktion för att skicka vänförfrågan
    const sendFriendRequest = async () => {
        const token = localStorage.getItem("token");
        if (!token || !username) return;

        try {
            const res = await fetch(`http://localhost:8080/api/friends/request/${username}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            console.log(data);
            if (res.ok) {
                setMessage("Förfrågan skickad!");
            } else {
                setMessage(data.message || "Något gick fel.");
            }
        } catch (err) {
            console.error("Fel vid skickande av förfrågan", err);
        }
    };

    if (!user) return <p>Laddar...</p>;

    return (
        <div className="container mt-4">
            {/* Profilsektion */}
            <div className="d-flex align-items-center gap-3 mb-4">
                {user.profile_picture && (
                    <img
                        src={`http://localhost:8080${user.profile_picture}`}
                        alt="Profilbild"
                        style={{ width: "250px", height: "200px", borderRadius: "50%", objectFit: "cover" }}
                    />
                )}
                <div>
                    <h4>{user.username}</h4>
                    <p className="text-muted">{user.email}</p>
                    {user.profile_description && <p>{user.profile_description}</p>}

                    {/* Visa knapp om inte redan vän */}
                    {!user.is_friend && (
                        <Button size="sm" onClick={sendFriendRequest}>
                            Lägg till som vän
                        </Button>
                    )}

                    {/* Visa meddelande om vänförfrågan skickats */}
                    {message && <p className="text-success mt-2">{message}</p>}
                </div>
            </div>

            {/* Lista användarens inlägg */}
            <h5>Användarens inlägg</h5>
            {posts.map((post) => (
                <Card key={post.id} className="mb-2">
                    <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text>{post.content}</Card.Text>
                        <small className="text-muted">{new Date(post.created_at).toLocaleString()}</small>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export default UserProfilePage;