import { Link } from "react-router-dom";
import "./LandingPage.css";
import forosImg from "../assets/Foros.png";
import profilImg from "../assets/test.jpg";
import memeImg from "../assets/meme.jpeg";
const LandingPage = () => {
    return (
        <div className="landing-wrapper">
            {/* Text påvänster sida */}
            <div className="text-section text-center text-md-start">
                <h1>Foros, forumet där du<br />kan vara helt öppen om allt</h1>
                <p className="lead text-muted">Dela dina tankar. Följ andra. Bygg communities.</p>
                <div className="d-grid gap-2 mt-4">
                    <Link to="/register" className="btn btn-primary">Skapa konto</Link>
                    <Link to="/login" className="btn btn-outline-secondary">Logga in</Link>
                </div>
            </div>

            {/* Karusell */}
            <div className="carousel-section d-none d-md-block">
                <div id="landingCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="4500">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src={forosImg} className="d-block w-100" alt="Preview 1" />
                        </div>
                        <div className="carousel-item">
                            <img src={memeImg} className="d-block w-100" alt="Preview 2" />
                        </div>
                        <div className="carousel-item">
                            <img src={profilImg} className="d-block w-100" alt="Preview 2" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
