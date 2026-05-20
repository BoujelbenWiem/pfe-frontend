import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAccount } from "@/services/profile.service";
import { useAuth } from "@/hooks/useAuth";

export default function DangerZone() {
  const router = useRouter();
  const { logout } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      await logout();
      router.push("/login");
    } catch {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-800 p-6">
      <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
        Danger Zone
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Once you delete your account, there is no going back.
      </p>
      {!showDeleteConfirm ? (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-6 py-2 border border-red-500 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >
          Delete Account
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">
            Are you sure? This action is irreversible.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Yes, delete my account"}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
