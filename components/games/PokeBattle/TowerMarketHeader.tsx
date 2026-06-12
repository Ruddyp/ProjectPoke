/* eslint-disable react/no-unescaped-entities */
import { usePokeBattle } from "@/context/PokeBattleProvider";
import { Coins } from "lucide-react";

export default function TowerMarketHeader() {
  const { floor, towerPoint } = usePokeBattle();
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl border-b-2 border-slate-700 pb-4 gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-red-500">
          Marché de la Tour de combat Étage {floor}
        </h1>
      </div>
      <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 border-2 border-[#E0A850] rounded-md shadow-md">
        <Coins className="text-[#E0A850] size-6" />
        <span className="font-black text-xl text-[#E0A850]">
          {towerPoint} PTS
        </span>
      </div>
    </div>
  );
}
