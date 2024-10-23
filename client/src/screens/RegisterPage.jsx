import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Stack,
  Text,
  TextField,
  PrimaryButton,
  MessageBar,
  MessageBarType,
  initializeIcons,
} from "@fluentui/react";
import { mergeStyles } from "@fluentui/merge-styles";

initializeIcons();

const containerClass = mergeStyles(
  "min-h-screen bg-gray-100 flex items-center justify-center px-4"
);
const formContainerClass = mergeStyles(
  "bg-white p-8 rounded-lg shadow-md w-full max-w-md"
);

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { user, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin-dashboard" : "/home");
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
      navigate(user.role === "admin" ? "/admin-dashboard" : "/home");
    } catch (error) {
      setError(error.message); // Set error message
    }
  };

  return (
    <div className={containerClass}>
      <Stack className={formContainerClass}>
        <Text variant="xxLarge" className="text-center font-bold mb-6">
          Register
        </Text>

        <form onSubmit={handleRegister}>
          <Stack tokens={{ childrenGap: 15 }}>
            <TextField
              label="Username"
              value={username}
              onChange={(e, newValue) => setUsername(newValue)}
              required
              className="w-full"
              placeholder="Enter your username"
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e, newValue) => setEmail(newValue)}
              required
              className="w-full"
              placeholder="Enter your email"
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e, newValue) => setPassword(newValue)}
              required
              className="w-full"
              placeholder="Enter your password"
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

            <PrimaryButton type="submit" text="Register" className="w-full" />
          </Stack>
        </form>

        <Text className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </Text>
      </Stack>
    </div>
  );
};

export default RegisterPage;
