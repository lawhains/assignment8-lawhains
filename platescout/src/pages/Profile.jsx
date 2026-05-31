import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


// Assignment 6 â€” Profile route (REFERENCE / FINISHED).
// This file is provided complete. Use it to see how a session-aware
// page reads the saved user out of localStorage and how Logout cleans up.
// You only need to register the /profile route in src/App.jsx.
function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("User");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      await fetch(`${baseUrl}/api/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Logout request failed:", err);
    }
    localStorage.removeItem("User");
    localStorage.removeItem("token");
    toast.success("Logged out successfully.");
    navigate("/");
  };

  if (!user) return null;

  return (
    <main className="Profile">
      <h2>Profile</h2>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </main>
  );
}

export default Profile;