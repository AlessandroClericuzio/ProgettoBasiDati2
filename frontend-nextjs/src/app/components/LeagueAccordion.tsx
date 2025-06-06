import React, { useState } from "react";
import { MatchWithDetails, League } from "../interface";
import MatchCard from "./MatchCard";
import { ChevronDown } from "lucide-react";
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
    <div className="border rounded-lg overflow-hidden">
      <div className="w-full flex justify-between items-center bg-gray-100 px-4 py-2 hover:bg-gray-200">
        <div className="flex items-center space-x-4">
          <span
            onClick={(e) => {
              e.stopPropagation();
              onLeagueClick();
            }}
            className="font-medium text-gray-800 hover:underline cursor-pointer"
          >
            {league.name}
          </span>

          <button
            onClick={() => setIsStandingsOpen(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            Classifica
          </button>
        </div>

        <ChevronDown
          onClick={() => setOpen(!open)}
          className={`cursor-pointer transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          size={20}
          aria-label={open ? "Chiudi sezione" : "Apri sezione"}
        />
      </div>

      {open && (
        <div className="p-4 space-y-3">
          {matches.map((m) => (
            <MatchCard key={m.match.id} matchData={m} />
          ))}
        </div>
      )}

      {/* Modal classifica */}
      {isStandingsOpen && (
        <StandingsModal
          league={league}
          onClose={() => setIsStandingsOpen(false)}
        />
      )}
    </div>
  );
}
