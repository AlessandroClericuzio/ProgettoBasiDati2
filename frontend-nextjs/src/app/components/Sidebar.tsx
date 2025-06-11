"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Country } from "../interface";
import { useCountry } from "../context/countryContext";

export default function Sidebar() {
  const { selectedCountryId, setSelectedCountry } = useCountry();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCountries = () => {
    setLoading(true);
    setError(false);

    axios
      .get("http://localhost:8080/api/countries")
      .then((res) => {
        setCountries(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore fetch countries:", err);
        setLoading(false);
        setError(true);
      });
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  if (loading) {
    return (
      <aside className="w-64 bg-gradient-to-b from-slate-50 to-slate-100 border-r border-slate-200 shadow-sm">
        <div className="p-6">
          {/* Header con skeleton */}
          <div className="mb-6">
            <div className="h-6 bg-slate-200 rounded-md animate-pulse mb-4"></div>
          </div>

          {/* Loading skeleton */}
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 p-3 rounded-lg"
              >
                <div className="w-4 h-4 bg-slate-200 rounded-full animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse flex-1"></div>
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 mb-3">
                Errore nel caricamento
              </p>
              <button
                onClick={fetchCountries}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
              >
                Riprova
              </button>
            </div>
          )}
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-gradient-to-b from-white to-slate-50 border-r border-slate-200 shadow-lg h-[calc(100vh-64px)] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Paesi</h2>
            <p className="text-xs text-slate-500">Seleziona un paese</p>
          </div>
        </div>
      </div>

      {/* Lista paesi scrollabile */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {/* Opzione "All" */}
        <div
          className={`group cursor-pointer transition-all duration-200 rounded-xl ${
            selectedCountryId === 0
              ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]"
              : "hover:bg-slate-100 hover:scale-[1.01] text-slate-700"
          }`}
          onClick={() => setSelectedCountry(0, "All")}
        >
          <div className="flex items-center space-x-3 p-3">
            <div
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                selectedCountryId === 0 ? "bg-white" : "bg-slate-400"
              }`}
            ></div>
            <span className="font-medium text-sm">Tutti i Paesi</span>
            {selectedCountryId === 0 && (
              <div className="ml-auto">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Lista paesi */}
        {countries.map((c, index) => (
          <div
            key={c.countryId}
            className={`group cursor-pointer transition-all duration-200 rounded-xl ${
              c.countryId === selectedCountryId
                ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]"
                : "hover:bg-slate-100 hover:scale-[1.01] text-slate-700"
            }`}
            onClick={() => setSelectedCountry(c.countryId, c.name)}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center space-x-3 p-3">
              <div
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  c.countryId === selectedCountryId
                    ? "bg-white"
                    : "bg-slate-400"
                }`}
              ></div>
              <span className="font-medium text-sm truncate flex-1">
                {c.name}
              </span>
              {c.countryId === selectedCountryId && (
                <div className="ml-auto">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{countries.length} paesi disponibili</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
