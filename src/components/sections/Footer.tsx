"use client";

import React, {useCallback, useEffect, useState} from "react";
import Link from "next/link";
import {useTheme} from "@/context/theme/useTheme";
import {ArrowUp, ArrowUpRight, Moon, Sun} from "lucide-react";
import {useLanguage} from "@/context/language/useLanguage";

// Scroll to the top component
const ScrollToTop = () => {
    const {isDarkMode} = useTheme();
    const [isVisible, setIsVisible] = useState(false);

    const checkScrollPosition = useCallback(() => {
        setIsVisible(window.scrollY > 500);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', checkScrollPosition);
        return () => window.removeEventListener('scroll', checkScrollPosition);
    }, [checkScrollPosition]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 p-3 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center justify-center ${
                isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-12 pointer-events-none'
            } bg-blue-600 hover:bg-blue-700`}
            aria-label="Scroll to top"
        >
            <ArrowUp size={20} color={'white'}/>
        </button>
    );
};

export default function Footer() {
    const {isDarkMode, toggleTheme} = useTheme();
    const currentYear = new Date().getFullYear();
    const [mounted, setMounted] = useState(false);
    const {t}=useLanguage();

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            <ScrollToTop/>

            <footer className={`py-2 w-full min-h-[200px] bg-card-bg ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="container mx-auto px-4">
                    <div className="py-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Brand */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <div className="p-1.5 rounded-md mr-2.5 flex items-center justify-center bg-primary shadow-sm">
                                        <span className="text-sm font-bold text-white">BV</span>
                                    </div>
                                    <span className="font-semibold">Bureau Vallée Chatbot</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {t("footer.description")}
                                </p>
                                <a
                                    href="https://www.bureau-vallee.fr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    bureau-vallee.fr
                                    <ArrowUpRight size={14}/>
                                </a>
                            </div>

                            {/* Navigation */}
                            <div>
                                <h4 className="font-medium mb-4">Navigation</h4>
                                <ul className="space-y-2">
                                    
                                    <li>
                                        <Link href="/chat" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                            Chat
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/profile" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                            {t("nav.profile")}
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Account */}
                            <div>
                                <h4 className="font-medium mb-4">{t("footer.account")}</h4>
                                <ul className="space-y-2">
                                    <li>
                                        <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                            {t("nav.signIn")}
                                        </Link>
                                    </li>
                                    
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Copyright bar */}
                    <div className={`py-6 border-t ${
                        isDarkMode ? 'border-zinc-800' : 'border-zinc-100'
                    } flex flex-col md:flex-row justify-between items-center`}>
                        <p className="text-xs text-muted-foreground mb-4 md:mb-0">
                            {t("footer.copyright")}
                        </p>

                        <div className={`${mounted ? 'visible' : 'invisible'}`}>
                            <button
                                onClick={toggleTheme}
                                className="flex gap-2 items-center group"
                                aria-label={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
                            >
                                <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                                    {isDarkMode ? 'Dark' : 'Light'} Mode
                                </span>
                                <div className={`w-16 h-8 rounded-full p-1.5 flex items-center transition-all ${
                                    isDarkMode ? 'bg-zinc-800 justify-end' : 'bg-zinc-100 justify-start'
                                } group-hover:ring-1 group-hover:ring-primary`}>
                                    <div className="h-5 w-5 rounded-full flex items-center justify-center text-white shadow-md transition-all bg-primary group-hover:scale-110">
                                        {isDarkMode
                                            ? <Sun size={12} className="text-amber-100"/>
                                            : <Moon size={12} className="text-indigo-100"/>
                                        }
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}