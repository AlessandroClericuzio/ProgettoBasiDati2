"use client";

import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import axios from "axios";
import { League } from "../interface";
// Sostituiamo le icone Heroicons con simboli SVG inline

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.post<League>(
        "http://localhost:8080/api/leagues",
        {
          name: name,
          countryId: countryId,
          leagueId: Math.floor(Math.random() * 100000),
        }
      );

      onClose();
      setName("");
      onLeagueAdded(res.data);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        alert("Errore: " + error.response.data);
      } else {
        console.error("Errore nel salvataggio della lega:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/20 transition-colors"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-white/20 p-3">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3s-4.5 4.03-4.5 9 2.015 9 4.5 9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <Dialog.Title className="text-xl font-bold">
                        Aggiungi Nuova Lega
                      </Dialog.Title>
                      <p className="text-blue-100 text-sm mt-1">
                        Crea una nuova lega calcistica
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nome Lega Input */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Nome Lega
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                          placeholder="Inserisci il nome della lega..."
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Country ID Input */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        ID Paese
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={countryId}
                          disabled
                          className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3 text-gray-500 cursor-not-allowed"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        L'ID del paese è automaticamente assegnato
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                      >
                        Annulla
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !name.trim()}
                        className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transform hover:scale-[1.02] disabled:hover:scale-100"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            <span>Salvataggio...</span>
                          </div>
                        ) : (
                          "Crea Lega"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
