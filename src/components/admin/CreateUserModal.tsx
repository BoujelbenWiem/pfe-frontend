"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ROLES, STORES } from "@/lib/validations/auth.schema";
import { createUserAsAdmin } from "@/services/user.service";
import { useLanguage } from "@/context/language/useLanguage";

const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(100, "Maximum 100 characters"),
  email: z.email("Invalid email"),
  role: z.enum(ROLES, { message: "Please select a role" }),
  store_id: z.string().optional(),
  department: z.string().optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateUserModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateUserModalProps) {
  const {t}=useLanguage();
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register: registerField,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: CreateUserFormData) => {
    setServerError("");
    setSuccessMessage("");
    try {
      const response = await createUserAsAdmin(data);
      setSuccessMessage(response.message);
      reset();
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccessMessage("");
      }, 2000);
    } catch (error: any) {
      setServerError(
        error.response?.data?.detail ||
          "Failed to create user. Please try again."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("modal.createUser")}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t("modal.invitationInfo")}
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-green-800 dark:text-green-200 text-sm">
                {successMessage}
              </div>
            )}

            {serverError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-red-800 dark:text-red-200 text-sm">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Username */}
              <Input
                label={t("modal.username")}
                type="text"
                placeholder={t("modal.usernamePlaceholder")}
                {...registerField("username")}
                error={errors.username?.message}
              />

              {/* Email */}
              <Input
                label={t("modal.email")}
                type="email"
                placeholder={t("modal.emailPlaceholder")}
                {...registerField("email")}
                error={errors.email?.message}
              />

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("modal.role")}
                </label>
                <select
                  {...registerField("role")}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                    errors.role
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
                    errors.role
                      ? "focus:ring-red-500"
                      : "focus:ring-blue-500 focus:ring-opacity-20"
                  }`}
                >
                  <option value="">{t("modal.selectRole")}</option>
                  <option value="STORE_MANAGER">{t("dashboard.storeManager")}</option>
                  <option value="MARKETING">{t("dashboard.marketing")}</option>
                  <option value="CRM">{t("dashboard.crm")}</option>
                  <option value="PURCHASES">{t("dashboard.purchases")}</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Store ID - show if role is STORE_MANAGER */}
              {selectedRole === "STORE_MANAGER" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("modal.storeId")}
                  </label>
                  <select
                    {...registerField("store_id")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                  >
                    <option value="">{t("modal.selectStore")}</option>
                    {STORES.map((store) => (
                      <option key={store} value={store}>
                        {store}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Department */}
              <Input
                label={t("modal.department")}
                type="text"
                placeholder={t("modal.departmentPlaceholder")}
                {...registerField("department")}
                error={errors.department?.message}
              />

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {t("modal.cancel")}
                </button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? t("modal.creating") : t("modal.createUser")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
