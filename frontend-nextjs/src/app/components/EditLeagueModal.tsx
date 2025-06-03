"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { League } from "../interface";
import axios from "axios";

interface EditLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
  league: League | null;
  onLeagueUpdated: (updatedLeague: League) => void;
}

export default function EditLeagueModal({
  isOpen,
  onClose,
  league,
  onLeagueUpdated,
}: EditLeagueModalProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (league) {
      setName(league.name);
    }
  }, [league]);

  const handleSave = async () => {
    if (!league) return;

    try {
      const updatedLeague = {
        ...league,
        name,
      };

      const res = await axios.put<League>(
        `http://localhost:8080/api/leagues/byLeagueId/${league.leagueId}`,
        updatedLeague
      );
      onLeagueUpdated(res.data);
      onClose();
    } catch (error) {
      alert("Errore durante la modifica del nome della lega");
    }
  };

  if (!isOpen || !league) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg shadow p-6 max-w-md w-full">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Modifica Nome della Lega
          </Dialog.Title>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Lega
            </label>
            <input
              type="text"
              value={league.leagueId}
              disabled
              className="border p-2 rounded w-full bg-gray-100 text-gray-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Nome lega"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Paese
            </label>
            <input
              type="number"
              value={league.countryId}
              disabled
              className="border p-2 rounded w-full bg-gray-100 text-gray-500"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Annulla
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Salva
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
