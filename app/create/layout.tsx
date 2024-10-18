"use client";
import React, { Suspense } from "react";
import { PlaylistProvider } from "@/context/PlaylistContext";

export default function CreateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-screen bg-background`}>
      <body className="font-sans">
        <Suspense fallback={<div>Loading...</div>}>
          <PlaylistProvider>{children}</PlaylistProvider>
        </Suspense>
      </body>
    </html>
  );
}
