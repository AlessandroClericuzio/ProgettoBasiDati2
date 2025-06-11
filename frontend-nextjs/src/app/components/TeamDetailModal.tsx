"use client";

import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Team } from "../interface";
import {
  X,
  Users,
  Hash,
  Globe,
  Trophy,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface TeamDetailsModalProps {
  teamId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const TeamDetailsModal: React.FC<TeamDetailsModalProps> = ({
  teamId,
  isOpen,
  onClose,
}) => {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!teamId || !isOpen) return;

    const fetchTeam = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8080/api/teams/byTeamApiId/${teamId}`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setTeam(data);
      } catch (error) {
        console.error("Errore nel fetch del team:", error);
        setTeam(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [teamId, isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-gradient-to-br from-slate-900/80 via-purple-900/20 to-slate-900/80 backdrop-blur-md"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden relative transform transition-all duration-500 ease-out scale-100 opacity-100 border border-gray-100">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
              aria-label="Chiudi"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-2">
                <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <Dialog.Title className="text-2xl font-bold text-white">
                  Dettagli Squadra
                </Dialog.Title>
              </div>
              <p className="text-blue-100 text-sm">
                Informazioni complete del team
              </p>
            </div>
          </div>

          {/* Contenuto */}
          <div className="p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 font-medium">Caricamento dati</p>
                  <p className="text-gray-400 text-sm">Attendere prego...</p>
                </div>
              </div>
            ) : team ? (
              <div className="space-y-6">
                {/* Nome lungo */}
                <div className="group hover:scale-[1.02] transition-transform duration-300">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border-l-4 border-emerald-500 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="bg-emerald-500 rounded-full p-2 mt-1">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-2">
                          Nome Completo
                        </h3>
                        <p className="text-xl font-bold text-gray-800 leading-tight">
                          {team.teamLongName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nome corto */}
                <div className="group hover:scale-[1.02] transition-transform duration-300">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-500 rounded-full p-2 mt-1">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-2">
                          Nome Abbreviato
                        </h3>
                        <p className="text-xl font-bold text-gray-800">
                          {team.teamShortName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* IDs in griglia */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group hover:scale-[1.02] transition-transform duration-300">
                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 border-l-4 border-purple-500 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-start space-x-4">
                        <div className="bg-purple-500 rounded-full p-2 mt-1">
                          <Hash className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-2">
                            API ID
                          </h3>
                          <p className="text-lg font-bold text-gray-800 font-mono">
                            {team.teamApiId}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group hover:scale-[1.02] transition-transform duration-300">
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border-l-4 border-orange-500 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-start space-x-4">
                        <div className="bg-orange-500 rounded-full p-2 mt-1">
                          <Globe className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-orange-700 uppercase tracking-wide mb-2">
                            FIFA ID
                          </h3>
                          <p className="text-lg font-bold text-gray-800 font-mono">
                            {team.teamFifaApiId}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-lg opacity-30"></div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-gray-800">
                    Squadra non trovata
                  </h3>
                  <p className="text-gray-500">
                    I dati richiesti non sono disponibili
                  </p>
                  <p className="text-gray-400 text-sm">
                    Verifica l'ID e riprova
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer decorativo */}
          <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TeamDetailsModal;
