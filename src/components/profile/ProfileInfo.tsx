import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { updateProfile } from "@/services/profile.service";

interface ProfileInfoProps {
  user: any;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage("");
    try {
      await updateProfile({ username, email });
      setProfileMessage("Profile updated successfully");
    } catch {
      setProfileMessage("Failed to update profile");
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Profile Information
      </h2>
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Role
          </label>
          <input
            type="text"
            value={user?.role || ""}
            disabled
            className="w-full border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          />
        </div>
        {profileMessage && (
          <p className={`text-sm ${profileMessage.includes("success") ? "text-green-600" : "text-red-500"}`}>
            {profileMessage}
          </p>
        )}
        <button
          type="submit"
          disabled={profileSaving}
          className="bg-blue-600 text-white rounded-xl px-3 py-1.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-40 transition"
        >
          {profileSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}
