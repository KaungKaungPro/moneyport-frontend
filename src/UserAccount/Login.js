import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import RouteNav from "../components/RouteNav";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [userLoginInfo, setUserLoginInfo] = useState({
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const from = location.state?.from || "/";

  const routeToCreateAccount = () => {
    navigate("/createAccount");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserLoginInfo(prev => ({ ...prev, [name]: value }));
  };

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");

    if (!userLoginInfo.username || !userLoginInfo.password) {
      setLoginError("Please enter both username and password.");
      return;
    }

    try {
      const loginSuccess = await login(
        userLoginInfo.username,
        userLoginInfo.password
      );
      if (loginSuccess) {
        navigate(from, { replace: true });
      } else {
        setLoginError("Invalid username or password. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An error occurred during login. Please try again later.");
    }
  }

  return (

      <div className="d-flex flex-column min-vh-100">
        <RouteNav />
        <div className="flex-grow-1 d-flex align-items-center bg-light">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <form onSubmit={handleLogin}>
                      <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            value={userLoginInfo.username}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your username"
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={userLoginInfo.password}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your password"
                        />
                      </div>
                      {loginError && (
                          <div className="alert alert-danger" role="alert">
                            {loginError}
                          </div>
                      )}
                      <div className="d-flex justify-content-between">
                        <button type="button" className="btn btn-outline-primary" onClick={routeToCreateAccount}>
                          Create Account
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Log in
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

  );
}

export default Login;
