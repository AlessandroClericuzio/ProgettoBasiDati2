"use client";

import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Team } from "../interface";
import { X } from "lucide-react";

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
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white max-w-md w-full rounded-2xl shadow-xl p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            aria-label="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>

          <Dialog.Title className="text-lg font-semibold mb-4">
            Dettagli Squadra
          </Dialog.Title>

          {loading ? (
            <p className="text-gray-500">Caricamento...</p>
          ) : team ? (
            <div className="space-y-2">
              <p>
                <strong>Nome lungo:</strong> {team.teamLongName}
              </p>
              <p>
                <strong>Nome corto:</strong> {team.teamShortName}
              </p>
              <p>
                <strong>Team API ID:</strong> {team.teamApiId}
              </p>
              <p>
                <strong>Team FIFA API ID:</strong> {team.teamFifaApiId}
              </p>
            </div>
          ) : (
            <p className="text-red-500">Squadra non trovata.</p>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TeamDetailsModal;
