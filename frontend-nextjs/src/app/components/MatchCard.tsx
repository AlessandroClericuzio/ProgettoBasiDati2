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

  const formattedDate = new Date(match.date).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const openTeamModal = (teamApiId: number) => {
    setSelectedTeamId(teamApiId);
    setIsModalOpen(true);
  };

  // Determina se la partita è terminata (ha dei goal)
  const isCompleted = match.homeTeamGoal !== null && match.awayTeamGoal !== null;
  const homeWin = isCompleted && match.homeTeamGoal > match.awayTeamGoal;
  const awayWin = isCompleted && match.awayTeamGoal > match.homeTeamGoal;
  const isDraw = isCompleted && match.homeTeamGoal === match.awayTeamGoal;

  return (
    <>
      <div className="group bg-white hover:bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 px-6 py-5 mb-4 w-full border border-gray-100 hover:border-gray-200">
        <div className="flex items-center">
          {/* Data della partita */}
          <div className="flex flex-col justify-center items-center text-center w-20 flex-shrink-0 mr-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg px-3 py-2 border border-blue-100">
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                {new Date(match.date).toLocaleDateString('it-IT', { month: 'short' })}
              </div>
              <div className="text-lg font-bold text-gray-800">
                {new Date(match.date).getDate()}
              </div>
            </div>
          </div>

          {/* Contenuto principale della partita */}
          <div className="flex flex-col flex-grow">
            {/* Squadra di casa */}
            <div className="flex justify-between items-center mb-3">
              <button
                onClick={() => openTeamModal(homeTeam.teamApiId)}
                className={`text-gray-800 hover:text-blue-600 transition-colors duration-200 truncate flex-grow min-w-0 text-left font-medium text-base group-hover:translate-x-1 transform $
                  homeWin ? 'text-green-700 font-semibold' : ''
                }`}
              >
                <div className="flex items-center">
                  <span className="truncate">{homeTeam.teamLongName}</span>
                  {homeWin && (
                    <div className="ml-2 w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  )}
                </div>
              </button>
              <div className="flex items-center ml-4">
                <span className={`text-2xl font-bold flex-shrink-0 ${
                  isCompleted
                    ? homeWin
                      ? 'text-green-600'
                      : isDraw
                      ? 'text-gray-600'
                      : 'text-gray-500'
                    : 'text-gray-400'
                }`}>
                  {match.homeTeamGoal ?? '-'}
                </span>
              </div>
            </div>

            {/* Divisore centrale */}
            <div className="flex items-center mb-3">
              <div className="flex-grow h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
              <div className="mx-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                VS
              </div>
              <div className="flex-grow h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
            </div>

            {/* Squadra ospite */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => openTeamModal(awayTeam.teamApiId)}
                className={`text-gray-800 hover:text-blue-600 transition-colors duration-200 truncate flex-grow min-w-0 text-left font-medium text-base group-hover:translate-x-1 transform ${
                  awayWin ? 'text-green-700 font-semibold' : ''
                }`}
              >
                <div className="flex items-center">
                  <span className="truncate">{awayTeam.teamLongName}</span>
                  {awayWin && (
                    <div className="ml-2 w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  )}
                </div>
              </button>
              <div className="flex items-center ml-4">
                <span className={`text-2xl font-bold flex-shrink-0 ${
                  isCompleted
                    ? awayWin
                      ? 'text-green-600'
                      : isDraw
                      ? 'text-gray-600'
                      : 'text-gray-500'
                    : 'text-gray-400'
                }`}>
                  {match.awayTeamGoal ?? '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Indicatore di stato della partita */}
          <div className="flex flex-col items-center ml-4 w-16 flex-shrink-0">
            {isCompleted ? (
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mb-1 animate-pulse"></div>
                <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                  Finita
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full mb-1"></div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Prevista
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer con informazioni aggiuntive */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span className="font-medium">{league.name}</span>
            <span>{formattedDate}</span>
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