/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { usePokeBattle } from "@/context/PokeBattleProvider";
import {
  addScoreToPokeBattleLeaderboard,
  replaceScoreToPokeBattleLeaderboard,
} from "@/lib/bdd";
import { calculateFinalBattleScore } from "@/lib/utils";
import { Sparkles, HeartCrack } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import Score from "./Score";

export default function Ending() {
  const {
    userPokemons,
    enemyPokemons,
    leaderboard,
    trainer,
    enemyScore,
    userScore,
    rematchProposed,
    opponentWantsRematch,
    battleMode,
    opponentForfait,
    goToWaitingScreen,
    addToLeaderboard,
    updateLeaderboard,
    handleRequestRematch,
  } = usePokeBattle();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const isUserWin =
    opponentForfait || userPokemons.some((poke) => poke.currentHp > 0);
  const scoreObject = calculateFinalBattleScore(
    userPokemons,
    enemyPokemons,
    enemyScore,
    userScore,
  );

  const difficulty = trainer?.name ?? "Random";

  useEffect(() => {
    let timer = setTimeout(() => {
      const audioSrc = trainer
        ? trainer.victoryAudioSrc
        : "/sounds/victory.mp3";
      const victoryAudio = new Audio(audioSrc);
      victoryAudio.volume = 0.05;
      victoryAudio.play().catch((e) => console.warn("Auto-play bloqué :", e));
      audioRef.current = victoryAudio;
    }, 800);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, [trainer]);

  const difficultyLeaderboard = useMemo(
    () =>
      leaderboard
        .filter((elem) => elem.difficulty === difficulty)
        .sort((a, b) => b.score - a.score),
    [leaderboard, difficulty],
  );

  const lastScore = difficultyLeaderboard[difficultyLeaderboard.length - 1];

  const canBeSaveToLeaderboard = useMemo(() => {
    if (battleMode === "pvp" || !isUserWin) return false;
    if (difficultyLeaderboard.length < 5) return true;
    return scoreObject.finalScore > lastScore.score;
  }, [
    difficultyLeaderboard,
    lastScore,
    isUserWin,
    scoreObject.finalScore,
    battleMode,
  ]);

  const handleScoreUpdate = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      const scoreToPush = { name, difficulty, score: scoreObject.finalScore };
      if (difficultyLeaderboard.length >= 5 && lastScore) {
        const updatedDoc = await replaceScoreToPokeBattleLeaderboard(
          lastScore._id!,
          scoreToPush,
        );
        updateLeaderboard(lastScore._id!, updatedDoc);
      } else {
        const newDoc = await addScoreToPokeBattleLeaderboard(scoreToPush);
        addToLeaderboard(newDoc);
      }
      setHasSaved(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#2b2b2b] animate-in fade-in duration-1000">
      <div className="absolute w-[150%] h-2 bg-red-600 rotate-[-15deg] z-0 shadow-[0_0_20px_rgba(220,38,38,0.8)]" />

      <div className="z-10 flex flex-col items-center gap-2 sm:gap-4 p-6 sm:p-10 bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-700 shadow-2xl">
        <h1 className="text-4xl sm:text-7xl font-black text-white italic tracking-tighter drop-shadow-[0_4px_0_rgba(220,38,38,1)] text-center uppercase">
          {opponentForfait
            ? "VICTOIRE PAR FORFAIT !"
            : isUserWin
              ? "VICTOIRE !"
              : "DEFAITE !"}
        </h1>

        <div className="h-px w-32 bg-red-600 my-2" />

        <p className="text-base sm:text-xl text-slate-300 font-bold tracking-[0.2em] uppercase text-center max-w-md">
          {opponentForfait
            ? "L'adversaire a fui le combat."
            : isUserWin
              ? "Le combat est remporté"
              : "Le combat est perdu"}
        </p>

        {((isUserWin && battleMode === "pve") || battleMode === "pvp") && (
          <Score />
        )}

        {/* Section Record  */}
        <div className="mt-8 w-full max-w-2xl">
          {canBeSaveToLeaderboard && (
            <div className="bg-slate-800 border-2 border-[#E0A850] rounded-xl p-4 flex items-center justify-center gap-3 shadow-lg">
              <Sparkles className="text-[#E0A850] size-5" />
              <p className="text-[#E0A850] font-bold text-base lg:text-lg tracking-widest uppercase">
                Nouveau record : Top 5 atteint !
              </p>
              <Sparkles className="text-[#E0A850] size-5" />
            </div>
          )}

          {battleMode === "pvp" && opponentForfait && (
            <div className="bg-slate-950/80 border border-red-900/60 rounded-xl p-4 flex items-center justify-center gap-3 shadow-inner text-red-400 font-bold text-xs uppercase tracking-widest animate-pulse">
              <HeartCrack className="size-4 text-red-500" />
              Pas de pitié pour les lâches !
            </div>
          )}

          {battleMode === "pve" && !canBeSaveToLeaderboard && (
            <div className="text-slate-400 text-center font-bold tracking-widest uppercase text-sm">
              Dommage ! Il en faut plus pour détrôner les meilleurs...
            </div>
          )}
        </div>

        {/* Formulaire d'enregistrement */}
        {!hasSaved && canBeSaveToLeaderboard && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full max-w-2xl animate-in fade-in duration-1000">
            <input
              type="text"
              placeholder="Ton blaze..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={15}
              className="flex-1 px-6 py-4 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-lg font-bold focus:outline-none focus:border-[#E0A850] transition-all placeholder:text-slate-600"
            />
            <Button
              onClick={handleScoreUpdate}
              disabled={
                isSubmitting ||
                name.trim().length < 2 ||
                name.trim().length > 15
              }
              className="bg-[#E0A850] hover:bg-[#c6943f] text-slate-900 font-black px-8 py-7 rounded-xl shadow-lg active:translate-y-1 transition-all"
            >
              {isSubmitting ? "ENVOI..." : "ENREGISTRER"}
            </Button>
          </div>
        )}

        {hasSaved && (
          <div className="mt-6 p-4 bg-slate-800 border-2 border-[#E0A850] rounded-xl font-black text-[#E0A850] tracking-widest uppercase shadow-lg">
            Score enregistré !
          </div>
        )}

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 w-full justify-center">
          {/* BOUTON REMATCH (Uniquement en PvP et si l'adversaire n'a pas ragequit) */}
          {battleMode === "pvp" && !opponentForfait && (
            <button
              onClick={handleRequestRematch}
              disabled={rematchProposed}
              className={`px-8 sm:px-10 py-3 font-black text-lg rounded border-2 transition-all active:scale-95 uppercase tracking-wider ${
                opponentWantsRematch
                  ? "bg-[#E0A850] text-slate-900 border-[#c6943f] animate-pulse hover:scale-105"
                  : rematchProposed
                    ? "bg-slate-800 text-slate-500 border-slate-700 pointer-events-none"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-700 hover:scale-105"
              }`}
            >
              {rematchProposed
                ? "Attente de l'adversaire..."
                : opponentWantsRematch
                  ? "Accepter la Revanche !"
                  : "Proposer une Revanche"}
            </button>
          )}

          <button
            onClick={goToWaitingScreen}
            className="px-8 sm:px-10 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg rounded border-2 border-slate-600 hover:border-slate-400 transition-all hover:scale-105 active:scale-95"
          >
            REVENIR AU MENU
          </button>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_50%,_rgba(220,38,38,0.2),_transparent)] animate-pulse" />
    </div>
  );
}
