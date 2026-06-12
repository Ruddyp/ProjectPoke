import { usePokeBattle } from "@/context/PokeBattleProvider";
import { PRICES } from "@/lib/utils";
import { ShoppingBag, ArrowRight, Plus } from "lucide-react";

type TacticalShopProps = {
  towerPoint: number;
  onBuyObject: (type: "heal" | "reborn" | "status", cost: number) => void;
  onNextFloor: () => void;
};

export default function TacticalShop({
  towerPoint,
  onBuyObject,
  onNextFloor,
}: TacticalShopProps) {
  const shopItems = [
    { type: "heal", name: "Potion de Soin", price: PRICES.buy_potion },
    { type: "reborn", name: "Rappel", price: PRICES.buy_reborn },
    { type: "status", name: "Antidote", price: PRICES.buy_antidote },
  ] as const;

  const { isFetching } = usePokeBattle();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="font-bold text-sm text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <ShoppingBag className="size-4 text-amber-500" /> Magasin
        </h2>

        <div className="bg-slate-900 border-2 border-slate-700 rounded-md p-4 flex flex-col gap-3">
          {shopItems.map((item) => (
            <div
              key={item.type}
              className="flex items-center justify-between border-b border-slate-800 last:border-none pb-2 last:pb-0"
            >
              <div>
                <div className="text-sm font-bold uppercase">{item.name}</div>
                <div className="text-xs text-slate-400">{item.price} PTS</div>
              </div>
              <button
                disabled={towerPoint < item.price}
                onClick={() => onBuyObject(item.type, item.price)}
                className="p-1.5 bg-slate-800 border border-slate-600 rounded hover:border-amber-400 disabled:opacity-30"
              >
                <Plus className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-6">
        <button
          disabled={isFetching}
          onClick={onNextFloor}
          className="w-full h-14 rounded-md border-2 border-slate-600 text-white font-black text-lg uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-md disabled:opacity-30"
          style={{
            background: `radial-gradient(circle 200px at 50% 50%, #1e3a8a, #172554)`,
          }}
        >
          {isFetching ? (
            "Chargment ..."
          ) : (
            <>
              Étage Suivant <ArrowRight className="size-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
