import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { TextField, PrimaryButton, MessageBar, MessageBarType } from "@fluentui/react";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { user, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/home");
      }
    }
  }, [user, navigate]);

  const validateForm = () => {
    if (!email.trim() || !password.trim() || !username.trim()) {
      setError("All fields are required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {  
      setError("Invalid email format");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    if (!validateForm()) return;

    try {
      const user = await register(username, email, password, "standard");

      // Navigate based on the user's role
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      setError(error.message); // Set error message
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f3f2f1" }}>
      <div style={{ width: "100%", maxWidth: 400, backgroundColor: "#fff", padding: 24, borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <h2 style={{ textAlign: "center", fontSize: "24px", marginBottom: "24px", fontWeight: "bold" }}>Register</h2>
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: 16 }}>
            <TextField
              label="Username"
              value={username}
              onChange={(e, newValue) => setUsername(newValue)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e, newValue) => setEmail(newValue)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e, newValue) => setPassword(newValue)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && (
            <MessageBar messageBarType={MessageBarType.error} isMultiline={false} style={{ marginBottom: 16 }}>
              {error}
            </MessageBar>
          )}
          <PrimaryButton type="submit" text="Register" style={{ width: "100%", marginTop: 16 }} />
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <p style={{ fontSize: "14px", color: "#605e5c" }}>
              Already have an account?{" "}
              <span
                style={{ color: "#0078d4", cursor: "pointer", textDecoration: "underline" }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
