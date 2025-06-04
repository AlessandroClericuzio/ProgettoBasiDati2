"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Country } from "../interface";
import { useCountry } from "../context/countryContext";

export default function Sidebar() {
  const { selectedCountryId, setSelectedCountry } = useCountry();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRetry, setShowRetry] = useState(false);

  const fetchCountries = () => {
    setLoading(true);
    setShowRetry(false);

    axios
      .get("http://localhost:8080/api/countries")
      .then((res) => {
        setCountries(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore fetch countries:", err);
        setLoading(false);
        setShowRetry(true);
      });
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  if (loading) {
    return <aside className="w-64 p-4">Caricamento paesi...</aside>;
  }

  if (showRetry) {
    return (
      <aside className="w-64 p-4">
        Errore nel caricamento paesi.
        <button
          onClick={fetchCountries}
          className="ml-4 px-3 py-1 bg-indigo-600 text-white rounded"
        >
          Riprova
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-gray-200 p-4 h-[calc(100vh-64px)] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Paesi</h2>
      <ul>
        <li
          className={`cursor-pointer mb-2 p-2 rounded ${
            selectedCountryId === 0
              ? "bg-indigo-500 text-white"
              : "hover:bg-gray-300"
          }`}
          onClick={() => setSelectedCountry(0, "All")}
        >
          All
        </li>
        {countries.map((c) => (
          <li
            key={c.countryId}
            className={`cursor-pointer mb-2 p-2 rounded ${
              c.countryId === selectedCountryId
                ? "bg-indigo-500 text-white"
                : "hover:bg-gray-300"
            }`}
            onClick={() => setSelectedCountry(c.countryId, c.name)}
          >
            {c.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}
