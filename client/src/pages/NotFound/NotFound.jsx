import "./NotFound.css";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-message">
          The page you are looking for does not exist.
        </p>
        <button className="not-found-button" onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
