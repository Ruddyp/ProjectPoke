/* eslint-disable @next/next/no-img-element */
import { PokeBattleTrainer } from "@/app/type";
import { Card } from "@/components/ui/card";
import { usePokeBattle } from "@/context/PokeBattleProvider";

type TrainerProps = { trainer: PokeBattleTrainer };

export default function Trainer({ trainer }: TrainerProps) {
  const { startGame, isFetching } = usePokeBattle();

  return (
    <Card
      onClick={() => startGame(trainer)}
      className="p-2 sm:p-4 w-28 sm:w-40 bg-slate-800 border-2 border-slate-600 rounded-md flex flex-col items-center justify-center text-white font-bold uppercase tracking-widest hover:border-red-500 hover:bg-slate-700 transition-all shadow-[inset_0_0_20px_rgba(0,0,0,0.3)] cursor-pointer"
    >
      {/* Image du dresseur */}
      <div className="size-20 sm:size-28 bg-slate-700/50 rounded-full flex items-center justify-center overflow-hidden border-2 border-slate-600 mb-4">
        <img
          src={trainer.img}
          alt={trainer.name}
          className="size-16 sm:size-24 object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Infos */}
      <div className="flex flex-col items-center w-full">
        <h3 className="text-center text-white font-bold tracking-wider text-base uppercase">
          {trainer.name}
        </h3>

        {/* Badge Puissance */}
        <div className="flex flex-col items-center mt-2">
          <p className="text-électrik text-xs font-mono font-bold">PUISSANCE</p>
          <span>{trainer.power.toLocaleString()}</span>
        </div>
      </div>
    </Card>
  );
}
