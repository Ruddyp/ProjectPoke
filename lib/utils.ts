import {
  MemoryDifficulty,
  MemoryTuileType,
  PokeBattleDifficulty,
  PokeBattleMoveCategory,
  PokeBattleObject,
  PokeBattlePokemonDetails,
  PokeBattlePokemonMove,
  PokeBattlePokemonStatName,
  PokeBattlePokemonStatus,
  PokeBattlePokemonTarget,
  Pokemon,
  PokemonColorType,
  PokemonEvolution,
} from "@/app/type";
import confetti from "canvas-confetti";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getPokemonDetails } from "./fetch";

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

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs} sec`;
  return `${mins}min et ${secs} sec`;
}

export async function simplifyMove(moveData: any) {
  //Récupération du type francais
  const response = await fetch(
    `https://pokeapi.co/api/v2/type/${moveData.type?.name ?? "normal"}`,
  );
  const data = await response.json();
  const type =
    data.names.find((n: any) => n.language.name === "fr")?.name.toLowerCase() ??
    "normal";

  return {
    id: moveData.id,

    // noms
    name:
      moveData.names.find((n: any) => n.language.name === "fr")?.name ??
      moveData.name,

    // combat
    power: moveData.power ?? 0,
    accuracy: moveData.accuracy ?? 100,
    pp: moveData.pp ?? 0,
    priority: moveData.priority ?? 0,

    // type / catégorie
    type: type,
    category:
      (moveData.damage_class?.name as PokeBattleMoveCategory) ?? "status",

    // status
    status: (moveData.meta?.ailment?.name as PokeBattlePokemonStatus) ?? "none",
    statusChance: moveData.meta?.ailment_chance ?? 0,

    // effets secondaires
    flinchChance: moveData.meta?.flinch_chance ?? 0,
    critRate: moveData.meta?.crit_rate ?? 0,

    // soin / recoil
    drain: moveData.meta?.drain ?? 0,
    healing: moveData.meta?.healing ?? 0,

    // multi hit
    minHits: moveData.meta?.min_hits ?? 1,
    maxHits: moveData.meta?.max_hits ?? 1,

    // buffs / debuffs
    targetBuff: moveData.meta?.category?.name ?? null,
    statChanges:
      moveData.stat_changes?.map((stat: any) => ({
        stat: stat.stat.name,
        change: stat.change,
      })) ?? [],

    // cible
    target:
      (moveData.target?.name as PokeBattlePokemonTarget) ?? "selected-pokemon",

    // description FR
    description:
      moveData.effect_entries.find((e: any) => e.language.name === "fr")
        ?.short_effect ??
      moveData.effect_entries.find((e: any) => e.language.name === "en")
        ?.short_effect ??
      "",
  };
}

export async function getPokemonTeam(
  nbPokemonTeams = 3,
  initialIds: number[] = [],
) {
  const team = [];
  const currentIds = [...initialIds];
  nbPokemonTeams = initialIds.length > 0 ? initialIds.length : nbPokemonTeams;

  for (const id of initialIds) {
    const p = await getPokemonDetails(id);
    if (p) team.push(p);
  }

  while (team.length < nbPokemonTeams) {
    const randomNumber = getRandomNumber(1, 1025);

    if (!currentIds.includes(randomNumber)) {
      const pokemon = await getPokemonDetails(randomNumber);

      if (!pokemon) {
        console.error("Erreur récupération ID:", randomNumber);
        continue;
      }

      const isFirst: boolean = team.length === 0;
      team.push({ ...pokemon, isActive: isFirst });
      currentIds.push(randomNumber);
    }
  }

  return team;
}

export function getRandomMoves(moves: PokeBattlePokemonMove[]) {
  let results: PokeBattlePokemonMove[] = [];
  const indexes: number[] = [];

  do {
    let randomNumber = getRandomNumber(0, moves.length - 1);
    // if (indexes.length === 0)
    // randomNumber = moves.findIndex((attack) => attack.id === 78) ?? 2;
    if (!indexes.includes(randomNumber)) {
      const move = moves[randomNumber];
      results.push(move);
      indexes.push(randomNumber);
    }
  } while (indexes.length !== 4);

  return results;
}

export function calculatePokemonTeamPower(
  team: PokeBattlePokemonDetails[],
): number {
  const totalPower = team.reduce((total, pokemon) => {
    const s = pokemon.stats;

    // Calcul de la force offensive (Max entre Attaque et Attaque Spéciale)
    const offense = Math.max(s.attack, s["special-attack"]);

    // Calcul de la force défensive (HP + Défense + Défense Spéciale)
    const defense = s.hp + s.defense + s["special-defense"];

    // Application de la formule SEC
    const pokemonSEC = 1.5 * offense + defense;

    return total + pokemonSEC;
  }, 0);

  return Math.round(totalPower);
}

export const SHOWDOWN_EXCEPTIONS: Record<string, string> = {
  "aegislash-shield": "aegislash",
  "cherrim-overcast": "cherrim",
  "darmanitan-standard": "darmanitan",
  "deoxys-normal": "deoxys",
  "eiscue-ice": "eiscue",
  "furfrou-natural": "furfrou",
  "gimmighoul-roaming": "gimmighoul", // Showdown garde "-roaming"
  "gourgeist-average": "gourgeist",
  "hoopa-confined": "hoopa",
  "keldeo-ordinary": "keldeo",
  "landorus-incarnate": "landorus",
  "lycanroc-midday": "lycanroc",
  "magearna-original": "magearna",
  "meloetta-aria": "meloetta",
  "minior-red-meteor": "minior-meteor", // Showdown veut "-meteor"
  "morpeko-fullbelly": "morpeko",
  "ogerpon-teal": "ogerpon",
  "oricorio-baile": "oricorio",
  "palafin-zero": "palafin",
  "pumpkaboo-average": "pumpkaboo",
  "thundurus-incarnate": "thundurus",
  "toxtricity-amped": "toxtricity",
  "tornadus-incarnate": "tornadus",
  "urshifu-singlestrike": "urshifu",
  "wishiwashi-solo": "wishiwashi",
  "wormadam-plant": "wormadam", // Cheniselle garde "-plant"
  "zygarde-50": "zygarde",
  "morpeko-full-belly": "morpeko",
};

export const POKEBATTLE_OBJECTS: PokeBattleObject[] = [
  {
    name: "Potion",
    type: "heal",
    quantity: 2,
    src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png",
  },
  {
    name: "Rappel",
    type: "reborn",
    quantity: 1,
    src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png",
  },
  {
    name: "Antidote",
    type: "status",
    quantity: 1,
    src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/antidote.png",
  },
];

export const TRAINER_RED = {
  name: "Red",
  pokemons: [3, 6, 9, 25, 131, 143], // Florizarre, Dracaufeu, Tortank, Pikachu, Lokhlass, Ronflex
  battleAudioSrc: "/sounds/battle_red.mp3",
  victoryAudioSrc: "/sounds/victory_red.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/red.png",
  power: 2369,
};

export const TRAINER_CYNTHIA = {
  name: "Cynthia",
  pokemons: [445, 448, 407, 468, 350, 473], // Carchacrok, Lucario, Roserade, Togekiss, Milobellus, Momartik
  battleAudioSrc: "/sounds/battle_cynthia.mp3",
  victoryAudioSrc: "/sounds/victory_cynthia.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/cynthia.png",
  power: 2652,
};
export const TRAINER_BLUE = {
  name: "Blue",
  pokemons: [65, 59, 103, 131, 18, 9], // Alakazam, Arcanin, Noadkoko, Lokhlass, Roucarnage, Tortank
  battleAudioSrc: "/sounds/battle_blue.mp3",
  victoryAudioSrc: "/sounds/victory_blue.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/blue.png",
  power: 2447,
};
export const TRAINER_GHECHIS = {
  name: "Ghechis",
  pokemons: [550, 560, 197, 637, 537, 635], // Hydragon, Baggaïd, Noctali, Pyrax, Crapustule, Trioxhydre
  battleAudioSrc: "/sounds/battle_ghechis.mp3",
  victoryAudioSrc: "/sounds/victory_ghechis.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/ghetsis.png",
  power: 2505,
};
export const TRAINER_STEVEN = {
  name: "Steven",
  pokemons: [376, 373, 367, 350, 381, 306], // Métalosse, Drattak, Cracnoar, Milobellus, Latias, Galeking
  battleAudioSrc: "/sounds/battle_steven.mp3",
  victoryAudioSrc: "/sounds/victory_steven.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/steven.png",
  power: 2740,
};

export const POKEBATTLE_DIFFICULTIES: PokeBattleDifficulty[] = [
  "Red",
  "Cynthia",
  "Blue",
  "Ghechis",
  "Steven",
  "Random",
];

export function statToFrench(stat: PokeBattlePokemonStatName) {
  switch (stat) {
    case "accuracy":
      return "sa précision";
    case "attack":
      return "son attaque";
    case "defense":
      return "sa défense";
    case "special-attack":
      return "son attaque spéciale";
    case "special-defense":
      return "sa défense spéciale";
    case "evasion":
      return "son esquive";
    case "hp":
      return "ses point de vie";
    case "speed":
      return "sa vitesse";
  }
}
