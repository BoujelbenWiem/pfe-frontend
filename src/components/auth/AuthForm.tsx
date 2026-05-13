"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  loginSchema,
  registerSchema,
  LoginFormData,
  RegisterFormData,
  ROLES,
  STORES,
} from "@/lib/validations/auth.schema";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";

type AuthFormType = "login" | "register";
type FormData = LoginFormData | RegisterFormData;

const config = {
  login: {
    title: "Welcome Back",
    subtitle: "Sign in to your account to continue",
    submitLabel: "Sign In",
    schema: loginSchema,
    altText: "Don't have an account?",
    altLink: "/register",
    altLinkText: "Create an account",
    errorMessage: "Invalid credentials",
  },
  register: {
    title: "Create Account",
    subtitle: "Sign up to get started",
    submitLabel: "Sign Up",
    schema: registerSchema,
    altText: "Already have an account?",
    altLink: "/login",
    altLinkText: "Sign in",
    errorMessage: "Registration failed. Please try again.",
  },
} as const;

export default function AuthForm({ type }: { type: AuthFormType }) {
  const router = useRouter();
  const { login, register: registerUser } = useAuth();
  const [serverError, setServerError] = useState("");

  const cfg = config[type];

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(cfg.schema),
  });

  const selectedRole = type === "register" ? watch("role" as keyof FormData) : undefined;

  const onSubmit = async (data: FormData) => {
    setServerError("");
    try {
      if (type === "login") {
        const result = await login(data as LoginFormData);
        router.push(result?.role === "ADMIN" ? "/dashboard" : "/chat");
      } else {
        const { confirmPassword, ...payload } = data as RegisterFormData;
        await registerUser(payload);
        router.push("/login");
      }
    } catch {
      setServerError(cfg.errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {cfg.title}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {cfg.subtitle}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username — register only */}
            {type === "register" && (
              <Input
                label="Username"
                type="text"
                placeholder="johndoe"
                error={(errors as FieldErrors<RegisterFormData>).username?.message}
                disabled={isSubmitting}
                {...registerField("username" as keyof FormData)}
              />
            )}

            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              disabled={isSubmitting}
              {...registerField("email")}
            />

            {/* Password */}
            <PasswordInput
              label="Password"
              placeholder={type === "login" ? "Enter your password" : "Create a password"}
              error={errors.password?.message}
              disabled={isSubmitting}
              showPasswordStrength={type === "register"}
              {...registerField("password")}
            />

            {/* Confirm Password — register only */}
            {type === "register" && (
              <PasswordInput
                label="Confirm Password"
                placeholder="Re-enter your password"
                error={(errors as FieldErrors<RegisterFormData>).confirmPassword?.message}
                disabled={isSubmitting}
                showPasswordStrength={false}
                {...registerField("confirmPassword" as keyof FormData)}
              />
            )}

            {/* Role — register only */}
            {type === "register" && (
              <div className="space-y-2 w-full">
                <label className="block text-sm font-medium tracking-wide mb-1">
                  Role
                </label>
                <select
                  className="input w-full"
                  disabled={isSubmitting}
                  {...registerField("role" as keyof FormData)}
                >
                  <option value="">Select a role</option>
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role.replace("_", " ")}
                    </option>
                  ))}
                </select>
                {(errors as FieldErrors<RegisterFormData>).role?.message && (
                  <p className="mt-1.5 text-sm text-red-500" role="alert">
                    {(errors as FieldErrors<RegisterFormData>).role?.message}
                  </p>
                )}
              </div>
            )}

            {/* Store ID — register only, shown for STORE_MANAGER */}
            {type === "register" && selectedRole === "STORE_MANAGER" && (
              <div className="space-y-2 w-full">
                <label className="block text-sm font-medium tracking-wide mb-1">
                  Store
                </label>
                <select
                  className="input w-full"
                  disabled={isSubmitting}
                  {...registerField("store_id" as keyof FormData)}
                >
                  <option value="">Select a store</option>
                  {STORES.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
                {(errors as FieldErrors<RegisterFormData>).store_id?.message && (
                  <p className="mt-1.5 text-sm text-red-500" role="alert">
                    {(errors as FieldErrors<RegisterFormData>).store_id?.message}
                  </p>
                )}
              </div>
            )}

            {/* Department — register only */}
            {type === "register" && (
              <Input
                label="Department"
                type="text"
                placeholder="Your department (optional)"
                error={(errors as FieldErrors<RegisterFormData>).department?.message}
                disabled={isSubmitting}
                {...registerField("department" as keyof FormData)}
              />
            )}

            {/* Forgot Password — login only */}
            {type === "login" && (
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            )}

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
              {cfg.submitLabel}
            </Button>
          </form>

          {/* Alt Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {cfg.altText}{" "}
              <Link href={cfg.altLink} className="text-primary hover:underline font-medium">
                {cfg.altLinkText}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
