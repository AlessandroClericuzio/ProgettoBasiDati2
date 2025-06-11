"use client";

import React, { useEffect, useState } from "react";
import { League } from "../interface";
import axios from "axios";
import {
  X,
  Trophy,
  Calendar,
  Target,
  Shield,
  TrendingUp,
  Medal,
  Award,
} from "lucide-react";

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

  const getPositionStyle = (index: number) => {
    if (index === 0)
      return "bg-gradient-to-r from-yellow-400 to-amber-500 text-white"; // Oro
    if (index === 1)
      return "bg-gradient-to-r from-gray-300 to-gray-400 text-white"; // Argento
    if (index === 2)
      return "bg-gradient-to-r from-amber-600 to-orange-600 text-white"; // Bronzo
    if (index < 6)
      return "bg-gradient-to-r from-green-500 to-emerald-600 text-white"; // Champions
    if (index < 8)
      return "bg-gradient-to-r from-blue-500 to-blue-600 text-white"; // Europa League
    if (index >= standings.length - 3)
      return "bg-gradient-to-r from-red-500 to-red-600 text-white"; // Retrocessione
    return "bg-gray-50 text-gray-800";
  };

  const getPositionIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-4 h-4" />;
    if (index === 1) return <Medal className="w-4 h-4" />;
    if (index === 2) return <Award className="w-4 h-4" />;
    return <span className="font-bold text-sm">{index + 1}</span>;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-purple-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl border border-gray-100 overflow-hidden max-h-[95vh] flex flex-col">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-5 relative">
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-full p-2"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{league.name}</h2>
                <p className="text-white/80 text-sm">Classifica Stagione</p>
              </div>
            </div>

            {/* Selector stagione migliorato */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1">
              <div className="flex items-center space-x-2 bg-white/20 rounded-xl px-3 py-2">
                <Calendar className="w-4 h-4 text-white" />
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="bg-transparent text-white font-medium text-sm focus:outline-none cursor-pointer"
                >
                  {seasons.map((s) => (
                    <option key={s} value={s} className="text-gray-800">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Contenuto scrollabile */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-gray-700 font-medium text-lg">
                  Caricamento classifica...
                </p>
                <p className="text-gray-500 text-sm">
                  Elaborazione dati in corso
                </p>
              </div>
            </div>
          ) : standings.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium text-lg">
                Nessun dato disponibile
              </p>
              <p className="text-gray-500 mt-2">
                La classifica per questa stagione non è ancora disponibile
              </p>
            </div>
          ) : (
            <div className="p-6">
              {/* Tabella responsive */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <th className="text-left py-4 px-4 font-bold text-gray-700">
                          <div className="flex items-center space-x-2">
                            <span>#</span>
                            <span>Squadra</span>
                          </div>
                        </th>
                        <th className="text-center py-4 px-3 font-bold text-gray-700">
                          <div className="flex items-center justify-center space-x-1">
                            <Target className="w-4 h-4" />
                            <span className="hidden sm:inline">GF</span>
                          </div>
                        </th>
                        <th className="text-center py-4 px-3 font-bold text-gray-700">
                          <div className="flex items-center justify-center space-x-1">
                            <Shield className="w-4 h-4" />
                            <span className="hidden sm:inline">GS</span>
                          </div>
                        </th>
                        <th className="text-center py-4 px-3 font-bold text-gray-700">
                          <div className="flex items-center justify-center space-x-1">
                            <TrendingUp className="w-4 h-4" />
                            <span className="hidden sm:inline">DR</span>
                          </div>
                        </th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">
                          <div className="flex items-center justify-center space-x-1">
                            <Trophy className="w-4 h-4" />
                            <span>Punti</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.map((row, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-200"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${getPositionStyle(
                                  idx
                                )}`}
                              >
                                {getPositionIcon(idx)}
                              </div>
                              <span className="font-medium text-gray-800 text-sm sm:text-base">
                                {row.teamName}
                              </span>
                            </div>
                          </td>
                          <td className="text-center py-4 px-3">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                              {row.goalsFor}
                            </span>
                          </td>
                          <td className="text-center py-4 px-3">
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                              {row.goalsAgainst}
                            </span>
                          </td>
                          <td className="text-center py-4 px-3">
                            <span
                              className={`px-2 py-1 rounded-full text-sm font-medium ${
                                row.goalDifference > 0
                                  ? "bg-blue-100 text-blue-800"
                                  : row.goalDifference < 0
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {row.goalDifference > 0 ? "+" : ""}
                              {row.goalDifference}
                            </span>
                          </td>
                          <td className="text-center py-4 px-4">
                            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-md">
                              {row.points}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Legenda posizioni */}
              <div className="mt-6 bg-gray-50 rounded-2xl p-4">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm">
                  Legenda Posizioni
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500"></div>
                    <span className="text-gray-600">1° Posto</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"></div>
                    <span className="text-gray-600">Champions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
                    <span className="text-gray-600">Europa League</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-red-600"></div>
                    <span className="text-gray-600">Retrocessione</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
