// src/app/components/Sidebar.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Country } from "../interface";
import { useCountry } from "../context/countryContext";

export default function Sidebar() {
  const { selectedCountryId, setSelectedCountry } = useCountry();

  const [countries, setCountries] = useState<Country[]>([]); // Lo stato per i paesi

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/countries")
      .then((res) => setCountries(res.data))
      .catch((err) => console.error("Errore fetch countries:", err));
  }, []);

  return (
    <aside className="w-64 bg-gray-200 p-4 h-[calc(100vh-64px)] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Paesi</h2>{" "}
      {/* Titolo modificato */}
      <ul>
        <li
          className={`cursor-pointer mb-2 p-2 rounded ${
            selectedCountryId === 0
              ? "bg-indigo-500 text-white"
              : "hover:bg-gray-300"
          }`}
          onClick={() => {
            console.log("Clicked All");
            setSelectedCountry(0, "All");
          }}
        >
          All
        </li>
        {countries.map(
          (
            c // Mappa i paesi
          ) => (
            <li
              key={c.countryId}
              className={`cursor-pointer mb-2 p-2 rounded ${
                c.countryId === selectedCountryId
                  ? "bg-indigo-500 text-white"
                  : "hover:bg-gray-300"
              }`}
              onClick={() => {
                console.log("Clicked country:", c.countryId, c.name);
                setSelectedCountry(c.countryId, c.name);
              }}
            >
              {c.name}
            </li>
          )
        )}
      </ul>
    </aside>
  );
}
