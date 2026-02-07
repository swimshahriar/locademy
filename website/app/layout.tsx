import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Locademy — Your local video library",
  description:
    "Turn any folder of videos into a clean, offline player. Courses, talks, recordings—no account, no database.",
  icons: { icon: "/icon.png" },
  openGraph: {
    title: "Locademy — Your local video library",
    description:
      "Turn any folder of videos into a clean, offline player. Courses, talks, recordings—no account, no database.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="min-h-screen antialiased font-sans bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
