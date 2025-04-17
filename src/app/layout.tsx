import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Studio Ghibli AI - Gjeneratori Falas i AI Ghibli me Animazh.com",
  description: "Ghibli AI është një mjet falas që transformon fotot në art Ghibli AI me Gjeneratorin tonë Ghibli të fuqizuar nga Studio Ghibli AI. Provoje tani!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sq" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta charSet="UTF-8" />
      </head>
      <ClientBody>{children}</ClientBody>
    </html>
  );
}
