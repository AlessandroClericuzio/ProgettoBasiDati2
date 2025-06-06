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
    <>
      <div className="flex items-center justify-between mb-4 space-x-4">
        <input
          type="text"
          placeholder="Cerca lega..."
          value={searchLeagueName}
          onChange={onSearchChange}
          className="p-2 border rounded flex-grow max-w-xs"
        />

        <div className="flex items-center space-x-2">
          <label htmlFor="match-date" className="text-sm">
            Data:
          </label>
          <input
            type="date"
            id="match-date"
            className="p-2 border rounded"
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

      {isLoading && <p>Caricamento in corso...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
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
                <div key={league.leagueId} className="mb-8">
                  <LeagueAccordion
                    league={league}
                    matches={matchesOfThisLeague}
                    onLeagueClick={() => openLeagueDetails(league.leagueId)}
                  />
                </div>
              );
            })
        ) : (
          <p>Nessuna lega disponibile per questa data.</p>
        )}
      </div>

      {selectedCountryId !== 0 && (
        <button
          onClick={openAddLeagueModal}
          className="w-full py-2 mt-4 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Aggiungi Lega
        </button>
      )}

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
    </>
  );
}
