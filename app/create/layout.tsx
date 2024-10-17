"use client";
import React from "react";
import { PlaylistProvider } from "@/context/PlaylistContext";

export default function CreateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-screen bg-background`}>
      <body className="font-sans">
        <PlaylistProvider>{children}</PlaylistProvider>
      </body>
    </html>
  );
}
