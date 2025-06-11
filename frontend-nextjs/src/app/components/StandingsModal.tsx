"use client";

import React, { useEffect, useState } from "react";
import { League } from "../interface";
import axios from "axios";

interface Props {
  league: League;
  onClose: () => void;
}

interface StandingRow {
  teamName: string;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export default function StandingsModal({ league, onClose }: Props) {
  const [selectedSeason, setSelectedSeason] = useState("");
  const [seasons, setSeasons] = useState<string[]>([]);
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const res = await axios.get<string[]>(
          "http://localhost:8080/api/standings/seasons"
        );
        const sortedSeasons = res.data.sort((a, b) => (a > b ? -1 : 1));
        setSeasons(sortedSeasons);
        if (sortedSeasons.length > 0) {
          setSelectedSeason(sortedSeasons[0]);
        }
      } catch (err) {
        console.error("Errore nel caricamento delle stagioni", err);
      }
    };

    fetchSeasons();
  }, []);

  useEffect(() => {
    if (!selectedSeason) return;

    const fetchStandings = async () => {
      setLoading(true);
      try {
        const res = await axios.get<StandingRow[]>(
          "http://localhost:8080/api/standings",
          {
            params: {
              season: selectedSeason,
              leagueId: league.leagueId,
            },
          }
        );
        setStandings(res.data);
      } catch (err) {
        console.error("Errore nel caricamento della classifica", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, [selectedSeason, league.leagueId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{league.name}</h2>
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            {seasons.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p>Caricamento classifica...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2">Squadra</th>
                  <th className="p-2 text-center">GF</th>
                  <th className="p-2 text-center">GS</th>
                  <th className="p-2 text-center">DR</th>
                  <th className="p-2 text-center">Punti</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((row, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="p-2">{row.teamName}</td>
                    <td className="p-2 text-center">{row.goalsFor}</td>
                    <td className="p-2 text-center">{row.goalsAgainst}</td>
                    <td className="p-2 text-center">{row.goalDifference}</td>
                    <td className="p-2 text-center font-semibold">
                      {row.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
