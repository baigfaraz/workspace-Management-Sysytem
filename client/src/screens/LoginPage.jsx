import {
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Stack,
  Text,
  TextField
} from "@fluentui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { user, login } = useAuth();
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
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      const user = await login(email, password);
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      styles={{ root: { minHeight: "100vh", backgroundColor: "#f3f2f1" } }}
    >
      <Stack
        tokens={{ childrenGap: 20 }}
        styles={{
          root: {
            width: 400,
            padding: 20,
            backgroundColor: "white",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Text
          variant="xxLarge"
          styles={{ root: { textAlign: "center", fontWeight: "bold" } }}
        >
          Login
        </Text>

        <form onSubmit={handleLogin}>
          <Stack tokens={{ childrenGap: 15 }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e, newValue) => setEmail(newValue)}
              required
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e, newValue) => setPassword(newValue)}
              required
              canRevealPassword
              revealPasswordAriaLabel="Show password"
              onRenderPassword={null}
            />

            {error && (
              <MessageBar
                messageBarType={MessageBarType.error}
                isMultiline={false}
                dismissButtonAriaLabel="Close"
              >
                {error}
              </MessageBar>
            )}
          </Stack>

          <Stack
            horizontalAlign="center"
            tokens={{ childrenGap: 15, padding: 10 }}
          >
            <PrimaryButton type="submit" text="Login" />
          </Stack>
        </form>

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#605e5c" }}>
            Don't have an account?{" "}
            <span
              style={{
                color: "#0078d4",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </div>
      </Stack>
    </Stack>
  );
};

export default LoginPage;
