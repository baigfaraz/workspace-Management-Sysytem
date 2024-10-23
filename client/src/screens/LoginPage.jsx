import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Stack,
  Text,
  TextField,
  PrimaryButton,
  DefaultButton,
  MessageBar,
  MessageBarType,
  Checkbox,
  Link,
  Icon,
  ProgressIndicator,
  initializeIcons
} from "@fluentui/react";
import { mergeStyles } from '@fluentui/merge-styles';

// Initialize Fluent UI icons
initializeIcons();

// Merge Fluent UI styles with Tailwind classes
const containerClass = mergeStyles('min-h-screen bg-gray-100 flex items-center justify-center px-4');
const formContainerClass = mergeStyles('bg-white p-8 rounded-lg shadow-md w-full max-w-md');

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin-dashboard" : "/home");
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

    setIsLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === "admin" ? "/admin-dashboard" : "/home");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={containerClass}>
      <Stack className={formContainerClass}>
        <Text variant="xxLarge" className="text-center font-bold mb-6">Login</Text>

        <form onSubmit={handleLogin}>
          <Stack tokens={{ childrenGap: 15 }}>
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
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e, newValue) => setPassword(newValue)}
              required
              canRevealPassword
              revealPasswordAriaLabel="Show password"
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

            <PrimaryButton 
              type="submit" 
              text={isLoading ? "Logging in..." : "Login"} 
              disabled={isLoading}
              className="w-full"
            />
          </Stack>
        </form>


        <Text className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link onClick={() => navigate("/register")} className="text-blue-600 hover:underline">
            Register
          </Link>
        </Text>
      </Stack>
    </div>
  );
};

export default LoginPage;