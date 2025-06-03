import React, { useState } from "react";
import { MatchWithDetails, League } from "../interface";
import MatchCard from "./MatchCard";
import { ChevronDown } from "lucide-react";

interface Props {
  league: League;
  matches: MatchWithDetails[];
  onLeagueClick: () => void; // callback passata dal parent
}

export default function LeagueAccordion({
  league,
  matches,
  onLeagueClick,
}: Props) {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center bg-gray-100 px-4 py-2 hover:bg-gray-200"
        aria-expanded={open}
      >
        <span
          onClick={(e) => {
            e.stopPropagation(); // evita toggle accordion
            onLeagueClick(); // triggera callback per aprire il modal dal parent
          }}
          className="font-medium text-gray-800 hover:underline cursor-pointer"
        >
          {league.name}
        </span>

        <ChevronDown
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          size={20}
          aria-label={open ? "Chiudi sezione" : "Apri sezione"}
        />
      </button>

      {open && (
        <div className="p-4 space-y-3">
          {matches.map((m) => (
            <MatchCard key={m.match.id} matchData={m} />
          ))}
        </div>
      )}
    </div>
  );
}
