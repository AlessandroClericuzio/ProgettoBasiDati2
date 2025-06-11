"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import LeagueAccordion from "./components/LeagueAccordion";
import AddLeagueModal from "./components/AddLeagueModal";
import EditLeagueModal from "./components/EditLeagueModal";
import LeagueDetailsModal from "./components/LeagueDetailModal";
import { League, MatchWithDetails } from "./interface";
import { useCountry } from "./context/countryContext";

// debounce generico
function debounce<F extends (...args: any[]) => void>(
  func: F,
  waitFor: number
) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

export default function HomePage() {
  const { selectedCountryId } = useCountry();
  const [matches, setMatches] = useState<MatchWithDetails[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  // Inizializzo selectedDate vuoto
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [leagues, setLeagues] = useState<League[]>([]);
  const [searchLeagueName, setSearchLeagueName] = useState<string>("");

  const [isAddLeagueOpen, setIsAddLeagueOpen] = useState(false);
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);
  const [isLeagueDetailsOpen, setIsLeagueDetailsOpen] = useState(false);
  const [editLeague, setEditLeague] = useState<League | null>(null);
  const [isEditLeagueOpen, setIsEditLeagueOpen] = useState(false);

  // Carico availableDates e imposto selectedDate al primo valore disponibile o a oggi
  useEffect(() => {
    axios
      .get<string[]>("http://localhost:8080/api/matches/available-dates")
      .then((res) => {
        setAvailableDates(res.data);

        if (res.data.length > 0 && !selectedDate) {
          // Prendi solo la data senza orario
          const firstDate = res.data[0].split(" ")[0]; // oppure res.data[0].slice(0, 10)
          setSelectedDate(firstDate);
        } else if (res.data.length === 0 && !selectedDate) {
          setSelectedDate(new Date().toISOString().slice(0, 10));
        }
      })
      .catch(() => {
        if (!selectedDate)
          setSelectedDate(new Date().toISOString().slice(0, 10));
      });
  }, []);

  const fetchLeagues = useCallback(
    async (searchQuery: string = "") => {
      if (selectedCountryId === 0) {
        const allLeaguesRes = await axios.get<League[]>(
          "http://localhost:8080/api/leagues"
        );
        if (searchQuery.trim()) {
          const filtered = allLeaguesRes.data.filter((league) =>
            league.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setLeagues(filtered);
        } else {
          setLeagues(allLeaguesRes.data);
        }
      } else {
        if (searchQuery.trim()) {
          const res = await axios.get<League[]>(
            `http://localhost:8080/api/leagues/search`,
            { params: { query: searchQuery } }
          );
          setLeagues(res.data);
        } else {
          const res = await axios.get<League[]>(
            `http://localhost:8080/api/leagues/by-country/${selectedCountryId}`
          );
          setLeagues(res.data);
        }
      }
    },
    [selectedCountryId]
  );

  const fetchMatches = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let matchData: MatchWithDetails[] = [];
      if (selectedCountryId === 0) {
        const res = await axios.get<MatchWithDetails[]>(
          "http://localhost:8080/api/matches/by-date",
          { params: { date: selectedDate } }
        );
        matchData = res.data;
        console.log(
          "fetchMatches chiamata all con selectedDate =",
          selectedDate
        );
        console.log("Risposta backend (by-date):", matchData);
      } else {
        const res = await axios.get<MatchWithDetails[]>(
          "http://localhost:8080/api/matches/by-country-and-date",
          { params: { countryId: selectedCountryId, date: selectedDate } }
        );
        matchData = res.data;
        console.log("fetchMatches chiamata con selectedDate =", selectedDate);
        console.log("Risposta backend (by-date):", matchData);
      }
      setMatches(matchData);
    } catch {
      setError("Errore nel caricamento delle partite.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCountryId, selectedDate]);

  // Chiamo fetch solo se selectedDate è valorizzato
  useEffect(() => {
    if (selectedDate) {
      fetchLeagues(searchLeagueName);
      fetchMatches();
    }
  }, [selectedCountryId, selectedDate]);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      fetchLeagues(query);
    }, 400),
    [fetchLeagues]
  );

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchLeagueName(val);
    debouncedSearch(val);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const openAddLeagueModal = () => {
    if (!selectedCountryId || selectedCountryId === 0) return;
    setIsAddLeagueOpen(true);
  };

  const openLeagueDetails = (leagueId: number) => {
    setSelectedLeagueId(leagueId);
    setIsLeagueDetailsOpen(true);
  };

  const closeLeagueDetails = () => {
    setSelectedLeagueId(null);
    setIsLeagueDetailsOpen(false);
  };

  const handleEditClick = () => {
    if (!selectedLeagueId) return;
    const leagueToEdit =
      leagues.find((l) => l.leagueId === selectedLeagueId) || null;
    setEditLeague(leagueToEdit);
    setIsEditLeagueOpen(true);
    setIsLeagueDetailsOpen(false);
  };

  const closeEditLeagueModal = () => {
    setEditLeague(null);
    setIsEditLeagueOpen(false);
  };

  const handleLeagueUpdated = (updatedLeague: League) => {
    setLeagues((prev) =>
      prev.map((l) =>
        l.leagueId === updatedLeague.leagueId ? updatedLeague : l
      )
    );
  };

  const handleDeleteLeague = async (leagueId: number) => {
    if (!confirm("Sei sicuro di voler eliminare questa lega?")) return;

    try {
      await axios.delete(
        `http://localhost:8080/api/leagues/byLeagueId/${leagueId}`
      );
      setLeagues((prev) => prev.filter((l) => l.leagueId !== leagueId));
      setIsLeagueDetailsOpen(false);
    } catch {
      alert("Errore durante l'eliminazione della lega");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header con controlli */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Search Input */}
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Cerca lega..."
                value={searchLeagueName}
                onChange={onSearchChange}
                className="w-full pl-10 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
              />
            </div>

            {/* Date Input */}
            <div className="flex items-center space-x-3 bg-white/80 px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-2 text-gray-700">
                <svg
                  className="h-5 w-5 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <label htmlFor="match-date" className="text-sm font-medium">
                  Data:
                </label>
              </div>
              <input
                type="date"
                id="match-date"
                className="bg-transparent border-none outline-none focus:ring-0 text-gray-800 font-medium"
                value={selectedDate}
                onChange={handleDateChange}
                list="available-dates"
              />
              <datalist id="available-dates">
                {availableDates.map((date) => (
                  <option key={date} value={date} />
                ))}
              </datalist>
            </div>
          </div>
        </div>

        {/* Loading e Error States */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <p className="text-gray-700 font-medium text-lg">
                Caricamento in corso...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <svg
                className="h-5 w-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 overflow-hidden">
          <div className="p-6">
            <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
              {leagues.length > 0 ? (
                leagues
                  .filter((league) => {
                    if (selectedCountryId === 0) {
                      // Se siamo in "All", mostra solo leghe con almeno un match
                      return matches.some(
                        (m) => m.league?.leagueId === league.leagueId
                      );
                    }
                    // Se siamo in un paese specifico, mostra tutte le leghe
                    return true;
                  })
                  .map((league) => {
                    const matchesOfThisLeague = matches.filter(
                      (m) => m.league?.leagueId === league.leagueId
                    );

                    return (
                      <div
                        key={league.leagueId}
                        className="transform transition-all duration-300 hover:scale-[1.02]"
                      >
                        <LeagueAccordion
                          league={league}
                          matches={matchesOfThisLeague}
                          onLeagueClick={() =>
                            openLeagueDetails(league.leagueId)
                          }
                        />
                      </div>
                    );
                  })
              ) : (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg font-medium">
                    Nessuna lega disponibile per questa data
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Prova a selezionare una data diversa
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Add League Button */}
          {selectedCountryId !== 0 && (
            <div className="border-t border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
              <button
                onClick={openAddLeagueModal}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <div className="relative flex items-center justify-center space-x-2">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>Aggiungi Lega</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Custom Scrollbar Styles */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
          }
        `}</style>
      </div>

      {/* Modals */}
      <AddLeagueModal
        isOpen={isAddLeagueOpen}
        onClose={() => setIsAddLeagueOpen(false)}
        countryId={selectedCountryId || 0}
        onLeagueAdded={(newLeague) => {
          setLeagues((prev) => [...prev, newLeague]);
        }}
      />

      <LeagueDetailsModal
        leagueId={selectedLeagueId}
        isOpen={isLeagueDetailsOpen}
        onClose={closeLeagueDetails}
        onEditClick={handleEditClick}
        onDelete={handleDeleteLeague}
      />

      <EditLeagueModal
        isOpen={isEditLeagueOpen}
        onClose={closeEditLeagueModal}
        league={editLeague}
        onLeagueUpdated={handleLeagueUpdated}
      />
    </div>
  );
}
