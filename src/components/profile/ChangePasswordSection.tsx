import React, { useState } from "react";
import { changePassword } from "@/services/profile.service";
import { useLanguage } from "@/context/language/useLanguage";

interface ChangePasswordProps {}

export default function ChangePasswordSection({}: ChangePasswordProps) {
  const { t } = useLanguage();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage("");
    if (newPassword !== confirmPassword) {
      setPasswordMessage(t("profile.changePassword.passwordMismatch"));
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMessage(t("profile.changePassword.passwordTooShort"));
      return;
    }
    setPasswordSaving(true);
    try {
      const res = await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      setPasswordMessage(res.message || t("profile.changePassword.success"));
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setPasswordMessage(t("profile.changePassword.failed"));
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {t("profile.changePassword.title")}
      </h2>
      <form onSubmit={handleChangePassword} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("profile.changePassword.currentPassword")}
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("profile.changePassword.newPassword")}
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            required
            minLength={8}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("profile.changePassword.confirmPassword")}
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            required
            minLength={8}
          />
        </div>
        {passwordMessage && (
          <p className={`text-sm ${passwordMessage.toLowerCase().includes("success") ? "text-green-600" : "text-red-500"}`}>
            {passwordMessage}
          </p>
        )}
        <button
          type="submit"
          disabled={passwordSaving}
          className="bg-primary text-white rounded-xl px-3 py-1.5 text-sm font-medium hover:bg-primary-hover disabled:opacity-40 transition"
        >
          {passwordSaving ? t("profile.changePassword.changing") : t("profile.changePassword.button")}
        </button>
      </form>
    </section>
  );
}
