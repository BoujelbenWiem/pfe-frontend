"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  loginSchema,
  LoginFormData,
} from "@/lib/validations/auth.schema";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import { useLanguage } from "@/context/language/useLanguage";

export default function AuthForm() {
  const {t}=useLanguage();
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError("");
    try {
      const result = await login(data);
      router.push(result?.role === "ADMIN" ? "/dashboard" : "/chat");
    } catch {
      setServerError("Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("auth.welcome")}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t("auth.signInDesc")}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <Input
              label={t("auth.email")}
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              disabled={isSubmitting}
              {...registerField("email")}
            />

            {/* Password */}
            <PasswordInput
              label={t("auth.password")}
              placeholder={t("auth.password")}
              error={errors.password?.message}
              disabled={isSubmitting}
              showPasswordStrength={false}
              {...registerField("password")}
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
              className="mt-2"
            >
              {t("auth.signInButton")}
            </Button>
          </form>

          {/* Contact Admin */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("auth.noAccount")}
              <span className="text-primary font-medium">
                {t("auth.contactAdmin")}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
          