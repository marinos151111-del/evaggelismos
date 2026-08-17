import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Evangelismos Music Stores — Instruments, Accessories & Books in Cyprus",
  description:
    "Evangelismos Music Stores — musical instruments, accessories and books in Cyprus since 1973. Shop online or visit Nicosia, Larnaca and Limassol.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/assets/logo.png",
    shortcut: "/assets/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500;1,9..144,600&family=IBM+Plex+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
