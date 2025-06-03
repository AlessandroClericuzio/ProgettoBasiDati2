"use client";

import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { League } from "../interface";
import { X, Trash2, Pencil } from "lucide-react";

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

          {/* Titolo + icone in una riga */}
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold">
              Dettagli Lega
            </Dialog.Title>
            {league && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEditClick?.()}
                  className="text-blue-500 hover:text-blue-700"
                  aria-label="Modifica"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete?.(league.leagueId)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Elimina"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <p className="text-gray-500">Caricamento...</p>
          ) : league ? (
            <div className="space-y-2">
              <p>
                <strong>Nome:</strong> {league.name}
              </p>
              <p>
                <strong>League ID:</strong> {league.leagueId}
              </p>
              <p>
                <strong>Country ID:</strong> {league.countryId}
              </p>
            </div>
          ) : (
            <p className="text-red-500">Lega non trovata.</p>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default LeagueDetailsModal;
