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
  PokeBattleTrainer,
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
  display?: boolean,
): number {
  const totalPower = team.reduce((total, pokemon) => {
    const s = pokemon.stats;

    // Calcul du multiplicateur de type moyen (si bi-type)
    const typeMultipliers = pokemon.types.map(
      (t) => TYPE_DEFENSE_MULTIPLIERS[t] || 1.0,
    );
    const avgTypeMultiplier =
      typeMultipliers.reduce((a, b) => a + b, 0) / typeMultipliers.length;

    // Calcul de la force offensive (Max entre Attaque et Attaque Spéciale)
    const offense = Math.max(s.attack, s["special-attack"]);

    // Calcul de la force défensive (HP + Défense + Défense Spéciale)
    const defense =
      (s.hp + s.defense + s["special-defense"]) * avgTypeMultiplier;

    // Application de la formule SEC
    const pokemonSEC = 1.5 * offense + defense;
    display && console.log("pokemon", pokemon.name, "score:", pokemonSEC);

    return total + pokemonSEC;
  }, 0);

  return Math.round(totalPower);
}

export const TYPE_DEFENSE_MULTIPLIERS: Record<string, number> = {
  // Types "Top Tier" défensifs : Boost significatif
  steel: 1.5,
  ghost: 1.4,
  fairy: 1.4,

  // Types solides : Boost modéré
  water: 1.2,
  dragon: 1.2,
  dark: 1.1,

  // Types neutres
  normal: 1.0,
  psychic: 1.0,
  electric: 1.0,
  flying: 1.0,
  poison: 1.0,

  // Types vulnérables : Malus progressif
  ground: 0.9,
  fire: 0.9,
  fighting: 0.85,
  bug: 0.8,

  // Types fragiles : Malus sévère
  grass: 0.7,
  rock: 0.7,
  ice: 0.6,
};

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

export const RECHARGE_MOVES = [
  "Ultralaser",
  "Giga Impact",
  "Rafale Feu",
  "Hydroblast",
  "Végé-Attaque",
  "Hurle-Temps",
  "Roc-Boulet",
];

//---------------------------- GEN 1 ----------------------------------------//
export const TRAINER_BLUE = {
  name: "Blue",
  pokemons: [18, 130, 59, 65, 103, 112], // Roucarnage, Léviator, Arcanin, Alakazam, Noadkoko, Rhinoféros
  battleAudioSrc: "/sounds/battle_blue.mp3",
  victoryAudioSrc: "/sounds/victory_blue.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/blue.png",
  power: 2530,
  gen: 1,
};

export const TRAINER_PIERRE = {
  name: "Pierre",
  // Racaillou, Onix, Racaillou, Kabuto, Amonita, Ptéra
  pokemons: [74, 95, 74, 140, 138, 142],
  battleAudioSrc: "/sounds/battle_gym_gen1.mp3",
  victoryAudioSrc: "/sounds/victory_blue.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/brock.png",
  power: 1875,
  gen: 1,
};

export const TRAINER_ONDINE = {
  name: "Ondine",
  // Stari, Staross, Psykokwak, Lokhlass, Krabby, Têtarte
  pokemons: [120, 121, 54, 131, 98, 61],
  battleAudioSrc: "/sounds/battle_gym_gen1.mp3",
  victoryAudioSrc: "/sounds/victory_blue.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/misty.png",
  power: 1883,
  gen: 1,
};

export const TRAINER_MAJOR_BOB = {
  name: "Major Bob",
  // Voltorbe, Pikechu, Raichu, Magnéti, Magnéton, Élektek
  pokemons: [100, 25, 26, 81, 82, 125],
  battleAudioSrc: "/sounds/battle_gym_gen1.mp3",
  victoryAudioSrc: "/sounds/victory_blue.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/ltsurge.png",
  power: 1802,
  gen: 1,
};

export const TRAINER_ERIKA = {
  name: "Erika",
  // Empiflor, Rafflesia, Saquedeneu, Joliflor, Parasect, Boustiflor
  pokemons: [71, 45, 114, 182, 47, 70],
  battleAudioSrc: "/sounds/battle_gym_gen1.mp3",
  victoryAudioSrc: "/sounds/victory_blue.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/erika.png",
  power: 2220,
  gen: 1,
};

export const TRAINER_KOGA = {
  name: "Koga",
  // Smogo, Smogogo, Tadmorv, Grotadmorv, Nidoran, Aéromite
  pokemons: [109, 110, 88, 89, 32, 49],
  battleAudioSrc: "/sounds/battle_gym_gen1.mp3",
  victoryAudioSrc: "/sounds/victory_blue.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/koga.png",
  power: 1957,
  gen: 1,
};

export const TRAINER_MORGAN = {
  name: "Morgan",
  // Abra, Kadabra, Alakazam, Soporifik, Hypnomade, M. Mime
  pokemons: [63, 64, 65, 96, 97, 122],
  battleAudioSrc: "/sounds/battle_gym_gen1.mp3",
  victoryAudioSrc: "/sounds/victory_blue.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/sabrina.png",
  power: 1992,
  gen: 1,
};

export const TRAINER_AUGUSTE = {
  name: "Auguste",
  // Caninos, Arcanin, Ponyta, Galopa, Magmar, Feunard
  pokemons: [58, 59, 77, 78, 126, 38],
  battleAudioSrc: "/sounds/battle_gym_gen1.mp3",
  victoryAudioSrc: "/sounds/victory_blue.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/blaine.png",
  power: 2059,
  gen: 1,
};

export const TRAINER_GIOVANNI = {
  name: "Giovanni",
  // Kangourex, Rhinoféros, Nidoking, Nidoqueen, Triopikeur, Persian
  pokemons: [115, 112, 34, 31, 51, 53],
  battleAudioSrc: "/sounds/battle_gym_gen1.mp3",
  victoryAudioSrc: "/sounds/victory_blue.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/giovanni.png",
  power: 2259,
  gen: 1,
};
//-----------------------------------------------------------------------------//

//---------------------------- GEN 2 ----------------------------------------//

export const TRAINER_RED = {
  name: "Red",
  pokemons: [25, 3, 196, 6, 9, 143], // Pikachu, Florizarre, Mentali, Dracaufeu, Tortank, Ronflex
  battleAudioSrc: "/sounds/battle_red.mp3",
  victoryAudioSrc: "/sounds/victory_red.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/red.png",
  power: 2352,
  gen: 2,
};

export const TRAINER_ALBERT = {
  name: "Albert",
  pokemons: [16, 17, 18, 21, 22, 169], // Roucool, Roucoups, Roucarnage, Piafabec, Rapasdepic, Nostenfer
  battleAudioSrc: "/sounds/battle_gym_gen2.mp3",
  victoryAudioSrc: "/sounds/victory_red.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/falkner.png",
  power: 1686,
  gen: 2,
};

export const TRAINER_HECTOR = {
  name: "Hector",
  pokemons: [11, 14, 123, 167, 168, 212], // Chrysacier, Coconfort, Insécateur, Mimigal, Migalos, Cizayox
  battleAudioSrc: "/sounds/battle_gym_gen2.mp3",
  victoryAudioSrc: "/sounds/victory_red.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/bugsy.png",
  power: 1720,
  gen: 2,
};

export const TRAINER_BLANCHE = {
  name: "Blanche",
  pokemons: [35, 241, 39, 209, 113, 184], // Mélofée, Écrémeuh, Rondoudou, Snubbull, Leveinard, Azumarill
  battleAudioSrc: "/sounds/battle_gym_gen2.mp3",
  victoryAudioSrc: "/sounds/victory_red.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/whitney.png",
  power: 1923,
  gen: 2,
};

export const TRAINER_MORTIMER = {
  name: "Mortimer",
  pokemons: [92, 93, 94, 229, 197, 42], // Fantominus, Spectrum, Ectoplasma, Démolosse, Noctali, Nosferalto
  battleAudioSrc: "/sounds/battle_gym_gen2.mp3",
  victoryAudioSrc: "/sounds/victory_red.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/morty.png",
  power: 2095,
  gen: 2,
};

export const TRAINER_CHUCK = {
  name: "Chuck",
  pokemons: [62, 57, 68, 214, 56, 66], // Colossinge, Tartard, Kicklee, Scarhino, Férosinge, Machoc
  battleAudioSrc: "/sounds/battle_gym_gen2.mp3",
  victoryAudioSrc: "/sounds/victory_red.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/chuck.png",
  power: 2173,
  gen: 2,
};

export const TRAINER_JASMINE = {
  name: "Jasmine",
  pokemons: [81, 100, 208, 212, 227, 205], // Magnéti, Voltorbe, Steelix, Cizayox, Airmure, Foretress
  battleAudioSrc: "/sounds/battle_gym_gen2.mp3",
  victoryAudioSrc: "/sounds/victory_red.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/jasmine.png",
  power: 2238,
  gen: 2,
};

export const TRAINER_FREDO = {
  name: "Frédo",
  pokemons: [86, 220, 221, 144, 131, 365], // Otaria, Marcacrin, Cochignon, Artikodin, Lokhlass, Kaimorse
  battleAudioSrc: "/sounds/battle_gym_gen2.mp3",
  victoryAudioSrc: "/sounds/victory_red.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/pryce.png",
  power: 2165,
  gen: 2,
};

export const TRAINER_SANDRA = {
  name: "Sandra",
  pokemons: [148, 148, 148, 230, 130, 371], // Draco, Draco, Draco, Hyporoi, Léviator, Draby
  battleAudioSrc: "/sounds/battle_gym_gen2.mp3",
  victoryAudioSrc: "/sounds/victory_red.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/clair.png",
  power: 2254,
  gen: 2,
};

//-----------------------------------------------------------------------------//

//---------------------------- GEN 3 (HOENN) COMPLÉTES -----------------------//

export const TRAINER_PIERRE_ROCHARD = {
  name: "Pierre Rochard",
  pokemons: [227, 306, 346, 348, 344, 376], // Airmure, Galeking, Vacilys, Armaldo, Kaorine, Métalosse
  battleAudioSrc: "/sounds/battle_steven.mp3",
  victoryAudioSrc: "/sounds/victory_steven.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/steven.png",
  power: 2617,
  gen: 3,
};

export const TRAINER_ROXANNE = {
  name: "Roxanne",
  pokemons: [74, 74, 299, 75, 345, 346], // Racaillou, Racaillou, Tarinor, Gravalanch, Anorith, Armaldo
  battleAudioSrc: "/sounds/battle_gym_gen3.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen3.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/roxanne.png",
  power: 1993,
  gen: 3,
};

export const TRAINER_BASTIEN = {
  name: "Bastien",
  pokemons: [66, 296, 236, 68, 297, 307], // Machoc, Makuhita, Tarryb, Mackogneur, Hariyama, Méditikka
  battleAudioSrc: "/sounds/battle_gym_gen3.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen3.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/brawly.png",
  power: 1749,
  gen: 3,
};

export const TRAINER_VOLTERE = {
  name: "Voltère",
  pokemons: [100, 310, 82, 309, 101, 26], // Voltorbe, Élecsprint, Magnéton, Dynavolt, Électrode, Raichu
  battleAudioSrc: "/sounds/battle_gym_gen3.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen3.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/wattson.png",
  power: 1848,
  gen: 3,
};

export const TRAINER_ADRIANE = {
  name: "Adriane",
  pokemons: [322, 324, 218, 323, 228, 219], // Chamallot, Chartor, Limagma, Camerupt, Malosse, Volcaropod
  battleAudioSrc: "/sounds/battle_gym_gen3.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen3.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/flannery.png",
  power: 1888,
  gen: 3,
};

export const TRAINER_NORMAN = {
  name: "Norman",
  pokemons: [289, 288, 289, 287, 264, 52], // Monaflèmit, Vigoroth, Monaflèmit, Parecool, Linéon, Miaouss
  battleAudioSrc: "/sounds/battle_gym_gen3.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen3.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/norman.png",
  power: 2178,
  gen: 3,
};

export const TRAINER_ALIZEE = {
  name: "Alizée",
  pokemons: [277, 334, 279, 279, 227, 226], // Hélédelle, Altaria, Bekipan, Bekipan, Airmure, Démanta
  battleAudioSrc: "/sounds/battle_gym_gen3.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen3.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/winona.png",
  power: 2255,
  gen: 3,
};

export const TRAINER_LEVY_TATIA = {
  name: "Lévy & Tatia",
  pokemons: [344, 337, 338, 178, 122, 337], // Kaorine, Séléroc, Solaroc, Xatu, M.Mime, Lunetir
  battleAudioSrc: "/sounds/battle_gym_gen3.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen3.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/tateandliza-gen3.png",
  power: 2260,
  gen: 3,
};

export const TRAINER_MARC = {
  name: "Marc",
  pokemons: [370, 119, 364, 340, 350, 321], // Lovdisc, Poissoroy, Phogleur, Barbicha, Milobellus, Wailord
  battleAudioSrc: "/sounds/battle_gym_gen3.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen3.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/wallace.png",
  power: 2144,
  gen: 3,
};

//-----------------------------------------------------------------------------//

//---------------------------- GEN 4 (SINNOH) ----------------------------------//

export const TRAINER_CYNTHIA = {
  name: "Cynthia",
  pokemons: [442, 407, 423, 448, 350, 445], // Spiritomb, Roserade,Tritosor, Lucario, Milobellus, Carchacrok
  battleAudioSrc: "/sounds/battle_cynthia.mp3",
  victoryAudioSrc: "/sounds/victory_cynthia.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/cynthia.png",
  power: 2564,
  gen: 4,
};

export const TRAINER_PIERRICK = {
  name: "Pierrick",
  pokemons: [74, 95, 408, 111, 328, 443], // Racaillou, Onix, Kranidos, Rhinocorne, Kraknoix, Griknot
  battleAudioSrc: "/sounds/battle_gym_gen4.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen4.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/roark.png",
  power: 1807,
  gen: 4,
};

export const TRAINER_FLO = {
  name: "Flo",
  pokemons: [420, 387, 407, 421, 406, 114], // Ceribou, Tortipouss, Roserade, Ceriflor, Rozbouton, Saquedeneu
  battleAudioSrc: "/sounds/battle_gym_gen4.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen4.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/gardenia.png",
  power: 1868,
  gen: 4,
};

export const TRAINER_MELINA = {
  name: "Mélina",
  pokemons: [307, 67, 308, 66, 236, 448], // Méditikka, Machopeur, Charmina, Machoc, Debugant, Lucario
  battleAudioSrc: "/sounds/battle_gym_gen4.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen4.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/maylene.png",
  power: 1675,
  gen: 4,
};

export const TRAINER_LOVIS = {
  name: "Lovis",
  pokemons: [130, 195, 71, 349, 340, 419], // Léviator, Maraiste, Empiflor, Hydragon, Barbicha, Mustéflott
  battleAudioSrc: "/sounds/battle_gym_gen4.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen4.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/crasherwake.png",
  power: 2043,
  gen: 4,
};

export const TRAINER_KIMERA = {
  name: "Kiméra",
  pokemons: [92, 93, 94, 354, 426, 429], // Fantominus, Spectrum, Ectoplasma, Branette, Grodrive, Magireve
  battleAudioSrc: "/sounds/battle_gym_gen4.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen4.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/fantina.png",
  power: 2083,
  gen: 4,
};

export const TRAINER_CHARLES = {
  name: "Charles",
  pokemons: [208, 411, 304, 305, 306, 436], // Steelix, Bastiodon, Galekid, Galegon, Galeking, Archéomire
  battleAudioSrc: "/sounds/battle_gym_gen4.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen4.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/byron.png",
  power: 2332,
  gen: 4,
};

export const TRAINER_GLADYS = {
  name: "Gladys",
  pokemons: [459, 215, 460, 478, 221, 471], // Blizzi, Farfuret, Blizzaroi, Momartik, Cochignon, Givrali
  battleAudioSrc: "/sounds/battle_gym_gen4.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen4.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/candice.png",
  power: 2164,
  gen: 4,
};

export const TRAINER_TANGUY = {
  name: "Tanguy",
  pokemons: [82, 208, 310, 475, 462, 466], // Magnéton, Steelix, Élecsprint, Tarinor, Magireve, Élekable
  battleAudioSrc: "/sounds/battle_gym_gen4.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen4.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/volkner.png",
  power: 2527,
  gen: 4,
};

//-----------------------------------------------------------------------------//

//---------------------------- GEN 5 (UNYS) ----------------------------------//
export const TRAINER_GHECHIS = {
  name: "Ghechis",
  pokemons: [562, 626, 537, 625, 604, 635], // Tutankafer, Frison, Crapustule, Scalproie, Ohmassacre, Trioxhydre
  battleAudioSrc: "/sounds/battle_ghechis.mp3",
  victoryAudioSrc: "/sounds/victory_ghechis.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/ghetsis.png",
  power: 2445,
  gen: 5,
};

export const TRAINER_ARMANDO = {
  name: "Armando",
  pokemons: [519, 510, 505, 523, 514, 518], // Ponchiot, Leopardus, Miradar, Zéblitz, Flamoutan, Mushana
  battleAudioSrc: "/sounds/battle_gym_gen5.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen5.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/cilan.png",
  power: 1990,
  gen: 5,
};

export const TRAINER_ALOE = {
  name: "Aloé",
  pokemons: [510, 569, 506, 507, 572, 505], // Leopardus, Miasmax, Ponchien, Mastouffe, Nanméouïe, Miradar
  battleAudioSrc: "/sounds/battle_gym_gen5.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen5.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/lenora.png",
  power: 1758,
  gen: 5,
};

export const TRAINER_ARTIE = {
  name: "Artie",
  pokemons: [540, 541, 542, 544, 545, 588], // Larveyette, Couverdure, Manternel, Scobolide, Brutapode, Carabing
  battleAudioSrc: "/sounds/battle_gym_gen5.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen5.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/burgh.png",
  power: 1885,
  gen: 5,
};

export const TRAINER_INEZIA = {
  name: "Inezia",
  pokemons: [587, 587, 466, 523, 596, 604], // Emolga, Emolga, Elekable, Zéblytz, Mygavolt, Ohmassacre
  battleAudioSrc: "/sounds/battle_gym_gen5.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen5.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/elesa.png",
  power: 2091,
  gen: 5,
};

export const TRAINER_BARDANE = {
  name: "Bardane",
  pokemons: [535, 536, 551, 552, 529, 530], // Rototaupe, Minotaupe, Mascaïman, Escroco, Rototaupe, Rototaupe
  battleAudioSrc: "/sounds/battle_gym_gen5.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen5.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/clay.png",
  power: 1699,
  gen: 5,
};

export const TRAINER_CAROLINA = {
  name: "Carolina",
  pokemons: [566, 567, 570, 530, 597, 598], // Arkéapti, Aéroptéryx, Zoroark, Minotaupe, Grindur, Noacier
  battleAudioSrc: "/sounds/battle_gym_gen5.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen5.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/skyla.png",
  power: 2164,
  gen: 5,
};

export const TRAINER_ZHU = {
  name: "Zhu",
  pokemons: [614, 615, 555, 607, 608, 621], // Sorbébé, Sorboul, Darumacho, Funécire, Mélancolux, Drakkkar
  battleAudioSrc: "/sounds/battle_gym_gen5.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen5.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/brycen.png",
  power: 2351,
  gen: 5,
};

export const TRAINER_IRIS = {
  name: "Iris",
  pokemons: [567, 621, 611, 612, 635, 306], // Aéroptéryx, Drakkarmin, Incisache, Tranchodon, Trioxhydre, Galeking
  battleAudioSrc: "/sounds/battle_gym_gen5.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen5.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/iris.png",
  power: 2768,
  gen: 5,
};

//-----------------------------------------------------------------------------//

//---------------------------- LEGENDAIRE ----------------------------------//
export const TRAINER_LEG_1 = {
  name: "Légendaires gen 1",
  pokemons: [144, 145, 146, 150, 151, 149], // Artikodin, Electhor, Sulfura, Mewtwo, Mew, Dracolosse
  battleAudioSrc: "/sounds/battle_blue.mp3",
  victoryAudioSrc: "/sounds/victory_blue.mp3",
  img: "/leg_1.jpg",
  power: 2845,
  gen: "Légendaire",
};

export const TRAINER_LEG_2 = {
  name: "Légendaires gen 2",
  pokemons: [243, 244, 245, 249, 250, 251], // Raikou, Entei, Suicune, Lugia, Ho-Oh, Celebi
  battleAudioSrc: "/sounds/battle_leg_gen2.mp3",
  victoryAudioSrc: "/sounds/victory_red.mp3",
  img: "/leg_2.png",
  power: 2870,
  gen: "Légendaire",
};

export const TRAINER_LEG_3 = {
  name: "Légendaires gen 3",
  pokemons: [377, 378, 379, 382, 383, 384], // Regirock, Regice, Registeel, Kyogre, Groudon, Rayquaza
  battleAudioSrc: "/sounds/battle_leg_gen3.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen3.mp3",
  img: "/leg_3.png",
  power: 3201,
  gen: "Légendaire",
};

export const TRAINER_LEG_4 = {
  name: "Légendaires gen 4",
  pokemons: [483, 484, 487, 485, 486, 488], // Dialga, Palkia, Giratina, Heatran, Regigigas, Cresselia
  battleAudioSrc: "/sounds/battle_leg_gen4.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen4.mp3",
  img: "/leg_4.png",
  power: 3253,
  gen: "Légendaire",
};

export const TRAINER_LEG_5 = {
  name: "Légendaires gen 5",
  pokemons: [638, 639, 640, 643, 646, 644], // Cobaltium, Terrakium, Viridium, Reshiram, Kyurem, Zekrom
  battleAudioSrc: "/sounds/battle_leg_gen5.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen5.mp3",
  img: "/leg_5.png",
  power: 3003,
  gen: "Légendaire",
};

export const TRAINERS: PokeBattleTrainer[] = [
  // Génération 1 - Champions
  TRAINER_PIERRE,
  TRAINER_ONDINE,
  TRAINER_MAJOR_BOB,
  TRAINER_ERIKA,
  TRAINER_KOGA,
  TRAINER_MORGAN,
  TRAINER_AUGUSTE,
  TRAINER_GIOVANNI,

  // Génération 2 - Champions
  TRAINER_ALBERT,
  TRAINER_HECTOR,
  TRAINER_BLANCHE,
  TRAINER_MORTIMER,
  TRAINER_CHUCK,
  TRAINER_JASMINE,
  TRAINER_FREDO,
  TRAINER_SANDRA,

  // Génération 3 - Champions
  TRAINER_ROXANNE,
  TRAINER_BASTIEN,
  TRAINER_VOLTERE,
  TRAINER_ADRIANE,
  TRAINER_NORMAN,
  TRAINER_ALIZEE,
  TRAINER_LEVY_TATIA,
  TRAINER_MARC,

  // Génération 4 - Champions
  TRAINER_PIERRICK,
  TRAINER_FLO,
  TRAINER_MELINA,
  TRAINER_LOVIS,
  TRAINER_KIMERA,
  TRAINER_CHARLES,
  TRAINER_GLADYS,
  TRAINER_TANGUY,

  // Génération 5 - Champions
  TRAINER_ARMANDO,
  TRAINER_ALOE,
  TRAINER_ARTIE,
  TRAINER_INEZIA,
  TRAINER_BARDANE,
  TRAINER_CAROLINA,
  TRAINER_ZHU,
  TRAINER_IRIS,

  //  Maîtres
  TRAINER_RED,
  TRAINER_BLUE,
  TRAINER_PIERRE_ROCHARD,
  TRAINER_GHECHIS,
  TRAINER_CYNTHIA,

  // Légendaire
  TRAINER_LEG_1,
  TRAINER_LEG_2,
  TRAINER_LEG_3,
  TRAINER_LEG_4,
  TRAINER_LEG_5,
];

export const POKEBATTLE_DIFFICULTIES = TRAINERS.map((t) => t.name);

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

export const getTrainersMap = (trainersList: PokeBattleTrainer[]) => {
  return trainersList.reduce(
    (acc: { [key: number | string]: PokeBattleTrainer[] }, trainer) => {
      if (!acc[trainer.gen]) {
        acc[trainer.gen] = [];
      }
      // On ajoute le dresseur à sa génération
      acc[trainer.gen].push(trainer);

      return acc;
    },
    {},
  );
};
