import { assests } from "../../assets/assests";
import "./MenuBar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const MenuBar = () => {
  const { setAuthData, auth } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setAuthData(null, null);
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path)
      ? "nav-link fw-bold text-warning"
      : "nav-link";
  };

  const isAdmin = auth.role === "ROLE_ADMIN";

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-2">
        <Link className="navbar-brand" to="/dashboard">
          <img
            className="logo-image"
            src={assests.logo}
            alt="Logo"
            height="40"
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse p-2" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={isActive("/dashboard")} to="/dashboard">
                Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link className={isActive("/explore")} to="/explore">
                Explore
              </Link>
            </li>

            {isAdmin && (
              <>
                <li className="nav-item">
                  <Link className={isActive("/items")} to="/items">
                    Manage Items
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className={isActive("/category")} to="/category">
                    Manage Categories
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className={isActive("/users")} to="/users">
                    Manage Users
                  </Link>
                </li>
              </>
            )}

            <li className="nav-item">
              <Link className={isActive("/orders")} to="/orders">
                Order History
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
            <li className="nav-item dropdown">
              <a
                href="#"
                className="nav-link dropdown-toggle"
                id="navBarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={assests.profile}
                  alt="Profile"
                  height={32}
                  width={32}
                  className="rounded rounded-circle"
                />
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="navBarDropdown"
              >
                <li>
                  <a className="dropdown-item" href="#">
                    Activity Log
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Settings
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#" onClick={logout}>
                    Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default MenuBar;
