import { useState, useEffect } from "react";

const ADMIN_REMEMBER_KEY = "admin_remembered";

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const remembered = localStorage.getItem(ADMIN_REMEMBER_KEY);
    if (remembered === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (inputPassword: string): boolean => {
    if (inputPassword === "dorsa") {
      setIsAuthenticated(true);
      if (rememberMe) {
        localStorage.setItem(ADMIN_REMEMBER_KEY, "true");
      }
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    localStorage.removeItem(ADMIN_REMEMBER_KEY);
  };

  return {
    isAuthenticated,
    isLoading,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    handleLogin,
    handleLogout,
  };
}
