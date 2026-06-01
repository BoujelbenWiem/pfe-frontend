"use client";

import { ReactElement, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/context/theme/useTheme";
import { useLanguage } from "@/context/language/useLanguage";

// Simple icon component instead of complex Icon system
const Icon = ({ name, size = 20, className = "" }: { name: string; size?: number; className?: string }) => {
  const icons: Record<string, ReactElement> = {
    home: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    message: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    user: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    menu: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
    x: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    dashboard: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
    logOut: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    ),
    sun: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
    moon: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    ),
  };

  return icons[name] || null;
};

// Simple navigation links for your chatbot app
const getNavLinks = (isAdmin: boolean, isAuthenticated: boolean) => {
  if (!isAuthenticated) return [];
  const baseLinks = [
    { href: "/chat", labelKey: "nav.chat", icon: "message" },
    { href: "/profile", labelKey: "nav.profile", icon: "user" },
  ];
  if (isAdmin) {
    return [
      { href: "/dashboard", labelKey: "nav.dashboard", icon: "dashboard" },
      ...baseLinks,
    ];
  }
  return baseLinks;
};

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className = "" }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = user?.role === "ADMIN";
  const navLinks = getNavLinks(isAdmin, isAuthenticated);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    setIsMobileMenuOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname.startsWith(href);
  };

  if (!mounted) return null;

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-md border-b shadow-sm ${className}`}
      style={{
        backgroundColor: isDarkMode ? "rgba(17, 24, 39, 0.95)" : "rgba(255, 255, 255, 0.95)",
        borderColor: isDarkMode ? "rgba(75, 85, 99, 0.5)" : "rgba(229, 231, 235, 0.5)",
        padding: "1rem 3.2rem 1rem 3.8rem",
      }}
    >
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            
            <Image 
              src="/logo_bv.png" 
              alt="BV Logo" 
              width={140} 
              height={69}
              className="dark:hidden rounded-md"
              priority
              
            />
            <Image 
              src="/logo_bv.png" 
              alt="BV Logo" 
              width={140} 
              height={69}
              className="hidden dark:block rounded-md"
              priority
            />
            
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                  isActive(link.href)
                    ? "bg-primary text-white shadow-md"
                    : `${isDarkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"}`
                }`}
              >
                <Icon name={link.icon} size={18} />
                <span>{t(link.labelKey)}</span>
              </Link>
            ))}
          </div>

          {/* Right side - Theme Toggle & Auth */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all ${
                isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Icon name="sun" size={20} className="text-amber-400" />
              ) : (
                <Icon name="moon" size={20} className="text-indigo-600" />
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === "en" ? "fr" : "en")}
              className={`px-3 py-2 rounded-full transition-all font-medium text-sm ${
                isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
              aria-label="Toggle language"
            >
              {language === "en" ? "🇫🇷 FR" : "🇬🇧 EN"}
            </button>

            {/* Auth Section - Desktop */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-3">
                <div className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {user?.username || user?.email}
                </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
                    aria-label="Logout"
                    title={t("nav.signOut")}
                  >
                    <Icon name="logOut" size={20} className="text-red-500" />
                  </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  {t("nav.signIn")}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              <Icon name={isMobileMenuOpen ? "x" : "menu"} size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden border-t shadow-lg transition-all duration-200 ease-in-out ${
          isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{
          backgroundColor: isDarkMode ? "rgb(17, 24, 39)" : "white",
          borderColor: isDarkMode ? "rgba(75, 85, 99, 0.5)" : "rgba(229, 231, 235, 0.5)",
        }}
      >
            <div className="px-4 py-4 space-y-3">
              {/* Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(link.href)
                      ? "bg-primary text-white"
                      : `${isDarkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"}`
                  }`}
                >
                  <Icon name={link.icon} size={20} />
                  <span className="font-medium">{t(link.labelKey)}</span>
                </Link>
              ))}

              {/* Auth Section - Mobile */}
              {isAuthenticated ? (
                <>
                  <div className={`px-4 py-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <div className="text-sm font-medium">{t("nav.signedInAs")}</div>
                    <div className="text-sm opacity-75">{user?.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    <Icon name="logOut" size={20} />
                    <span className="font-medium">{t("nav.signOut")}</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    {t("nav.signIn")}
                  </Link>
                </>
              )}
            </div>
          </div>
    </nav>
  );
}