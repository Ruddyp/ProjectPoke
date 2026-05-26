import { usePokeBattle } from "@/context/PokeBattleProvider";
import Image from "next/image";

export default function Pokeball({ team }: { team: "user" | "enemy" }) {
  const { userPokemons, enemyPokemons } = usePokeBattle();

  const teamList = team === "user" ? userPokemons : enemyPokemons;
  const remaining = teamList.filter((p) => p.currentHp > 0).length;
  const total = teamList.length;
  return (
    <div className="flex gap-0.5 sm:gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <Image
          key={i}
          src={"/pokeball.png"}
          alt="Pokéball"
          width={16}
          height={16}
          className={`object-contain ${i < remaining ? "" : "grayscale"}`}
        />
      ))}
    </div>
  );
}
