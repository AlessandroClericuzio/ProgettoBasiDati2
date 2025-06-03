// src/app/layout.tsx
"use client";

import React from "react";
import "./globals.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { CountryProvider } from "./context/countryContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className="flex flex-col min-h-screen">
        <Header />
        <CountryProvider initialCountryId={10257} initialCountryName="Italia">
          <div className="flex flex-1 overflow-auto">
            {/* Sidebar Paesi */}
            <Sidebar />

            {/* Main content area */}
            <main className="flex-1 p-6 overflow-auto">{children}</main>
          </div>
        </CountryProvider>
      </body>
    </html>
  );
}
