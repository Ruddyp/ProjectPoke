import {
  MemoryDifficulty,
  MemoryTuileType,
  Pokemon,
  PokemonColorType,
  PokemonEvolution,
} from "@/app/type";
import confetti from "canvas-confetti";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const colors: Record<PokemonColorType, string> = {
  plante: "#3fa129",
  plante_light: "#A7F895",
  poison: "#8f41cb",
  poison_light: "#CD8DFE",
  feu: "#e62829",
  feu_light: "#FF7F7F",
  vol: "#81b9ef",
  vol_light: "#BBDCFC",
  eau: "#2980ef",
  eau_light: "#89BCFD",
  insecte: "#91a119",
  insecte_light: "#DAEA5C",
  normal: "#9fa19f",
  normal_light: "#DDDDDD",
  électrik: "#fac000",
  électrik_light: "#FFE385",
  sol: "#915121",
  sol_light: "#D48B54",
  fée: "#ef71ef",
  fée_light: "#FBB9FB",
  combat: "#ff8000",
  combat_light: "#FFC081",
  psy: "#ef4179",
  psy_light: "#FD9EBC",
  roche: "#afa981",
  roche_light: "#D4CFB0",
  acier: "#60a1b8",
  acier_light: "#9AC9DA",
  glace: "#3fd8ff",
  glace_light: "#B4EBF9",
  spectre: "#704170",
  spectre_light: "#C28CC2",
  ténèbres: "#50413f",
  ténèbres_light: "#827371",
  dragon: "#5061e1",
  dragon_light: "#9AA5FB",
};

export const maxStats: any = {
  hp: 255,
  atk: 190,
  def: 250,
  spe_atk: 194,
  spe_def: 250,
  vit: 200,
};

export function isEvolution(pokemonEvols: PokemonEvolution | null) {
  if (pokemonEvols == null) return false;
  if (pokemonEvols.pre == null) return false;
  if (pokemonEvols.pre.length > 0) return true;
}

export function lureToFrench(lure: string) {
  switch (lure) {
    case "Glacial Lure Module":
      return "Leurre glaciaire";
    case "Mossy Lure Module":
      return "Leurre moussu";
    case "Magnetic Lure Module":
      return "Leurre magnétique";
    case "Rainy Lure Module":
      return "Leurre pluvieux";
    case "Golden Lure Module":
      return "Leurre dorée";
    default:
      break;
  }
}

export function ConfettiFireworks() {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const interval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
}

export const raidTiers = [
  "1st Tier",
  "1st Tier Shadow Raids",
  "3rd Tier",
  "3rd Tier Shadow Raids",
  "5th Tier",
  "Legendary Shadow Raids",
  "Mega Raids",
  "Mega Legendary",
  "Ultra Beast",
];

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

    // swap elements array[i] and array[j]
    // we use "destructuring assignment" syntax to achieve that
    // you'll find more details about that syntax in later chapters
    // same can be written as:
    // let t = array[i]; array[i] = array[j]; array[j] = t
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function getTuiles(
  pokemons: Pokemon[],
  mode: MemoryDifficulty = "easy",
) {
  let tuiles: MemoryTuileType[] = [];
  const pokemonsIds: number[] = [];

  let nbTuile = 16;
  if (mode === "intermediate") nbTuile = 24;
  if (mode === "hard") nbTuile = 32;

  do {
    const randomNumber = getRandomNumber(1, 151);
    if (!pokemonsIds.includes(randomNumber)) {
      const pokemon = pokemons.find((pkmn) => pkmn.pokedex_id === randomNumber);
      if (pokemon) {
        const tuile = {
          source: pokemon.sprites.regular,
          flipState: false,
          id: pokemon.pokedex_id,
        };
        tuiles = [...tuiles, tuile];
        tuiles = [...tuiles, { ...tuile, id: pokemon.pokedex_id + 151 }];
        pokemonsIds.push(pokemon.pokedex_id);
      }
    }
  } while (tuiles.length !== nbTuile);

  return tuiles;
}

export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
