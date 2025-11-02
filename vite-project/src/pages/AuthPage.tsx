// src/pages/AuthPage.tsx
import { useState, useEffect } from "react";

function AuthPage({
  onLoginSuccess,
  error,
  clearError,
}: {
  onLoginSuccess: (u: any) => void;
  error?: string;
  clearError: () => void;
}) {
  const [mode, setMode] = useState<string>("login");
  const [cin, setCin] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    setLocalError(error || "");
  }, [error]);

  const handleModeChange = () => {
    setMode(mode === "login" ? "signup" : "login");
    setLocalError("");
    clearError();
  };

  const handleCinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 8) {
      setCin(val);
    }
    setLocalError("");
    clearError();
  };

  const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setLocalError("");
    clearError();
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setLocalError("");
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cin || !password || (mode === "signup" && !username)) {
      setLocalError("Please fill in all fields.");
      return;
    }
    if (cin.length !== 8) {
      setLocalError("Code (CIN) must be 8 digits.");
      return;
    }
    if (mode === "signup" && password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setLocalError("");
    clearError();

    const url = mode === "login" ? "/api/login" : "/api/signup";
    const payload =
      mode === "login" ? { cin, password } : { username, cin, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        onLoginSuccess(data);
      } else {
        setLocalError(data.error || "An error occurred.");
      }
    } catch (err) {
      setLocalError("Could not connect to the server.");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
        <h1 className="text-5xl text-center mb-6">
          {mode === "login" ? "👋" : "🌱"}
        </h1>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === "signup" && (
            <div className="relative">
              <label
                htmlFor="username"
                className="absolute -top-3 left-4 bg-white px-2 text-2xl"
              >
                👤
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={handleUserChange}
                placeholder="Your Name"
                required
                className="w-full px-5 py-4 text-lg text-gray-700 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          )}

          <div className="relative">
            <label
              htmlFor="cin"
              className="absolute -top-3 left-4 bg-white px-2 text-2xl"
            >
              🔢
            </label>
            <input
              id="cin"
              type="password"
              value={cin}
              onChange={handleCinChange}
              placeholder="8-Digit Code (CIN)"
              required
              pattern="\d{8}"
              title="Must be 8 digits"
              className="w-full px-5 py-4 text-lg text-gray-700 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="absolute -top-3 left-4 bg-white px-2 text-2xl"
            >
              🔒
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePassChange}
              placeholder="Password"
              required
              minLength={6}
              className="w-full px-5 py-4 text-lg text-gray-700 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {localError && (
            <p className="text-red-500 text-center">{localError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? "⏳" : mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleModeChange}
            className="text-gray-600 hover:text-blue-500 text-lg transition"
          >
            {mode === "login" ? (
              <span className="text-lg">
                Need an account? <strong>Sign Up</strong>
              </span>
            ) : (
              <span className="text-lg">
                Already have an account? <strong>Login</strong>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
