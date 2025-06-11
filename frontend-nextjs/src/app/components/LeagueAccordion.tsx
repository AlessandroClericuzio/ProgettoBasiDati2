import React, { useState } from "react";
import { MatchWithDetails, League } from "../interface";
import MatchCard from "./MatchCard";
import { ChevronDown, Trophy, BarChart3, Eye } from "lucide-react";
import StandingsModal from "./StandingsModal";

interface Props {
  league: League;
  matches: MatchWithDetails[];
  onLeagueClick: () => void;
}

export default function LeagueAccordion({
  league,
  matches,
  onLeagueClick,
}: Props) {
  const [open, setOpen] = useState<boolean>(true);
  const [isStandingsOpen, setIsStandingsOpen] = useState<boolean>(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Header con gradiente */}
      <div
        className="w-full flex justify-between items-center bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 px-6 py-4 hover:from-slate-100 hover:via-blue-100 hover:to-indigo-100 transition-all duration-300 cursor-pointer border-b border-gray-100"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center space-x-4">
          {/* Icona della lega */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-2 shadow-md">
            <Trophy className="w-5 h-5 text-white" />
          </div>

          {/* Nome della lega */}
          <div className="flex flex-col">
            <span
              onClick={(e) => {
                e.stopPropagation();
                onLeagueClick();
              }}
              className="font-bold text-gray-800 hover:text-blue-600 cursor-pointer transition-colors duration-200 text-lg group"
            >
              {league.name}
              <Eye className="inline w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </span>
            <span className="text-sm text-gray-500">
              {matches.length} {matches.length === 1 ? "partita" : "partite"}
            </span>
          </div>

          {/* Pulsante classifica */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsStandingsOpen(true);
            }}
            className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-full transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Classifica</span>
          </button>
        </div>

        {/* Chevron con animazione migliorata */}
        <div className="bg-white rounded-full p-2 shadow-md border border-gray-200 hover:border-gray-300 transition-all duration-200">
          <ChevronDown
            className={`transition-transform duration-300 text-gray-600 ${
              open ? "rotate-180" : ""
            }`}
            size={20}
            aria-label={open ? "Chiudi sezione" : "Apri sezione"}
          />
        </div>
      </div>

      {/* Contenuto con animazione */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          open
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        {open && (
          <div className="p-6 bg-gradient-to-b from-gray-50/30 to-white">
            {matches.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">
                  Nessuna partita disponibile
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Le partite verranno mostrate quando disponibili
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((m, index) => (
                  <div
                    key={m.match.id}
                    className="transform transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: open
                        ? "fadeInUp 0.3s ease-out forwards"
                        : "none",
                    }}
                  >
                    <MatchCard matchData={m} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal classifica */}
      {isStandingsOpen && (
        <StandingsModal
          league={league}
          onClose={() => setIsStandingsOpen(false)}
        />
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
