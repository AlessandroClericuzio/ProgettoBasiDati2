"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { League } from "../interface";
import axios from "axios";
import { X, Save, Edit3, Hash, Globe, Trophy, AlertCircle } from "lucide-react";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (league) {
      setName(league.name);
      setError("");
    }
  }, [league]);

  const handleSave = async () => {
    if (!league) return;

    if (!name.trim()) {
      setError("Il nome della lega è obbligatorio");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const updatedLeague = {
        ...league,
        name: name.trim(),
      };

      const res = await axios.put<League>(
        `http://localhost:8080/api/leagues/byLeagueId/${league.leagueId}`,
        updatedLeague
      );
      onLeagueUpdated(res.data);
      onClose();
    } catch (error) {
      setError("Errore durante la modifica del nome della lega");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleSave();
    }
  };

  if (!isOpen || !league) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop con gradiente */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-purple-900/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white max-w-lg w-full rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-5 relative">
            <button
              onClick={onClose}
              disabled={loading}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-full p-2 disabled:opacity-50"
              aria-label="Chiudi"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <Edit3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <Dialog.Title className="text-xl font-bold text-white">
                  Modifica Lega
                </Dialog.Title>
                <p className="text-white/80 text-sm">
                  Aggiorna le informazioni della lega
                </p>
              </div>
            </div>
          </div>

          {/* Contenuto */}
          <div className="p-6 space-y-6">
            {/* Errore */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium text-sm">Errore</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Campo ID Lega (disabled) */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Hash className="w-4 h-4 text-gray-500" />
                <span>ID Lega</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={league.leagueId}
                  disabled
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-mono text-sm cursor-not-allowed"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="bg-gray-300 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                    Read-only
                  </div>
                </div>
              </div>
            </div>

            {/* Campo Nome (editabile) */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Trophy className="w-4 h-4 text-blue-500" />
                <span>Nome Lega</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Inserisci il nome della lega"
                />
                {name.trim() && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Campo ID Paese (disabled) */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Globe className="w-4 h-4 text-gray-500" />
                <span>ID Paese</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={league.countryId}
                  disabled
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-mono text-sm cursor-not-allowed"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="bg-gray-300 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                    Read-only
                  </div>
                </div>
              </div>
            </div>

            {/* Info card */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 rounded-full p-1">
                  <Trophy className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-blue-800 font-medium text-sm">
                    Informazione
                  </p>
                  <p className="text-blue-700 text-sm mt-1">
                    Solo il nome della lega può essere modificato. ID Lega e ID
                    Paese sono campi di sola lettura.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer con pulsanti */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-100">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annulla
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !name.trim()}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salva Modifiche</span>
                </>
              )}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
