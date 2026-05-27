/* eslint-disable @next/next/no-img-element */
import { PokeBattleTrainer } from "@/app/type";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import Trainer from "./Trainer";
import { X } from "lucide-react";

type TrainerGenProps = {
  gen: number | string;
  trainers: PokeBattleTrainer[];
};

export default function TrainerGen({ gen, trainers }: TrainerGenProps) {
  const [showTrainerList, setShowTrainerList] = useState(false);

  if (showTrainerList) {
    return (
      <div className="fixed w-full h-screen inset-0 z-[100] p-4 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
        <div className="relative h-max w-full bg-slate-900 border-2 border-[#E0A850] rounded-2xl p-6 shadow-2xl ">
          <button
            onClick={() => setShowTrainerList(false)}
            className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors"
          >
            <X className="size-6 sm:size-8" />
          </button>
          <h2 className="text-white text-3xl font-black text-center mb-6 uppercase tracking-widest">
            Dresseur génération {gen}
          </h2>
          <div className="flex flex-row flex-wrap justify-center gap-1">
            {trainers
              .sort((a, b) => a.power - b.power)
              .map((trainer) => (
                <Trainer key={trainer.name} trainer={trainer} />
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card
      onClick={() => setShowTrainerList(true)}
      className="p-2 sm:p-4 w-28 sm:w-40 bg-slate-800 border-2 border-slate-600 rounded-md flex flex-col items-center justify-center text-white font-bold uppercase tracking-widest hover:border-red-500 hover:bg-slate-700 transition-all shadow-[inset_0_0_20px_rgba(0,0,0,0.3)] cursor-pointer"
    >
      {/* Image du dresseur */}
      <div className="size-20 sm:size-28 bg-slate-700/50 rounded-full flex items-center justify-center overflow-hidden border-2 border-slate-600 mb-4">
        <img
          src={`/gen_${gen}.jpg`}
          alt={`gen_${gen}`}
          className="size-full object-cover group-hover:scale-110 transition-transform duration-300 rounded-full"
        />
      </div>

      {/* Infos */}
      <div className="flex flex-col items-center w-full">
        <h3 className="text-center text-white font-bold tracking-wider text-base uppercase">
          {gen}
        </h3>
      </div>
    </Card>
  );
}
