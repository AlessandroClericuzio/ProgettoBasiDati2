"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface CountryContextType {
  selectedCountryId: number;
  selectedCountryName: string | null;
  setSelectedCountry: (id: number, name: string) => void;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

interface CountryProviderProps {
  children: ReactNode;
  initialCountryId?: number;
  initialCountryName?: string;
}

export function CountryProvider({
  children,
  initialCountryId = 10257, // Italia di default
  initialCountryName = "Italia",
}: CountryProviderProps) {
  const [selectedCountryId, setSelectedCountryId] =
    useState<number>(initialCountryId);
  const [selectedCountryName, setSelectedCountryName] = useState<string | null>(
    initialCountryName
  );

  const setSelectedCountry = (id: number, name: string) => {
    setSelectedCountryId(id);
    setSelectedCountryName(name);
  };

  const value = {
    selectedCountryId,
    selectedCountryName,
    setSelectedCountry,
  };

  return (
    <CountryContext.Provider value={value}>{children}</CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error("useCountry must be used within a CountryProvider");
  }
  return context;
}
