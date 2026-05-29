"use client";

import { usePokeBattle } from "@/context/PokeBattleProvider";
import { useState, useEffect } from "react";
import { ArrowLeft, Radio, Sword } from "lucide-react";

export default function Room() {
  const [roomInput, setRoomInput] = useState<string>("");
  const [statut, setStatut] = useState<string>("HORS-LIGNE");
  const [countdown, setCountdown] = useState<number | null>(null);

  const {
    setBattleMode,
    socket,
    opponentSocketId,
    gameStatus,
    roomActuelle,
    setRoomActuelle,
  } = usePokeBattle();

  // Écouteur 1 : Déclenche le compte à rebours dès que l'adversaire arrive
  useEffect(() => {
    if (opponentSocketId) {
      setCountdown(5);
    } else {
      setCountdown(null); // Reset si l'adversaire quitte pendant le décompte
    }
  }, [opponentSocketId]);

  // Écouteur 2 : Timer de début de match
  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Gestion de l'affichage du statut textuel en fonction des states globaux
  useEffect(() => {
    if (!socket) {
      setStatut("HORS-LIGNE");
    } else if (roomActuelle && !opponentSocketId) {
      setStatut("EN ATTENTE D'UN AMI...");
    } else if (opponentSocketId) {
      setStatut(
        countdown !== null && countdown > 0
          ? `COMBAT DANS ${countdown}S...`
          : "MATCH TROUVÉ !",
      );
    } else {
      setStatut("CONNECTÉ AVEC SUCCÈS");
    }
  }, [socket, roomActuelle, opponentSocketId, countdown]);

  const rejoindrePartie = () => {
    if (roomInput.trim() !== "" && socket) {
      socket.emit("join_room", roomInput);
      setRoomActuelle(roomInput);
      setBattleMode("pvp");
    }
  };

  const quitterPartie = () => {
    if (socket && roomActuelle) {
      socket.emit("leave_room", roomActuelle);
    }
    setRoomActuelle("");
    setRoomInput("");
    setBattleMode("pve");
  };

  const isReadyToStart =
    gameStatus === "presentation" || opponentSocketId !== null;

  return (
    <div className="w-full max-w-md font-mono select-none">
      <div className="bg-slate-900 border-[3px] border-slate-600 rounded-md p-5 shadow-2xl relative overflow-hidden">
        {/* Indicateur de Statut Réseau */}
        <div className="flex items-center gap-2 mb-4 bg-slate-950/60 p-2 rounded border border-slate-800">
          <Radio
            className={`size-4 ${isReadyToStart ? "text-red-500 animate-ping" : roomActuelle ? "text-yellow-500 animate-pulse" : "text-emerald-400"}`}
          />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            RÉSEAU :{" "}
            <span
              className={
                isReadyToStart
                  ? "text-red-500 font-black"
                  : roomActuelle
                    ? "text-yellow-400"
                    : "text-emerald-400"
              }
            >
              {statut}
            </span>
          </p>
        </div>

        {!roomActuelle ? (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            <input
              type="text"
              maxLength={15}
              placeholder="CODE DE LA ROOM (EX: PIKA123)"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value.toUpperCase())}
              className="px-4 py-3 rounded bg-slate-950 border-2 border-slate-700 focus:outline-none focus:border-[#E0A850] text-white font-bold text-center uppercase tracking-widest placeholder:text-slate-600 transition-colors"
            />
            <button
              onClick={rejoindrePartie}
              disabled={!roomInput.trim()}
              className="h-14 bg-slate-800 border-[3px] border-slate-600 rounded-md flex items-center justify-center text-white font-black uppercase tracking-widest hover:border-[#E0A850] hover:bg-slate-700 transition-all shadow-lg active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            >
              Créer / rejoindre une partie
            </button>
          </div>
        ) : (
          <div className="text-center py-4 flex flex-col items-center gap-6 animate-in zoom-in-95 duration-200">
            {isReadyToStart ? (
              <div className="flex flex-col items-center gap-3 text-red-500">
                <Sword
                  className={`size-12 stroke-[2.5] ${countdown !== null && countdown > 0 ? "animate-pulse" : "animate-bounce"}`}
                />
                <div className="space-y-1 text-center">
                  <h3 className="text-xl font-black uppercase tracking-widest">
                    {countdown === 0
                      ? "C'EST PARTI !"
                      : "PRÉPARATION DU COMBAT..."}
                  </h3>
                  {countdown !== null && countdown > 0 && (
                    <span className="text-4xl font-extrabold text-[#E0A850] block animate-bounce drop-shadow-[0_4px_0_rgba(0,0,0,1)]">
                      {countdown}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-widest">
                    Identifiant de session
                  </p>
                  <p className="text-2xl font-black text-[#E0A850] uppercase tracking-wider bg-slate-950 px-4 py-2 rounded border border-slate-800 shadow-inner">
                    {roomActuelle}
                  </p>
                </div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse max-w-[280px]">
                  Transmettez ce code à votre ami. Le combat débutera dès sa
                  connexion.
                </div>
              </>
            )}

            {!isReadyToStart && (
              <button
                onClick={quitterPartie}
                className="mt-2 flex items-center gap-2 px-4 py-2 bg-slate-950 border-2 border-red-900/60 hover:border-red-600 text-red-500 hover:text-red-400 text-xs font-black uppercase tracking-widest rounded transition-all active:scale-95"
              >
                <ArrowLeft className="size-4" />
                Retour au mode Solo
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
