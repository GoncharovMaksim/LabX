import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Гончаров Максим • Fullstack-разработчик (React, Next.js, Node.js)",
  description: "Сайт-презентация и ИИ-советник разработчика Максима Гончарова. Более 4 лет опыта, оптимизация Core Web Vitals, микросервисы и ИИ-инструменты в разработке.",
  keywords: ["Максим Гончаров", "Fullstack разработчик", "React", "Next.js", "TypeScript", "Node.js", "Портфолио", "ИИ разработчик"],
  authors: [{ name: "Максим Гончаров", url: "https://github.com/GoncharovMaksim" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full bg-zinc-950 text-zinc-100 flex flex-col font-sans select-none selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}

