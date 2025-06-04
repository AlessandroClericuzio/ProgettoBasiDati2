"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Country } from "../interface";
import { useCountry } from "../context/countryContext";

export default function Sidebar() {
  const { selectedCountryId, setSelectedCountry } = useCountry();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCountries = () => {
    console.log("Fetch start");
    setLoading(true);
    setError(null);
    axios
      .get("http://localhost:8080/api/countries")
      .then((res) => {
        console.log("Fetch success", res.data);
        setCountries(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error", err);
        setError("Errore nel caricamento dei paesi");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  console.log("Render Sidebar", { loading, error, countries });

  if (loading) {
    return (
      <aside className="w-64 p-4">
        <p>Caricamento paesi...</p>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="w-64 p-4 bg-red-100 text-red-700">
        <p>{error}</p>
        <button
          onClick={fetchCountries}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
