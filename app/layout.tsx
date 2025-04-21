import type { Metadata } from "next";
import { Inter, Poppins, Roboto } from "next/font/google";
import "@/app/globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
    title: "GeomeTriks",
    description: "Interactive E-Learning Platform",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SessionProvider>
            <html lang="en">
                <body className={poppins.className}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                            <div className="min-h-screen flex flex-col justify-center">
                                <Toaster/>
                                <main>{children}</main>
                            </div>
                    </ThemeProvider>
                </body>
            </html>
        </SessionProvider>
    );
}
