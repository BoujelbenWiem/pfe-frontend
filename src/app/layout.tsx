import "./globals.css";
import { Metadata } from "next";
import AuthProvider from "@/providers/AuthProvider";
import { ThemeProvider } from "@/context/theme/ThemeProvider";
import { ThemeScript } from "@/context/theme/ThemeScript";
import { LanguageProvider } from "@/context/language/LanguageProvider";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";


const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "BV ChatBot",
  description: "Your intelligent chatbot assistant",
  icons: {
    icon: "/favicon.ico",
    
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head>
        <ThemeScript />
      </head>
      <body>
        
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <Header />
                <main className="flex-1 pt-4 pb-4 min-h-[calc(100vh-16rem)]">
                  {children}
        </main>
                <Footer />
              </div>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}