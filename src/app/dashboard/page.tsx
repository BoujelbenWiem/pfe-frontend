"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import UserStats from "@/components/admin/UserStats";
import UsersList from "@/components/admin/UsersList";
import CreateUserModal from "@/components/admin/CreateUserModal";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/context/language/useLanguage";

export default function DashboardPage() {
  const {t}=useLanguage();
  const { user, loading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleUserCreated = () => {
    // Trigger refresh of users list
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("dashboard.title")}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {t("dashboard.welcome")}, {user?.username}
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <span>{t("dashboard.createUser")}</span>
          </Button>
        </div>

        {/* Stats */}
        <UserStats />

        {/* Users Table */}
        <UsersList key={refreshKey} />

        {/* Create User Modal */}
        <CreateUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleUserCreated}
        />
      </div>
    </ProtectedRoute>
  );
}