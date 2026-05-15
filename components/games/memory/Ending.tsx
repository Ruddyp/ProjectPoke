/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useMemo } from "react";
import { MemoryDifficulty } from "@/app/type";
import { Button } from "@/components/ui/button";
import { useMemory } from "@/context/MemoryProvider";
import { addScoreToLeaderboard, replaceScoreLeaderboard } from "@/lib/bdd";
import { formatTime } from "@/lib/utils";
import { Sparkles } from "lucide-react";

type EndingProps = {
  difficulty: MemoryDifficulty;
};

export default function Ending({ difficulty }: EndingProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const {
    setGameStatus,
    score,
    time,
    leaderboard,
    updateLeaderboard,
    addToLeaderboard,
  } = useMemory();

  const difficultyLeaderboard = useMemo(
    () =>
      leaderboard
        .filter((elem) => elem.difficulty === difficulty)
        .sort((a, b) => a.score - b.score || a.time - b.time),
    [leaderboard, difficulty],
  );

  const lastScore = difficultyLeaderboard[difficultyLeaderboard.length - 1];

  const canBeSaveToLeaderboard = useMemo(() => {
    if (difficultyLeaderboard.length < 5) return true;
    return (
      score < lastScore.score ||
      (score === lastScore.score && time < lastScore.time)
    );
  }, [difficultyLeaderboard, score, time, lastScore]);

  const handleScoreUpdate = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      const scoreToPush = { name, difficulty, score, time };
      if (difficultyLeaderboard.length >= 5 && lastScore) {
        const updatedDoc = await replaceScoreLeaderboard(
          lastScore._id!,
          scoreToPush,
        );
        updateLeaderboard(lastScore._id!, updatedDoc);
      } else {
        const newDoc = await addScoreToLeaderboard(scoreToPush);
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
    <div className="flex flex-col size-full items-center justify-center p-4  min-h-[600px] font-sans text-white">
      {/* Titre avec lueur dorée */}
      <div className="relative mb-8 animate-in zoom-in duration-500">
        <h1 className="text-4xl lg:text-6xl font-black italic tracking-tighter text-[#ffcb05] drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] [text-shadow:_0_0_20px_rgba(255,203,5,0.6)]">
          Victoire !
        </h1>
      </div>

      {/* Container Principal (Le cadre jaune de l'image) */}
      <div className="w-full max-w-2xl bg-[#f0f0f0] rounded-[40px] border-[6px] border-[#ffcb05] p-1 shadow-[0_10px_0_0_rgba(0,0,0,0.2)] relative overflow-hidden">
        {/* Séparateur Central Pokéball */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10">
          <div className="size-10 bg-white border-4 border-slate-800 rounded-full flex items-center justify-center shadow-lg">
            <div className="size-3 border-2 border-slate-800 rounded-full" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row bg-white rounded-[32px] overflow-hidden">
          {/* Section Coups */}
          <div className="flex-1 p-8 flex flex-col items-center justify-center border-b-4 lg:border-b-0 lg:border-r-4 border-[#e2e8f0]">
            <h2 className="text-[#4b6d9b] text-xl font-black uppercase mb-2">
              Coups
            </h2>
            <span className="text-4xl lg:text-6xl font-black text-[#e54133]">
              {score}
            </span>
          </div>

          {/* Section Temps */}
          <div className="flex-1 p-8 flex flex-col items-center justify-center">
            <h2 className="text-[#4b6d9b] text-xl font-black uppercase mb-2">
              Temps
            </h2>
            <span className="text-4xl lg:text-5xl font-black text-[#e54133] whitespace-nowrap">
              {formatTime(time).replace("et", "")}
            </span>
          </div>
        </div>
      </div>

      {/* Message de Record (La bannière verte de l'image) */}
      <div className="mt-8 w-full max-w-2xl animate-in slide-in-from-bottom-5 duration-700 delay-300 fill-mode-both">
        {canBeSaveToLeaderboard ? (
          <div className="bg-[#e9f7ef] border-2 border-[#5cb85c] rounded-2xl p-4 flex items-center justify-center gap-3 shadow-sm">
            <Sparkles className="text-[#5cb85c] size-5" />
            <p className="text-[#2d5a2d] font-bold text-base lg:text-lg">
              Nouveau record ! Vous entrez dans le Top 5.
            </p>
            <Sparkles className="text-[#5cb85c] size-5" />
          </div>
        ) : (
          <div className="bg-slate-100/20 border-2 border-white/20 rounded-2xl p-4 text-white text-center italic">
            Dommage ! Il en faut plus pour détrôner les meilleurs...
          </div>
        )}
      </div>

      {/* Formulaire d'enregistrement */}
      {!hasSaved && canBeSaveToLeaderboard && (
        <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full max-w-2xl animate-in fade-in duration-1000">
          <input
            type="text"
            placeholder="Ton blaze de winner..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={15}
            className="flex-1 px-6 py-4 rounded-2xl border-b-4 border-slate-300 text-slate-800 text-lg font-bold focus:outline-none focus:border-[#ffcb05] transition-all"
          />
          <Button
            onClick={handleScoreUpdate}
            disabled={
              isSubmitting || name.trim().length < 2 || name.trim().length > 15
            }
            className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-black px-8 py-7 rounded-2xl border-b-4 border-[#3d8b3d] shadow-lg active:border-b-0 active:translate-y-1 transition-all"
          >
            {isSubmitting ? "Envoi..." : "ENREGISTRER"}
          </Button>
        </div>
      )}

      {hasSaved && (
        <div className="mt-6 p-4 bg-blue-500 rounded-2xl font-black text-white shadow-lg">
          SCORE ENREGISTRÉ !
        </div>
      )}

      {/* Bouton Rejouer style Pokémon */}
      <Button
        onClick={() => setGameStatus("waiting")}
        className="mt-5 lg:mt-10 bg-[#5cb85c] hover:bg-[#4cae4c] text-white text-sm lg:text-xl font-black px-6 lg:px-12 py-6 lg:py-8 rounded-full border-b-[6px] border-[#3d8b3d] shadow-[0_8px_20px_rgba(92,184,92,0.4)] transition-all hover:-translate-y-1 active:translate-y-1 active:border-b-0"
      >
        DÉMARRER UNE NOUVELLE PARTIE
      </Button>
    </div>
  );
}
