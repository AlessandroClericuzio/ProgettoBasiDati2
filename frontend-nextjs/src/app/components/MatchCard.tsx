"use client";

import React, { useState } from "react";
import { MatchWithDetails } from "../interface";
import TeamDetailsModal from "./TeamDetailModal";

interface Props {
  matchData: MatchWithDetails;
}

const MatchCard: React.FC<Props> = ({ matchData }) => {
  const { match, league, homeTeam, awayTeam } = matchData;

  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!league || !homeTeam || !awayTeam) return null;

  const formattedDate = new Date(match.date).toLocaleDateString();

  const openTeamModal = (teamApiId: number) => {
    setSelectedTeamId(teamApiId);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm px-6 py-4 mb-3 w-full">
        <div className="flex items-center">
          <div className="flex flex-col justify-center items-start text-sm text-gray-500 font-medium w-24 flex-shrink-0 mr-4">
            {formattedDate}
          </div>
          <div className="flex flex-col flex-grow pr-12">
            <div className="flex justify-between items-center text-base mb-1">
              <button
                onClick={() => openTeamModal(homeTeam.teamApiId)}
                className="text-gray-800 hover:underline truncate flex-grow min-w-0 text-left"
              >
                {homeTeam.teamLongName}
              </button>
              <span className="text-lg font-semibold flex-shrink-0 ml-2">
                {match.homeTeamGoal}
              </span>
            </div>

            <div className="flex justify-between items-center text-base">
              <button
                onClick={() => openTeamModal(awayTeam.teamApiId)}
                className="text-gray-800 hover:underline truncate flex-grow min-w-0 text-left"
              >
                {awayTeam.teamLongName}
              </button>
              <span className="text-lg font-semibold flex-shrink-0 ml-2">
                {match.awayTeamGoal}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal TeamDetails */}
      <TeamDetailsModal
        teamId={selectedTeamId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default MatchCard;
