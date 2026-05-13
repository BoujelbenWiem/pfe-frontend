import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import { ThemeProvider } from "@/context/theme/ThemeProvider";
import { ThemeScript } from "@/context/theme/ThemeScript";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              <Header />
              <main className="flex-1 pt-4 pb-4 min-h-[calc(100vh-16rem)]">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}