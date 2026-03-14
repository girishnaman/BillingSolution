import toast from "react-hot-toast";
import "./Login.css";
import { useContext, useState } from "react";
import { login } from "../../Service/AuthService";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const Login = () => {
  const {setAuthData} = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(data);
      if (response.status === 200) {
        toast.success("Login successful");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        setAuthData(response.data.token, response.data.role);
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Error during login: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light d-flex align-items-center justify-content-center vh-100 login-background">
      <div className="card shadow-lg w-100" style={{ maxWidth: "480px" }}>
        <div className="card-body">
          <div className="text-center">
            <h1 className="card-title">Sign in</h1>
            <p className="card-text text-muted">Sign in to your account</p>
          </div>
          <div className="mt-4">
            <form onSubmit={onSubmitHandler}>
              <div className="mb-4">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter your email"
                  onChange={onChangeHandler}
                  value={data.email}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter your password"
                  value={data.password}
                  onChange={onChangeHandler}
                />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-dark btn-lg" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
