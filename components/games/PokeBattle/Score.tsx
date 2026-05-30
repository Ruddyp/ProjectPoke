/* eslint-disable react/no-unescaped-entities */
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePokeBattle } from "@/context/PokeBattleProvider";
import { calculateFinalBattleScore } from "@/lib/utils";
import { ShieldQuestion } from "lucide-react";
import { useState } from "react";

export default function Score() {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const { userPokemons, enemyPokemons, enemyScore, userScore } =
    usePokeBattle();
  const scoreObject = calculateFinalBattleScore(
    userPokemons,
    enemyPokemons,
    enemyScore,
    userScore,
  );
  return (
    <div className="flex items-center gap-1 bg-slate-800/50 border-2 border-red-600 rounded-xl p-4 text-slate-200 text-center font-semibold tracking-widest uppercase text-sm">
      Votre score:{" "}
      <span className="font-extrabold text-base text-slate-50">
        {scoreObject.finalScore}
      </span>
      <TooltipProvider delayDuration={200}>
        <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
          <TooltipTrigger
            asChild
            onClick={() => {
              // Sur mobile, le clic alterne entre ouvert et fermé
              if (window.matchMedia("(max-width: 768px)").matches) {
                setIsTooltipOpen(!isTooltipOpen);
              }
            }}
            onPointerDown={(e) => {
              // Empêche Radix UI de déclencher le comportement par défaut au toucher sur mobile
              if (window.matchMedia("(max-width: 768px)").matches) {
                e.preventDefault();
              }
            }}
          >
            <button
              type="button"
              className="text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
            >
              <ShieldQuestion className="size-5" />
            </button>
          </TooltipTrigger>

          <TooltipContent
            side="bottom"
            align="center"
            className="bg-slate-900 border-2 border-slate-700 shadow-xl p-0 mx-4 overflow-hidden w-72 sm:w-80"
          >
            <div className="flex flex-col">
              {/* En-tête */}
              <div className="bg-slate-800 p-2 text-center border-b border-slate-700">
                <p className="text-slate-200 font-bold tracking-widest uppercase text-xs">
                  Détail du Score
                </p>
              </div>

              {/* Section Ennemi */}
              <div className="p-2 sm:p-4 bg-red-950/30 flex justify-between items-center border-b border-slate-800 relative">
                <div className="flex flex-col">
                  <span className="text-red-400 text-xs font-bold uppercase tracking-wider">
                    Puissance Ennemi
                  </span>
                  <span className="text-slate-400 text-xs mt-0.5">
                    {enemyScore} × {scoreObject.enemyTypeMultiplier.toFixed(2)}
                  </span>
                </div>
                <span className="text-red-400 font-black text-xl">
                  {Math.round(enemyScore * scoreObject.enemyTypeMultiplier)}
                </span>
              </div>

              {/* Signe MOINS visuel */}
              <div className="flex justify-center -my-3 relative z-10 pointer-events-none">
                <div className="bg-slate-800 rounded-full size-7 flex items-center justify-center border-2 border-slate-600 shadow-md">
                  <span className="text-slate-300 font-black text-xl leading-none mb-0.5">
                    -
                  </span>
                </div>
              </div>

              {/* Section Joueur */}
              <div className="p-2 sm:p-4 bg-emerald-950/30 flex justify-between items-center border-b border-slate-800">
                <div className="flex flex-col">
                  <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    Puissance Joueur
                  </span>
                  <span className="text-slate-400 text-xs mt-0.5">
                    {userScore} × {scoreObject.userTypeMultiplier.toFixed(2)}
                  </span>
                </div>
                <span className="text-emerald-400 font-black text-xl">
                  {Math.round(userScore * scoreObject.userTypeMultiplier)}
                </span>
              </div>

              {/* Signe PLUS visuel */}
              <div className="flex justify-center -my-3 relative z-10 pointer-events-none">
                <div className="bg-slate-800 rounded-full size-7 flex items-center justify-center border-2 border-slate-600 shadow-md">
                  <span className="text-slate-300 font-black text-xl leading-none mb-0.5">
                    +
                  </span>
                </div>
              </div>

              {/* NOUVEAU : Section Bonus de Survie */}
              <div className="p-2 sm:p-4 bg-cyan-950/30 flex justify-between items-center border-b border-slate-800">
                <div className="flex flex-col">
                  <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">
                    Bonus de Survie
                  </span>
                  <span className="text-slate-400 text-xs mt-0.5">
                    Adversité : ×{scoreObject.powerRatio.toFixed(2)}
                  </span>
                </div>
                <span className="text-cyan-400 font-black text-xl">
                  +{Math.round(scoreObject.survivalBonus)}
                </span>
              </div>

              {/* Résultat Final */}
              <div className="p-2 sm:p-4 bg-slate-800 flex justify-between items-center border-b border-slate-700">
                <div className="flex flex-col">
                  <span className="text-[#E0A850] text-sm font-bold uppercase tracking-wider">
                    Score Final
                  </span>
                  <span className="text-slate-500 text-[9px] uppercase font-bold tracking-widest mt-0.5">
                    (Ennemi - Joueur) + Bonus
                  </span>
                </div>
                <span
                  className={`font-black text-3xl drop-shadow-[0_2px_0_rgba(0,0,0,1)] ${scoreObject.finalScore < 0 ? "text-red-500" : "text-[#E0A850]"}`}
                >
                  {scoreObject.finalScore > 0 ? "+" : ""}
                  {scoreObject.finalScore}
                </span>
              </div>

              {/* SECTION EXPLICATIONS / LÉGENDE */}
              <div className="p-2 sm:p-4 bg-slate-950/50 text-xs text-slate-400 space-y-3 font-medium tracking-normal normal-case text-left">
                <p className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                  Comprendre les variables :
                </p>

                <div className="space-y-1">
                  <p className="text-slate-200 font-bold">
                    📊 Chiffre de base{" "}
                    <span className="text-slate-500 font-normal">
                      ({userScore} / {enemyScore})
                    </span>
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    La <strong>Puissance Brute</strong> initiale de chaque
                    équipe (statistiques offensives et défensives globales).
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-slate-200 font-bold">
                    ⚔️ Le Multiplicateur{" "}
                    <span className="text-slate-500 font-normal">
                      ({scoreObject.userTypeMultiplier.toFixed(2)}x)
                    </span>
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    L'<strong>Avantage de Composition</strong> (efficacité
                    moyenne des types de l'équipe face aux faiblesses adverses).
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-slate-200 font-bold">
                    ❤️ Bonus de Survie{" "}
                    <span className="text-slate-500 font-normal">
                      (+{Math.round(scoreObject.survivalBonus)})
                    </span>
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    Points accordés pour chaque Pokémon survivant, multipliés
                    par l'indice d'adversité. Plus le combat était
                    statistiquement difficile, plus vos survivants rapportent de
                    points.
                  </p>
                </div>

                <div className="pt-1 text-[11px] text-slate-500 italic border-t border-slate-800 leading-tight">
                  Note : Plus ton équipe a un avantage de type ou de puissance
                  sur l'adversaire, plus ton score de combat de base diminue,
                  rendant le bonus de survie crucial pour rester positif.
                </div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
