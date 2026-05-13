"use client";

import React from "react";
import Navbar from "./Navbar";

interface HeaderProps {
    className?: string;
}

export default function Header({className = ""}: HeaderProps) {
    return (
        <header className={`sticky top-0 z-50 ${className}`}>
            <Navbar/>
        </header>
    );
}