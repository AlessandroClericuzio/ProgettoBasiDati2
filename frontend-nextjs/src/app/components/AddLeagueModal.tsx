// src/components/AddLeagueModal.tsx

"use client";

import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { League } from "../interface";

interface AddLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
  countryId: number;
  onLeagueAdded: (league: League) => void;
}

export default function AddLeagueModal({
  isOpen,
  onClose,
  countryId,
  onLeagueAdded,
}: AddLeagueModalProps) {
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post<League>(
        "http://localhost:8080/api/leagues",
        {
          name: name,
          countryId: countryId, // PROP corrisponde a Java: private int countryId;
          leagueId: Math.floor(Math.random() * 100000), // GENERAZIONE CLIENT–SIDE
        }
      );

      // 1) chiudo la modale
      onClose();
      // 2) resetto l'input
      setName("");
      // 3) aggiorno la lista in HomePage tramite callback
      onLeagueAdded(res.data);
    } catch (error: any) {
      // Se riceve 409 Conflict con messaggio di duplicato, alert user
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        alert("Errore: " + error.response.data);
      } else {
        console.error("Errore nel salvataggio della lega:", error);
      }
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <Dialog.Panel className="bg-white p-6 rounded shadow-xl w-full max-w-md">
        <Dialog.Title className="text-xl font-bold mb-4">
          Aggiungi Lega
        </Dialog.Title>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block font-semibold">Nome Lega</label>
            <input
              type="text"
              className="w-full border px-2 py-1 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Country ID (bloccato)</label>
            <input
              type="number"
              value={countryId}
              disabled
              className="w-full border px-2 py-1 rounded bg-gray-100"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Salva
            </button>
          </div>
        </form>
      </Dialog.Panel>
    </Dialog>
  );
}
