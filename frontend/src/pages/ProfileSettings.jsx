import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../components/AuthContext"; // поправ під свою структуру
import { useNavigate } from "react-router-dom";

const ProfileSettings = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handlePasswordUpdate = async () => {
    if (!oldPassword || !newPassword) {
      alert("Please fill in both old and new passwords");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/users/update-password",
        { oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to update password. Try again."
      );
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/api/users/delete-account", {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Account deleted");
      logout();
      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to delete account. Try again."
      );
    }
  };

  if (!user) return null;

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 pt-28">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">
        Profile Settings
      </h1>

      <section className="mb-8 space-y-4 text-center">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </section>

      <section className="mb-12 max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-semibold text-center">Change Password</h2>

        <input
          type="password"
          placeholder="Old Password"
          className="w-full border rounded px-4 py-2"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="New Password"
          className="w-full border rounded px-4 py-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={loading}
        />
        <button
          onClick={handlePasswordUpdate}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </section>

      <section className="max-w-md mx-auto text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">
          Delete Account
        </h2>
        <button
          onClick={handleDeleteAccount}
          className={`w-full py-2 rounded border ${
            confirmDelete
              ? "bg-red-700 text-white border-red-700 hover:bg-red-800"
              : "text-red-600 border-red-600 hover:bg-red-100"
          } transition`}
        >
          {confirmDelete ? "Click again to confirm" : "Delete Account"}
        </button>
      </section>
    </main>
  );
};

export default ProfileSettings;
