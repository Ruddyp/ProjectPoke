import { PokeBattlePokemonDetails } from "@/app/type";
import { usePokeBattle } from "@/context/PokeBattleProvider";
import { useEffect, useRef, useState } from "react";

export default function usePokeBattleAnimation(
  pokemon: PokeBattlePokemonDetails,
  team: "user" | "enemy",
) {
  const { isAttacking, gameStatus } = usePokeBattle();
  const [animation, setAnimation] = useState<string>("");
  const prevHp = useRef(pokemon.currentHp);
  const prevId = useRef<null | number>(pokemon.id);

  useEffect(() => {
    const isMyTurn =
      (gameStatus === "user_turn" && team === "user") ||
      (gameStatus === "enemy_turn" && team === "enemy");

    if (!isAttacking || !isMyTurn) return;

    const dashAnim =
      team === "user" ? "animate-attack-dash" : "animate-attack-dash-enemy";
    setAnimation(dashAnim);

    const timer = setTimeout(() => setAnimation(""), 400);
    return () => clearTimeout(timer);
  }, [isAttacking, gameStatus, team]);

  useEffect(() => {
    if (pokemon.id !== prevId.current) {
      prevId.current = pokemon.id;
      prevHp.current = pokemon.currentHp;
      return;
    }

    if (pokemon.currentHp !== prevHp.current) {
      const animClass =
        pokemon.currentHp < prevHp.current
          ? "animate-pokemon-hit"
          : "animate-status-lifesteal";

      setAnimation(animClass);
      const timer = setTimeout(() => setAnimation(""), 700);

      prevHp.current = pokemon.currentHp;
      return () => clearTimeout(timer);
    }
  }, [pokemon.currentHp, pokemon.id]);

  return animation;
}
