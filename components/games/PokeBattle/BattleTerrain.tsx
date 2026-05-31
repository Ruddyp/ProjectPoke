/* eslint-disable @next/next/no-img-element */
import { PokeBattlePokemonDetails } from "@/app/type";
import PokemonHUD from "./PokemonHUD";
import { useEffect, useMemo, useRef } from "react";
import { sleep } from "@/lib/utils";
import usePokeBattleAnimation from "@/hooks/usePokeBattleAnimation";
import { usePokeBattle } from "@/context/PokeBattleProvider";
import Pokeball from "./Pokeball";

type BattleTerrainProps = {
  userPokemon: PokeBattlePokemonDetails;
  enemyPokemon: PokeBattlePokemonDetails;
};

export default function BattleTerrain({
  userPokemon,
  enemyPokemon,
}: BattleTerrainProps) {
  const { sound } = usePokeBattle();
  const prevUserId = useRef<null | number>(null);
  const prevEnemyId = useRef<null | number>(null);
  const animUser = usePokeBattleAnimation(userPokemon, "user");
  const animEnemy = usePokeBattleAnimation(enemyPokemon, "enemy");
  const backgroundUrl = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * 7) + 1;
    return `/background_battle_${randomIndex}.png`;
  }, []);

  const hasUserPokemonStatusEffect =
    userPokemon.isParalyze ||
    userPokemon.isAsleep ||
    userPokemon.isFrozen ||
    userPokemon.isBurnt ||
    userPokemon.isPoisoned;

  const hasEnemyPokemonStatusEffect =
    enemyPokemon.isParalyze ||
    enemyPokemon.isAsleep ||
    enemyPokemon.isFrozen ||
    enemyPokemon.isBurnt ||
    enemyPokemon.isPoisoned;

  const userPokeballTeamPos = !hasUserPokemonStatusEffect
    ? "absolute bottom-24 right-2.5 sm:bottom-[122px] sm:right-[26px]"
    : "absolute bottom-[120px] right-2.5 sm:bottom-[150px] sm:right-[26px]";

  const enemyPokeballTeamPos = !hasEnemyPokemonStatusEffect
    ? "absolute top-24 left-2.5 sm:top-[122px] sm:left-[26px]"
    : "absolute top-[120px] left-2.5 sm:top-[150px] sm:left-[26px]";

  const playSound = (url: string) => {
    const audio = new Audio(url);
    audio.volume = 0.15;
    audio.play().catch((e) => console.warn("Auto-play bloqué :", e));
  };

  // Gestion des cries
  useEffect(() => {
    (async () => {
      if (prevUserId.current === null && userPokemon.cries) {
        playSound(userPokemon.cries);
        await sleep(700);
      } else if (userPokemon.id !== prevUserId.current && userPokemon.cries) {
        playSound(userPokemon.cries);
        await sleep(700);
      }
      if (
        (prevEnemyId.current === null ||
          enemyPokemon.id !== prevEnemyId.current) &&
        enemyPokemon.cries
      ) {
        playSound(enemyPokemon.cries);
      }
      prevUserId.current = userPokemon.id;
      prevEnemyId.current = enemyPokemon.id;
    })();
  }, [userPokemon.id, enemyPokemon.id, userPokemon.cries, enemyPokemon.cries]);

  // Gestion des sons d'attaques et de status
  useEffect(() => {
    if (sound === null) return;
    playSound(`/sounds/${sound.type}.mp3`);
  }, [sound]);

  return (
    <div
      className={`relative flex-1 w-full top- overflow-hidden bg-cover`}
      style={{ backgroundImage: `url('${backgroundUrl}')` }}
    >
      <div className={`${enemyPokeballTeamPos}`}>
        <Pokeball team={"enemy"} />
      </div>
      <PokemonHUD pokemon={enemyPokemon} isEnemy />
      {/* Ennemi */}
      <div
        className={`absolute top-4 right-4 size-24 sm:size-48 flex items-center justify-center animate-enter-right`}
        key={`${enemyPokemon.id}`}
      >
        {enemyPokemon.sprites.front && (
          <img
            src={enemyPokemon.sprites.front}
            alt={enemyPokemon.name}
            key={`${enemyPokemon.id}-${animEnemy}`}
            className={`object-contain size-full ${animEnemy}`}
            style={{
              imageRendering: "pixelated",
            }}
            onError={(e) => {
              // Si le GIF Showdown échoue, on bascule vers le sprite statique de l'API
              e.currentTarget.src = enemyPokemon.spritesFallback
                .front as string;
            }}
          />
        )}
      </div>
      {/* Joueur */}
      <div
        className={`absolute bottom-4 left-4 size-24 sm:size-56 flex items-center justify-center animate-enter-left`}
        key={`${userPokemon.id}`}
      >
        {userPokemon.sprites.front && (
          <img
            src={userPokemon.sprites.back as string}
            alt={userPokemon.name}
            key={`${userPokemon.id}-${animUser}`}
            className={`object-contain size-full ${animUser}`}
            style={{
              imageRendering: "pixelated",
            }}
            onError={(e) => {
              // Si le GIF Showdown échoue, on bascule vers le sprite statique de l'API
              e.currentTarget.src = userPokemon.spritesFallback.back as string;
            }}
          />
        )}
      </div>
      <div className={`${userPokeballTeamPos}`}>
        <Pokeball team={"user"} />
      </div>
      <PokemonHUD pokemon={userPokemon} />
    </div>
  );
}
