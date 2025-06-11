"use client";

import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { League } from "../interface";
import { X, Trash2, Pencil, Trophy, Globe, Hash } from "lucide-react";

interface LeagueDetailsModalProps {
  leagueId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onEditClick?: () => void; // callback per aprire form modifica
  onDelete?: (leagueId: number) => void;
}

const LeagueDetailsModal: React.FC<LeagueDetailsModalProps> = ({
  leagueId,
  isOpen,
  onClose,
  onEditClick,
  onDelete,
}) => {
  const [league, setLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!leagueId || !isOpen) return;

    const fetchLeague = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8080/api/leagues/byLeagueId/${leagueId}`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setLeague(data);
      } catch (error) {
        console.error("Errore nel fetch della league:", error);
        setLeague(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLeague();
  }, [leagueId, isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop con gradiente */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-slate-900/50 via-blue-900/30 to-purple-900/50 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white max-w-lg w-full rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-4 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-full p-1"
              aria-label="Chiudi"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <Dialog.Title className="text-xl font-bold text-white">
                Dettagli Lega
              </Dialog.Title>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <p className="text-gray-600 ml-4 font-medium">Caricamento...</p>
              </div>
            ) : league ? (
              <div className="space-y-6">
                {/* League Name Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500 rounded-full p-2">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-600 mb-1">
                        Nome Lega
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {league.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <Hash className="w-4 h-4 text-gray-500" />
                      <p className="text-sm font-medium text-gray-600">
                        League ID
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {league.leagueId}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <p className="text-sm font-medium text-gray-600">
                        Country ID
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {league.countryId}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => onEditClick?.()}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    aria-label="Modifica"
                  >
                    <Pencil className="w-4 h-4" />
                    <span>Modifica</span>
                  </button>

                  <button
                    onClick={() => onDelete?.(league.leagueId)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    aria-label="Elimina"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Elimina</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-red-600 font-medium text-lg">
                  Lega non trovata
                </p>
                <p className="text-gray-500 mt-2">
                  Impossibile caricare i dettagli della lega richiesta.
                </p>
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default LeagueDetailsModal;
