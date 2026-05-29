"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  setupPasswordSchema,
  SetupPasswordFormData,
} from "@/lib/validations/auth.schema";
import { setupPassword } from "@/services/auth.service";
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";
import { useLanguage } from "@/context/language/useLanguage";

function SetupPasswordContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SetupPasswordFormData>({
    resolver: zodResolver(setupPasswordSchema),
  });

  const onSubmit = async (data: SetupPasswordFormData) => {
    setServerError("");

    if (!token) {
      setServerError("Invalid or missing token");
      return;
    }

    try {
      await setupPassword(token, data.password);
      setIsSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      setServerError(
        error.response?.data?.detail ||
          "Failed to set password. The link may have expired."
      );
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("setupPassword.invalidLink")}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t("setupPassword.invalidDesc")}
            </p>
          </div>
          <Button
            fullWidth
            onClick={() => router.push("/login")}
            className="mt-4"
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("setupPassword.title")}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t("setupPassword.desc")}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          {isSuccess ? (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-full">
                  <svg
                    className="w-12 h-12 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("setupPassword.success")}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("setupPassword.backToLogin")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Password */}
              <PasswordInput
                label={t("setupPassword.newPassword")}
                placeholder={t("setupPassword.newPassword")}
                error={errors.password?.message}
                disabled={isSubmitting}
                showPasswordStrength={true}
                {...registerField("password")}
              />

              {/* Confirm Password */}
              <PasswordInput
                label={t("setupPassword.confirmPassword")}
                placeholder={t("setupPassword.confirmPassword")}
                error={errors.confirmPassword?.message}
                disabled={isSubmitting}
                showPasswordStrength={false}
                {...registerField("confirmPassword")}
              />

              {/* Server Error */}
              {serverError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm text-center">
                    {serverError}
                  </p>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                fullWidth
                isLoading={isSubmitting}
                className="mt-6"
              >
                {t("setupPassword.setButton")}
              </Button>
            </form>
          )}
        </div>

        {/* Help Text */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            {t("setupPassword.helpText")}

          </p>
        </div>
      </div>
    </div>
  );
}

export default function SetupPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SetupPasswordContent />
    </Suspense>
  );
}
