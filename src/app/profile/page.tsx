"use client";


import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ChangePasswordSection from "@/components/profile/ChangePasswordSection";
import DangerZone from "@/components/profile/DangerZone";
import { useLanguage } from "@/context/language/useLanguage";
export default function ProfilePage() {
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("profile.title")}</h1>
        <ProfileInfo user={user} />
        <ChangePasswordSection />
        <DangerZone />
      </div>
    </ProtectedRoute>
  );
}
