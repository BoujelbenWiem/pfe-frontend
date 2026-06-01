"use client";

import React, {useCallback, useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
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
                    {/* Existing footer content */}
                    <div className="py-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
                            {/* Social Media Links */}
                            <div>
                                <p className={`text-sm font-medium mb-4 ${
                                    isDarkMode ? "text-gray-300" : "text-gray-700"
                                }`}>
                                    Suivez-nous
                                </p>
                                <ul className="flex flex-wrap gap-3">
                                    <li>
                                        <a 
                                            href="https://www.facebook.com/BureauVallee/" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className={`p-2 rounded-full transition-all inline-flex items-center justify-center ${
                                                isDarkMode 
                                                    ? "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-blue-400" 
                                                    : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-blue-600"
                                            }`}
                                            aria-label="Facebook"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a 
                                            href="https://twitter.com/bureauvallee" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className={`p-2 rounded-full transition-all inline-flex items-center justify-center ${
                                                isDarkMode 
                                                    ? "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200" 
                                                    : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                                            }`}
                                            aria-label="Twitter"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a 
                                            href="https://fr.linkedin.com/company/bureau-vall-e" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className={`p-2 rounded-full transition-all inline-flex items-center justify-center ${
                                                isDarkMode 
                                                    ? "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-blue-500" 
                                                    : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-blue-700"
                                            }`}
                                            aria-label="LinkedIn"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z" />
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a 
                                            href="https://www.instagram.com/bureauvallee_officiel" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className={`p-2 rounded-full transition-all inline-flex items-center justify-center ${
                                                isDarkMode 
                                                    ? "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-pink-500" 
                                                    : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-pink-600"
                                            }`}
                                            aria-label="Instagram"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748a3.13 3.13 0 00-.748 1.15c-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.398.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.684.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.13 3.13 0 00-.748-1.15 3.13 3.13 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a 
                                            href="https://www.youtube.com/c/bureauvallee" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className={`p-2 rounded-full transition-all inline-flex items-center justify-center ${
                                                isDarkMode 
                                                    ? "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-red-500" 
                                                    : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-red-600"
                                            }`}
                                            aria-label="YouTube"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a 
                                            href="https://www.tiktok.com/@bureauvallee_?lang=fr" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className={`p-2 rounded-full transition-all inline-flex items-center justify-center ${
                                                isDarkMode 
                                                    ? "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white" 
                                                    : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-black"
                                            }`}
                                            aria-label="TikTok"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M19.589 6.686a4.503 4.503 0 0 1-2.537-2.557 4.5 4.5 0 0 1-.191-1.129h-3.27v11.86c0 2.006-1.624 3.63-3.63 3.63a3.63 3.63 0 0 1-1.836-.496 3.614 3.614 0 0 1-1.974-3.202 3.63 3.63 0 0 1 3.63-3.63c.246 0 .487.03.719.088v-3.387a7.023 7.023 0 0 0-1.173-.096c-3.866 0-7 3.134-7 7s3.134 7 7 7 7-3.134 7-7v-5.888c.88.63 1.96 1 3.13 1V7.69c-1.184 0-2.308-.386-3.2-1.004z" />
                                            </svg>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            
                        </div>
                    </div>

                    

                    {/* NEW SECTION: Extra footer elements (Reviews, Payment, Social) */}
                    
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