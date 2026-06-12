import {
  MemoryDifficulty,
  MemoryTuileType,
  PokeBattleBuffOption,
  PokeBattleMoveCategory,
  PokeBattleObject,
  PokeBattlePokemonDetails,
  PokeBattlePokemonMove,
  PokeBattlePokemonStatName,
  PokeBattlePokemonStats,
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
import {
  Activity,
  Anchor,
  Bell,
  Biohazard,
  Bomb,
  Brain,
  BrickWall,
  Bug,
  Circle,
  Copy,
  Crosshair,
  Crown,
  Dices,
  Droplet,
  EyeOff,
  Flame,
  FlameKindling,
  Ghost,
  Glasses,
  Hammer,
  Heart,
  HeartCrack,
  HeartHandshake,
  HeartPulse,
  HelpCircle,
  Moon,
  Mountain,
  PlusCircle,
  RefreshCw,
  Scissors,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldPlus,
  Skull,
  Snowflake,
  Sparkles,
  Sprout,
  Sword,
  Swords,
  Target,
  Wand2,
  Wind,
  Zap,
} from "lucide-react";

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
  nbPokemonTeams = 6,
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
  // Si le nombre de moves est inférieur ou égal à 4,
  // on retourne simplement une copie du tableau original.
  if (moves.length <= 4) {
    return [...moves];
  }

  const results: PokeBattlePokemonMove[] = [];
  const indexes = new Set<number>();

  while (indexes.size < 4) {
    const randomNumber = getRandomNumber(0, moves.length - 1);

    if (!indexes.has(randomNumber)) {
      indexes.add(randomNumber);
      results.push(moves[randomNumber]);
    }
  }

  return results;
}

export function calculatePokemonTeamPower(
  team: PokeBattlePokemonDetails[],
): number {
  const totalPower = team.reduce((total, pokemon) => {
    return total + calculatePokemonPower(pokemon);
  }, 0);
  return Math.round(totalPower);
}

export function calculatePokemonPower(pokemon: PokeBattlePokemonDetails) {
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
  const defense = (s.hp + s.defense + s["special-defense"]) * avgTypeMultiplier;

  // Application de la formule SEC
  const pokemonSEC = 1.5 * offense + defense;
  return Math.round(pokemonSEC);
}

// Calcule le multiplicateur offensif moyen de l'équipe A sur l'équipe B
export function getTeamOffensiveMultiplier(
  attackerTeam: PokeBattlePokemonDetails[],
  defenderTeam: PokeBattlePokemonDetails[],
): number {
  let totalMultiplier = 0;
  let checksCount = 0;

  attackerTeam.forEach((attacker) => {
    defenderTeam.forEach((defender) => {
      // On simule que l'attaquant utilise des capacités de ses propres types
      attacker.types.forEach((attackerType) => {
        // On cherche le multiplicateur défensif du Pokémon cible face à ce type
        const matchup = defender.typeChart.find(
          (tc) => tc.name.toLowerCase() === attackerType.toLowerCase(),
        );

        // Si le type est trouvé on prend son multiplicateur (x2, x0.5, x0, etc.), sinon x1
        const multiplier = matchup ? matchup.multiplier : 1.0;

        totalMultiplier += multiplier;
        checksCount++;
      });
    });
  });

  // On retourne la moyenne (Ex: 1.0 = Neutre, 2.0 = Super Efficace, 0.5 = Pas très efficace)
  return checksCount > 0 ? totalMultiplier / checksCount : 1.0;
}

export function calculateFinalBattleScore(
  userTeam: PokeBattlePokemonDetails[],
  enemyTeam: PokeBattlePokemonDetails[],
  enemyPower: number,
  userPower: number,
) {
  // Calcul des multiplicateurs offensifs croisés
  const userOffenseMult = getTeamOffensiveMultiplier(userTeam, enemyTeam);
  const enemyOffenseMult = getTeamOffensiveMultiplier(enemyTeam, userTeam);

  // Calcul des puissances effectives (Puissance brute * Avantage de type)
  const effectiveUserPower = userPower * userOffenseMult;
  const effectiveEnemyPower = enemyPower * enemyOffenseMult;

  // Calcul du score de base
  let finalScore = effectiveEnemyPower - effectiveUserPower;

  // Calcul du bonus de survie basé sur le ratio de puissance effective
  const alivePokemonCount = userTeam.filter(
    (poke) => poke.currentHp > 0,
  ).length;

  // Valeur de base (ex: 50 points max par Pokémon en vie pour un match équilibré)
  const baseBonusPerPokemon = 50;

  // Plus ce ratio est élevé, plus le combat était difficile pour le joueur
  const powerRatio = effectiveEnemyPower / effectiveUserPower;

  // Application du bonus de survie pondéré
  const survivalBonus = alivePokemonCount * baseBonusPerPokemon * powerRatio;

  // Ajout du bonus au score final
  finalScore += survivalBonus;

  return {
    userTypeMultiplier: userOffenseMult,
    enemyTypeMultiplier: enemyOffenseMult,
    finalScore: Math.round(finalScore),
    survivalBonus,
    powerRatio,
  };
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
  intelligence: 0.95,
};

export const TRAINER_PIERRE = {
  name: "Pierre",
  // Racaillou, Onix, Gravalanch, Kabuto, Amonita, Ptéra
  pokemons: [74, 95, 75, 140, 138, 142],
  battleAudioSrc: "/sounds/battle_gym_gen1.mp3",
  victoryAudioSrc: "/sounds/victory_blue.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/brock.png",
  power: 1943,
  gen: 1,
  intelligence: 0.4,
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
  intelligence: 0.45,
};

export const TRAINER_MAJOR_BOB = {
  name: "Major Bob",
  // Electrode, Pikachu, Raichu, Magnéti, Magnéton, Élektek
  pokemons: [101, 25, 26, 81, 82, 125],
  battleAudioSrc: "/sounds/battle_gym_gen1.mp3",
  victoryAudioSrc: "/sounds/victory_blue.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/ltsurge.png",
  power: 1905,
  gen: 1,
  intelligence: 0.5,
};

export const TRAINER_ERIKA = {
  name: "Erika",
  // Empiflor, Rafflesia, Saquedeneu, Noadkoko, Parasect, Boustiflor
  pokemons: [71, 45, 114, 103, 47, 70],
  battleAudioSrc: "/sounds/battle_gym_gen1.mp3",
  victoryAudioSrc: "/sounds/victory_blue.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/erika.png",
  power: 2258,
  gen: 1,
  intelligence: 0.55,
};

export const TRAINER_KOGA = {
  name: "Koga",
  // Smogo, Smogogo, Tadmorv, Grotadmorv, Nidoqueen, Nidoking
  pokemons: [109, 110, 88, 89, 31, 34],
  battleAudioSrc: "/sounds/battle_gym_gen1.mp3",
  victoryAudioSrc: "/sounds/victory_blue.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/koga.png",
  power: 2191,
  gen: 1,
  intelligence: 0.6,
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
  intelligence: 0.65,
};

export const TRAINER_AUGUSTE = {
  name: "Auguste",
  // Caninos, Arcanin, Dracaufeu, Galopa, Magmar, Feunard
  pokemons: [58, 59, 6, 78, 126, 38],
  battleAudioSrc: "/sounds/battle_gym_gen1.mp3",
  victoryAudioSrc: "/sounds/victory_blue.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/blaine.png",
  power: 2166,
  gen: 1,
  intelligence: 0.7,
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
  intelligence: 0.8,
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
  intelligence: 0.95,
};

export const TRAINER_ALBERT = {
  name: "Albert",
  pokemons: [16, 17, 18, 21, 22, 169], // Roucool, Roucoups, Roucarnage, Piafabec, Rapasdepic, Nostenfer
  battleAudioSrc: "/sounds/battle_gym_gen2.mp3",
  victoryAudioSrc: "/sounds/victory_red.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/falkner.png",
  power: 1686,
  gen: 2,
  intelligence: 0.4,
};

export const TRAINER_HECTOR = {
  name: "Hector",
  pokemons: [11, 14, 123, 167, 168, 212], // Chrysacier, Coconfort, Insécateur, Mimigal, Migalos, Cizayox
  battleAudioSrc: "/sounds/battle_gym_gen2.mp3",
  victoryAudioSrc: "/sounds/victory_red.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/bugsy.png",
  power: 1720,
  gen: 2,
  intelligence: 0.45,
};

export const TRAINER_BLANCHE = {
  name: "Blanche",
  pokemons: [35, 241, 39, 209, 113, 184], // Mélofée, Écrémeuh, Rondoudou, Snubbull, Leveinard, Azumarill
  battleAudioSrc: "/sounds/battle_gym_gen2.mp3",
  victoryAudioSrc: "/sounds/victory_red.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/whitney.png",
  power: 1923,
  gen: 2,
  intelligence: 0.65,
};

export const TRAINER_MORTIMER = {
  name: "Mortimer",
  pokemons: [92, 93, 94, 229, 197, 42], // Fantominus, Spectrum, Ectoplasma, Démolosse, Noctali, Nosferalto
  battleAudioSrc: "/sounds/battle_gym_gen2.mp3",
  victoryAudioSrc: "/sounds/victory_red.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/morty.png",
  power: 2095,
  gen: 2,
  intelligence: 0.55,
};

export const TRAINER_CHUCK = {
  name: "Chuck",
  pokemons: [62, 57, 68, 214, 56, 66], // Colossinge, Tartard, Kicklee, Scarhino, Férosinge, Machoc
  battleAudioSrc: "/sounds/battle_gym_gen2.mp3",
  victoryAudioSrc: "/sounds/victory_red.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/chuck.png",
  power: 2173,
  gen: 2,
  intelligence: 0.6,
};

export const TRAINER_JASMINE = {
  name: "Jasmine",
  pokemons: [81, 100, 208, 212, 227, 205], // Magnéti, Voltorbe, Steelix, Cizayox, Airmure, Foretress
  battleAudioSrc: "/sounds/battle_gym_gen2.mp3",
  victoryAudioSrc: "/sounds/victory_red.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/jasmine.png",
  power: 2238,
  gen: 2,
  intelligence: 0.65,
};

export const TRAINER_FREDO = {
  name: "Frédo",
  pokemons: [86, 220, 221, 144, 131, 365], // Otaria, Marcacrin, Cochignon, Artikodin, Lokhlass, Kaimorse
  battleAudioSrc: "/sounds/battle_gym_gen2.mp3",
  victoryAudioSrc: "/sounds/victory_red.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/pryce.png",
  power: 2165,
  gen: 2,
  intelligence: 0.7,
};

export const TRAINER_SANDRA = {
  name: "Sandra",
  pokemons: [146, 147, 148, 230, 130, 371], // Minidraco, Draco, Dracolosse, Hyporoi, Léviator, Draby
  battleAudioSrc: "/sounds/battle_gym_gen2.mp3",
  victoryAudioSrc: "/sounds/victory_red.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/clair.png",
  power: 2243,
  gen: 2,
  intelligence: 0.75,
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
  intelligence: 0.95,
};

export const TRAINER_ROXANNE = {
  name: "Roxanne",
  pokemons: [74, 75, 299, 76, 345, 346], // Racaillou, Gravalanch, Tarinor, Grolem, Anorith, Armaldo
  battleAudioSrc: "/sounds/battle_gym_gen3.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen3.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/roxanne.png",
  power: 2158,
  gen: 3,
  intelligence: 0.4,
};

export const TRAINER_BASTIEN = {
  name: "Bastien",
  pokemons: [66, 296, 236, 68, 297, 307], // Machoc, Makuhita, Tarryb, Mackogneur, Hariyama, Méditikka
  battleAudioSrc: "/sounds/battle_gym_gen3.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen3.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/brawly.png",
  power: 1749,
  gen: 3,
  intelligence: 0.45,
};

export const TRAINER_VOLTERE = {
  name: "Voltère",
  pokemons: [100, 310, 82, 309, 101, 26], // Voltorbe, Élecsprint, Magnéton, Dynavolt, Électrode, Raichu
  battleAudioSrc: "/sounds/battle_gym_gen3.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen3.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/wattson.png",
  power: 1848,
  gen: 3,
  intelligence: 0.5,
};

export const TRAINER_ADRIANE = {
  name: "Adriane",
  pokemons: [322, 324, 218, 323, 228, 219], // Chamallot, Chartor, Limagma, Camerupt, Malosse, Volcaropod
  battleAudioSrc: "/sounds/battle_gym_gen3.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen3.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/flannery.png",
  power: 1888,
  gen: 3,
  intelligence: 0.55,
};

export const TRAINER_NORMAN = {
  name: "Norman",
  pokemons: [289, 288, 53, 287, 264, 52], // Monaflèmit, Vigoroth, Persian, Parecool, Linéon, Miaouss
  battleAudioSrc: "/sounds/battle_gym_gen3.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen3.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/norman.png",
  power: 1918,
  gen: 3,
  intelligence: 0.6,
};

export const TRAINER_ALIZEE = {
  name: "Alizée",
  pokemons: [277, 334, 279, 334, 227, 226], // Hélédelle, Altaria, Bekipan, Altaria, Airmure, Démanta
  battleAudioSrc: "/sounds/battle_gym_gen3.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen3.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/winona.png",
  power: 2255,
  gen: 3,
  intelligence: 0.65,
};

export const TRAINER_LEVY_TATIA = {
  name: "Lévy & Tatia",
  pokemons: [344, 337, 338, 178, 122, 346], // Kaorine, Séléroc, Solaroc, Xatu, M.Mime, Vacilys
  battleAudioSrc: "/sounds/battle_gym_gen3.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen3.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/tateandliza-gen3.png",
  power: 2289,
  gen: 3,
  intelligence: 0.7,
};

export const TRAINER_MARC = {
  name: "Marc",
  pokemons: [370, 119, 364, 340, 350, 321], // Lovdisc, Poissoroy, Phogleur, Barbicha, Milobellus, Wailord
  battleAudioSrc: "/sounds/battle_gym_gen3.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen3.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/wallace.png",
  power: 2144,
  gen: 3,
  intelligence: 0.75,
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
  intelligence: 0.95,
};

export const TRAINER_PIERRICK = {
  name: "Pierrick",
  pokemons: [76, 95, 408, 111, 328, 443], // Grolem, Onix, Kranidos, Rhinocorne, Kraknoix, Griknot
  battleAudioSrc: "/sounds/battle_gym_gen4.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen4.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/roark.png",
  power: 1972,
  gen: 4,
  intelligence: 0.4,
};

export const TRAINER_FLO = {
  name: "Flo",
  pokemons: [420, 387, 407, 421, 406, 114], // Ceribou, Tortipouss, Roserade, Ceriflor, Rozbouton, Saquedeneu
  battleAudioSrc: "/sounds/battle_gym_gen4.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen4.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/gardenia.png",
  power: 1868,
  gen: 4,
  intelligence: 0.45,
};

export const TRAINER_MELINA = {
  name: "Mélina",
  pokemons: [307, 67, 308, 68, 236, 448], // Méditikka, Machopeur, Charmina, Mackogneur, Debugant, Lucario
  battleAudioSrc: "/sounds/battle_gym_gen4.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen4.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/maylene.png",
  power: 1850,
  gen: 4,
  intelligence: 0.5,
};

export const TRAINER_LOVIS = {
  name: "Lovis",
  pokemons: [130, 195, 457, 349, 369, 419], // Léviator, Maraiste, Luminéon, Hydragon, Relicanth, Mustéflott
  battleAudioSrc: "/sounds/battle_gym_gen4.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen4.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/crasherwake.png",
  power: 2064,
  gen: 4,
  intelligence: 0.55,
};

export const TRAINER_KIMERA = {
  name: "Kiméra",
  pokemons: [92, 93, 94, 354, 426, 429], // Fantominus, Spectrum, Ectoplasma, Branette, Grodrive, Magireve
  battleAudioSrc: "/sounds/battle_gym_gen4.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen4.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/fantina.png",
  power: 2083,
  gen: 4,
  intelligence: 0.6,
};

export const TRAINER_CHARLES = {
  name: "Charles",
  pokemons: [208, 411, 330, 305, 306, 436], // Steelix, Bastiodon, Libegon, Galegon, Galeking, Archéomire
  battleAudioSrc: "/sounds/battle_gym_gen4.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen4.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/byron.png",
  power: 2451,
  gen: 4,
  intelligence: 0.65,
};

export const TRAINER_GLADYS = {
  name: "Gladys",
  pokemons: [459, 215, 460, 478, 473, 471], // Blizzi, Farfuret, Blizzaroi, Momartik, Mammochon, Givrali
  battleAudioSrc: "/sounds/battle_gym_gen4.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen4.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/candice.png",
  power: 2219,
  gen: 4,
  intelligence: 0.7,
};

export const TRAINER_TANGUY = {
  name: "Tanguy",
  pokemons: [82, 208, 310, 475, 462, 466], // Magnéton, Steelix, Élecsprint, Tarinor, Magireve, Élekable
  battleAudioSrc: "/sounds/battle_gym_gen4.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen4.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/volkner.png",
  power: 2527,
  gen: 4,
  intelligence: 0.75,
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
  intelligence: 0.95,
};

export const TRAINER_ARMANDO = {
  name: "Armando",
  pokemons: [519, 510, 505, 523, 514, 518], // Ponchiot, Leopardus, Miradar, Zéblitz, Flamoutan, Mushana
  battleAudioSrc: "/sounds/battle_gym_gen5.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen5.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/cilan.png",
  power: 1990,
  gen: 5,
  intelligence: 0.4,
};

export const TRAINER_ALOE = {
  name: "Aloé",
  pokemons: [510, 569, 626, 507, 572, 505], // Leopardus, Miasmax, Frison, Mastouffe, Nanméouïe, Miradar
  battleAudioSrc: "/sounds/battle_gym_gen5.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen5.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/lenora.png",
  power: 1983,
  gen: 5,
  intelligence: 0.45,
};

export const TRAINER_ARTIE = {
  name: "Artie",
  pokemons: [540, 541, 542, 544, 545, 588], // Larveyette, Couverdure, Manternel, Scobolide, Brutapode, Carabing
  battleAudioSrc: "/sounds/battle_gym_gen5.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen5.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/burgh.png",
  power: 1885,
  gen: 5,
  intelligence: 0.5,
};

export const TRAINER_INEZIA = {
  name: "Inezia",
  pokemons: [587, 522, 466, 523, 596, 604], // Emolga, Zébibron, Elekable, Zéblytz, Mygavolt, Ohmassacre
  battleAudioSrc: "/sounds/battle_gym_gen5.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen5.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/elesa.png",
  power: 2002,
  gen: 5,
  intelligence: 0.55,
};

export const TRAINER_BARDANE = {
  name: "Bardane",
  pokemons: [535, 536, 551, 552, 529, 530], // Tritonde, Caiman, Mascaïman, Escroco, Rototaupe, Minotaupe
  battleAudioSrc: "/sounds/battle_gym_gen5.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen5.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/clay.png",
  power: 1699,
  gen: 5,
  intelligence: 0.6,
};

export const TRAINER_CAROLINA = {
  name: "Carolina",
  pokemons: [566, 567, 570, 530, 597, 598], // Arkéapti, Aéroptéryx, Zoroark, Minotaupe, Grindur, Noacier
  battleAudioSrc: "/sounds/battle_gym_gen5.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen5.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/skyla.png",
  power: 2164,
  gen: 5,
  intelligence: 0.65,
};

export const TRAINER_ZHU = {
  name: "Zhu",
  pokemons: [614, 615, 555, 607, 608, 621], // Sorbébé, Sorboul, Darumacho, Funécire, Mélancolux, Drakkkar
  battleAudioSrc: "/sounds/battle_gym_gen5.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen5.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/brycen.png",
  power: 2351,
  gen: 5,
  intelligence: 0.7,
};

export const TRAINER_IRIS = {
  name: "Iris",
  pokemons: [567, 621, 611, 612, 635, 306], // Aéroptéryx, Drakkarmin, Incisache, Tranchodon, Trioxhydre, Galeking
  battleAudioSrc: "/sounds/battle_gym_gen5.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen5.mp3",
  img: "https://play.pokemonshowdown.com/sprites/trainers/iris.png",
  power: 2768,
  gen: 5,
  intelligence: 0.8,
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
  intelligence: 0.95,
};

export const TRAINER_LEG_2 = {
  name: "Légendaires gen 2",
  pokemons: [243, 244, 245, 249, 250, 251], // Raikou, Entei, Suicune, Lugia, Ho-Oh, Celebi
  battleAudioSrc: "/sounds/battle_leg_gen2.mp3",
  victoryAudioSrc: "/sounds/victory_red.mp3",
  img: "/leg_2.png",
  power: 2870,
  gen: "Légendaire",
  intelligence: 0.95,
};

export const TRAINER_LEG_3 = {
  name: "Légendaires gen 3",
  pokemons: [377, 378, 379, 382, 383, 384], // Regirock, Regice, Registeel, Kyogre, Groudon, Rayquaza
  battleAudioSrc: "/sounds/battle_leg_gen3.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen3.mp3",
  img: "/leg_3.png",
  power: 3201,
  gen: "Légendaire",
  intelligence: 0.95,
};

export const TRAINER_LEG_4 = {
  name: "Légendaires gen 4",
  pokemons: [483, 484, 487, 485, 486, 488], // Dialga, Palkia, Giratina, Heatran, Regigigas, Cresselia
  battleAudioSrc: "/sounds/battle_leg_gen4.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen4.mp3",
  img: "/leg_4.png",
  power: 3253,
  gen: "Légendaire",
  intelligence: 0.95,
};

export const TRAINER_LEG_5 = {
  name: "Légendaires gen 5",
  pokemons: [638, 639, 640, 643, 646, 644], // Cobaltium, Terrakium, Viridium, Reshiram, Kyurem, Zekrom
  battleAudioSrc: "/sounds/battle_leg_gen5.mp3",
  victoryAudioSrc: "/sounds/victory_gym_gen5.mp3",
  img: "/leg_5.png",
  power: 3003,
  gen: "Légendaire",
  intelligence: 0.95,
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

export const PRICES = {
  heal_partial: 30,
  heal_full: 60,
  revive: 100,
  antidote: 30,
  buy_potion: 40,
  buy_reborn: 80,
  buy_antidote: 25,
};

export function hasStatus(pokemon: PokeBattlePokemonDetails) {
  const statusEffects: (keyof PokeBattlePokemonDetails)[] = [
    "isParalyze",
    "isAsleep",
    "isFrozen",
    "isBurnt",
    "isPoisoned",
    "isSeeded",
  ];

  const activeStatusCount = statusEffects.filter(
    (status) => pokemon[status] === true,
  ).length;

  return activeStatusCount >= 1;
}

export const TOWER_BUFFS: PokeBattleBuffOption[] = [
  {
    id: "atk_buff",
    title: "Pilule de Force",
    quality: "common",
    description: "+10% Attaque & Attaque Spéciale pour toute l'équipe",
    icon: Sword,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        stats: {
          ...p.stats,
          attack: Math.round(p.stats.attack * 1.1),
          "special-attack": Math.round(p.stats["special-attack"] * 1.1),
        },
      })),
  },
  {
    id: "def_buff",
    title: "Écorce Blindée",
    quality: "common",
    description: "+10% Défense & Défense Spéciale pour toute l'équipe",
    icon: Shield,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        stats: {
          ...p.stats,
          defense: Math.round(p.stats.defense * 1.1),
          "special-defense": Math.round(p.stats["special-defense"] * 1.1),
        },
      })),
  },
  {
    id: "team_heal_buff",
    title: "Rosée Sacrée",
    quality: "common",
    description: "Soigne instantanément 25% des PV max de toute l'équipe",
    icon: Heart,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => {
        if (p.currentHp <= 0) return p;
        return {
          ...p,
          currentHp: Math.min(
            p.stats.hp,
            p.currentHp + Math.round(p.stats.hp * 0.25),
          ),
        };
      }),
  },
  {
    id: "hp_boost_1",
    title: "Pilule d'Endurance",
    quality: "common",
    description: "+15% PV Max pour toute l'équipe",
    icon: Heart,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => {
        const bonus = Math.round(p.stats.hp * 0.15);
        return {
          ...p,
          stats: { ...p.stats, hp: p.stats.hp + bonus },
          currentHp: p.currentHp > 0 ? p.currentHp + bonus : 0,
        };
      }),
  },
  {
    id: "phys_atk_boost",
    title: "Poignet Force",
    quality: "common",
    description: "+20% Attaque physique pour toute l'équipe",
    icon: Swords,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        stats: { ...p.stats, attack: Math.round(p.stats.attack * 1.2) },
      })),
  },
  {
    id: "spec_atk_boost",
    title: "Lunettes tactiques",
    quality: "common",
    description: "+20% Attaque Spéciale pour toute l'équipe",
    icon: Glasses,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        stats: {
          ...p.stats,
          "special-attack": Math.round(p.stats["special-attack"] * 1.2),
        },
      })),
  },
  {
    id: "phys_def_boost",
    title: "Plastron de Fer",
    quality: "common",
    description: "+20% Défense physique pour toute l'équipe",
    icon: ShieldAlert,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        stats: { ...p.stats, defense: Math.round(p.stats.defense * 1.2) },
      })),
  },
  {
    id: "spec_def_boost",
    title: "Cape de Brume",
    quality: "common",
    description: "+20% Défense Spéciale pour toute l'équipe",
    icon: ShieldCheck,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        stats: {
          ...p.stats,
          "special-defense": Math.round(p.stats["special-defense"] * 1.2),
        },
      })),
  },
  {
    id: "evasion_boost_pure",
    title: "Poudre Claire",
    quality: "common",
    description: "+10% d'Esquive globale pour toute l'équipe",
    icon: Wind,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        stats: { ...p.stats, evasion: Math.round(p.stats.evasion * 1.1) },
      })),
  },
  {
    id: "glass_cannon",
    title: "Orbe de Vie",
    quality: "epic",
    description: "+25% Attaque & Atk Spé, mais -15% Défense & Déf Spé globale",
    icon: Flame,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        stats: {
          ...p.stats,
          attack: Math.round(p.stats.attack * 1.25),
          "special-attack": Math.round(p.stats["special-attack"] * 1.25),
          defense: Math.round(p.stats.defense * 0.85),
          "special-defense": Math.round(p.stats["special-defense"] * 0.85),
        },
      })),
  },
  {
    id: "berserker",
    title: "Bandeau Cholérique",
    quality: "epic",
    description:
      "+35% Attaque physique, mais vos capacités perdent 10% de Précision",
    icon: Skull,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        stats: { ...p.stats, attack: Math.round(p.stats.attack * 1.35) },
        moves: p.moves.map((m) => ({
          ...m,
          accuracy: Math.max(10, m.accuracy - 10),
        })),
      })),
  },
  {
    id: "reckless_striker",
    title: "Viseur Instable",
    quality: "epic",
    description:
      "Vos attaques font un critique à coups sur, mais -20% d'Esquive globale",
    icon: Crosshair,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        stats: { ...p.stats, evasion: Math.round(p.stats.evasion * 0.8) },
        moves: p.moves.map((m: PokeBattlePokemonMove) => ({
          ...m,
          critRate: m.critRate + 2,
        })),
      })),
  },
  {
    id: "kamikaze_spirit",
    title: "Esprit Kamikaze",
    quality: "epic",
    description:
      "+40% de Puissance sur toutes les attaques, mais ajoute 15% de recul",
    icon: Bomb,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.power > 0
            ? { ...m, power: Math.round(m.power * 1.4), drain: m.drain - 15 }
            : m,
        ),
      })),
  },
  {
    id: "blind_fury",
    title: "Lentille Fêlée",
    quality: "epic",
    description: "+30% Attaque Spéciale, mais -15% de Précision globale",
    icon: EyeOff,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        stats: {
          ...p.stats,
          "special-attack": Math.round(p.stats["special-attack"] * 1.3),
          accuracy: Math.round(p.stats.accuracy * 0.85),
        },
      })),
  },
  {
    id: "iron_anchor",
    title: "Ancre de Plomb",
    quality: "epic",
    description: "+30% Défense Physique, mais -15% d'Esquive globale",
    icon: Anchor,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        stats: {
          ...p.stats,
          defense: Math.round(p.stats.defense * 1.3),
          evasion: Math.round(p.stats.evasion * 0.85),
        },
      })),
  },
  {
    id: "emergency_heal",
    title: "Poudre Vitalité",
    quality: "common",
    description:
      "Soigne instantanément 50% des PV max du Pokémon actif uniquement",
    icon: Activity,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) =>
        p.isActive && p.currentHp > 0
          ? {
              ...p,
              currentHp: Math.min(
                p.stats.hp,
                p.currentHp + Math.round(p.stats.hp * 0.5),
              ),
            }
          : p,
      ),
  },
  {
    id: "phoenix_down",
    title: "Plume de Phénix",
    quality: "epic",
    description: "Réanime TOUS les Pokémon K.O. avec 25% de leurs PV max",
    icon: ShieldPlus,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) =>
        p.currentHp <= 0
          ? { ...p, currentHp: Math.round(p.stats.hp * 0.25) }
          : p,
      ),
  },
  {
    id: "vampiric_touch",
    title: "Sangsue Sanglante",
    quality: "epic",
    description: "Toutes les capacités offensives gagnent +15% de vol de vie",
    icon: Droplet,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.power > 0 ? { ...m, drain: m.drain + 15 } : m,
        ),
      })),
  },
  {
    id: "holy_blessing",
    title: "Bénédiction Curative",
    quality: "common",
    description: "Augmente l'efficacité des moves de soin de l'équipe de 25%",
    icon: PlusCircle,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.healing > 0 ? { ...m, healing: Math.round(m.healing * 1.25) } : m,
        ),
      })),
  },
  {
    id: "last_chance_heal",
    title: "Rosée de Survie",
    quality: "common",
    description:
      "Soigne 15% des PV max pour chaque Pokémon ayant moins de 30% de ses PV",
    icon: HeartHandshake,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => {
        if (p.currentHp > 0 && p.currentHp < p.stats.hp * 0.3) {
          return {
            ...p,
            currentHp: Math.min(
              p.stats.hp,
              p.currentHp + Math.round(p.stats.hp * 0.15),
            ),
          };
        }
        return p;
      }),
  },
  {
    id: "vampire_lord",
    title: "Crocs Sanglants",
    quality: "epic",
    description:
      "Les capacités qui avaient déjà du vol de vie voient leur drain doubler",
    icon: Scissors,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.drain > 0 ? { ...m, drain: m.drain * 2 } : m,
        ),
      })),
  },
  {
    id: "status_booster",
    title: "Venin Dilué",
    quality: "common",
    description: "+20% de chances d'appliquer des altérations d'état",
    icon: Biohazard,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.status !== "none"
            ? { ...m, statusChance: Math.min(100, m.statusChance + 20) }
            : m,
        ),
      })),
  },
  {
    id: "flinch_master",
    title: "Rorqual Assommant",
    quality: "common",
    description:
      "Toutes les capacités offensives gagnent +15% de chances d'apeurer l'adversaire",
    icon: Hammer,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.power > 0
            ? { ...m, flinchChance: Math.min(100, m.flinchChance + 15) }
            : m,
        ),
      })),
  },
  {
    id: "purification",
    title: "Clochette Pure",
    quality: "common",
    description:
      "Soigne instantanément toutes les altérations d'état négatives de l'équipe",
    icon: Bell,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        isParalyze: false,
        isAsleep: false,
        isFrozen: false,
        isBurnt: false,
        isConfused: false,
        isPoisoned: false,
        isSeeded: false,
        confusionTurns: 0,
        sleepTurns: 0,
      })),
  },
  {
    id: "hypnotic_fury",
    title: "Sable du Marchand",
    quality: "common",
    description: "Les capacités infligeant le Sommeil durent 1 tour de plus",
    icon: Moon,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        sleepTurns: p.sleepTurns > 0 ? p.sleepTurns + 1 : 0,
      })),
  },
  {
    id: "confuse_ray",
    title: "Miroir Brisé",
    quality: "common",
    description: "Les capacités infligeant la Confusion durent 1 tour de plus",
    icon: HelpCircle,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        confusionTurns: p.confusionTurns > 0 ? p.confusionTurns + 1 : 0,
      })),
  },
  {
    id: "physical_mastery",
    title: "Gantelets de Choc",
    quality: "common",
    description: "+15% de dégâts sur toutes les attaques Physiques",
    icon: Swords,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.category === "physical"
            ? { ...m, power: Math.round(m.power * 1.15) }
            : m,
        ),
      })),
  },
  {
    id: "special_mastery",
    title: "Grimoire Ancien",
    quality: "common",
    description: "+15% de dégâts sur toutes les attaques Spéciales",
    icon: Wand2,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.category === "special"
            ? { ...m, power: Math.round(m.power * 1.15) }
            : m,
        ),
      })),
  },
  {
    id: "multi_hit_fury",
    title: "Bandeau Rafale",
    quality: "common",
    description:
      "Les attaques à coups multiples frappent au moins 1 fois de plus",
    icon: Dices,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.maxHits > 1
            ? { ...m, minHits: Math.min(m.maxHits, m.minHits + 1) }
            : m,
        ),
      })),
  },
  {
    id: "perfect_accuracy",
    title: "Viseur Laser",
    quality: "common",
    description:
      "Toutes les capacités de l'équipe gagnent +20 de Précision fixe",
    icon: Target,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) => ({
          ...m,
          accuracy: Math.min(100, m.accuracy + 20),
        })),
      })),
  },
  {
    id: "elemental_starter_boost",
    title: "Trilogie Élémentaire",
    quality: "common",
    description:
      "+25% de puissance pour toutes les attaques de type Feu, Eau et Plante",
    icon: Sparkles,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.type === "feu" || m.type === "eau" || m.type === "plante"
            ? { ...m, power: Math.round(m.power * 1.25) }
            : m,
        ),
      })),
  },
  {
    id: "elemental_electric_fury",
    title: "Orage Surchargé",
    quality: "common",
    description:
      "Les attaques de type Éléctrik infligent +30% de dégâts et ont +15% de chances de paralyser",
    icon: Zap,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.type === "électrik"
            ? {
                ...m,
                power: Math.round(m.power * 1.3),
                statusChance:
                  m.status === "paralysis"
                    ? Math.min(100, m.statusChance + 15)
                    : m.statusChance,
              }
            : m,
        ),
      })),
  },
  {
    id: "elemental_ice_freeze",
    title: "Zéro Absolu",
    quality: "common",
    description:
      "Les capacités de type Glace gagnent +30% de dégâts et ont +15% de chances de gelée",
    icon: Snowflake,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.type === "glace"
            ? {
                ...m,
                power: Math.round(m.power * 1.3),
                statusChance:
                  m.status === "freeze"
                    ? Math.min(100, m.statusChance + 15)
                    : m.statusChance,
              }
            : m,
        ),
      })),
  },
  {
    id: "elemental_dragon_rage",
    title: "Colère Draconique",
    quality: "common",
    description:
      "Les moves de type Dragon voient leurs attaques automatiqument faire un critique",
    icon: FlameKindling,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.type === "dragon" ? { ...m, critRate: m.critRate + 2 } : m,
        ),
      })),
  },
  {
    id: "elemental_dark_ghost",
    title: "Ombre Malveillante",
    quality: "common",
    description:
      "+30% de puissance sur toutes les attaques de type Spectre et Ténèbres",
    icon: Moon,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.type === "spectre" || m.type === "ténèbres"
            ? { ...m, power: Math.round(m.power * 1.3) }
            : m,
        ),
      })),
  },
  {
    id: "elemental_fight_steel",
    title: "Alliage de Combat",
    quality: "common",
    description: "Augmente de +25% la Défense physique",
    icon: Shield,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => {
        return {
          ...p,
          stats: {
            ...p.stats,
            defense: Math.round(p.stats.defense * 1.25),
          },
        };
      }),
  },
  {
    id: "elemental_normal_tactician",
    title: "Normalité Brute",
    quality: "common",
    description: "Les attaques de type Normal gagnent +50% de puissance",
    icon: Circle,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.type === "normal" ? { ...m, power: Math.round(m.power * 1.5) } : m,
        ),
      })),
  },
  {
    id: "elemental_poison_drain",
    title: "Toxine Vampirique",
    quality: "common",
    description:
      "Toutes les capacités de type Poison gagnent +30% de vol de vie",
    icon: Skull,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.type === "poison" ? { ...m, drain: m.drain + 30 } : m,
        ),
      })),
  },
  {
    id: "elemental_psy_confusion",
    title: "Surcharge Psychique",
    quality: "common",
    description:
      "Les attaques de type Psy infligent +30% de dégâts et ont +20% de chances de rendre confus",
    icon: Brain,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.type === "psy"
            ? {
                ...m,
                power: Math.round(m.power * 1.3),
                statusChance:
                  m.status === "confusion"
                    ? Math.min(100, m.statusChance + 20)
                    : m.statusChance,
              }
            : m,
        ),
      })),
  },
  {
    id: "elemental_combat_shatter",
    title: "Ceinture Noire",
    quality: "common",
    description: "Les capacités de type Combat infligent +30% de dégâts",
    icon: Swords,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.type === "combat" ? { ...m, power: Math.round(m.power * 1.3) } : m,
        ),
      })),
  },
  {
    id: "elemental_acier_titan",
    title: "Blindage Alliage",
    quality: "common",
    description:
      "Les capacités de type Acier infligent +30% de dégâts et boost de votre défense physique de 20%",
    icon: ShieldAlert,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        stats: { ...p.stats, defense: Math.round(p.stats.defense * 1.2) },
        moves: p.moves.map((m) =>
          m.type === "acier" ? { ...m, power: Math.round(m.power * 1.3) } : m,
        ),
      })),
  },
  {
    id: "elemental_fee_pixie",
    title: "Poudre de Fée",
    quality: "common",
    description:
      "Les attaques de type Fée gagnent +25% de puissance et augmentent l'esquive du lanceur de 10%",
    icon: Sparkles,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        stats: { ...p.stats, evasion: Math.round(p.stats.evasion * 1.1) },
        moves: p.moves.map((m) =>
          m.type === "fée" ? { ...m, power: Math.round(m.power * 1.25) } : m,
        ),
      })),
  },
  {
    id: "elemental_sol_earthquake",
    title: "Fissure Sismique",
    quality: "common",
    description: "Les attaques de type Sol infligent +35% de dégâts",
    icon: Mountain,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.type === "sol" ? { ...m, power: Math.round(m.power * 1.35) } : m,
        ),
      })),
  },
  {
    id: "elemental_vol_hurricane",
    title: "Courant Porteur",
    quality: "common",
    description:
      "Les attaques de type Vol ont désormais +25 de Précision fixe et infligent +20% de dégâts",
    icon: Wind,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.type === "vol"
            ? {
                ...m,
                power: Math.round(m.power * 1.2),
                accuracy: Math.min(100, m.accuracy + 25),
              }
            : m,
        ),
      })),
  },
  {
    id: "elemental_insecte_swarm",
    title: "Nuée de Guêpes",
    quality: "common",
    description:
      "Les capacités de type Insecte frappent automatiqument avec un critique",
    icon: Bug,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.type === "insecte" ? { ...m, critRate: m.critRate + 2 } : m,
        ),
      })),
  },
  {
    id: "elemental_roche_fortress",
    title: "Polymérisation Rocheuse",
    quality: "common",
    description:
      "+35% de puissance sur les moves de type Roche et augmente la Défense physique de 15%",
    icon: BrickWall,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        stats: { ...p.stats, defense: Math.round(p.stats.defense * 1.15) },
        moves: p.moves.map((m) =>
          m.type === "roche" ? { ...m, power: Math.round(m.power * 1.35) } : m,
        ),
      })),
  },
  {
    id: "cheat_exodia_strike",
    title: "Extermination Totale",
    quality: "legendary",
    description: "Multiplie par 2 la puissance de TOUTES les attaques",
    icon: Flame,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.category !== "status" ? { ...m, power: m.power * 3 } : m,
        ),
      })),
  },
  {
    id: "cheat_immortal_vampire",
    title: "Pacte Sanglant d'Yveltal",
    quality: "legendary",
    description:
      "Octroie un vol de vie de 75% sur toutes les capacités infligeant des dégâts",
    icon: Droplet,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) => (m.power > 0 ? { ...m, drain: 75 } : m)),
      })),
  },
  {
    id: "cheat_status_apocalypse",
    title: "Fléau de Nécrozma",
    quality: "legendary",
    description:
      "Toutes les capacités de l'équipe ont désormais 100% de chances d'appliquer leur statut",
    icon: Biohazard,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.status !== "none" ? { ...m, statusChance: 100 } : m,
        ),
      })),
  },
  {
    id: "cheat_flinch_lock",
    title: "Onde de Choc Absolue",
    quality: "legendary",
    description:
      "Toutes les attaques offensives ont 50% de chances d'apeurer et d'empêcher l'ennemi d'agir",
    icon: Hammer,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.power > 0
            ? { ...m, flinchChance: Math.max(m.flinchChance, 50) }
            : m,
        ),
      })),
  },
  {
    id: "cheat_miracle_guard",
    title: "Garde Mystik Suprême",
    quality: "legendary",
    description:
      "Augmente la Défense et la Défense Spéciale de toute l'équipe de +100%",
    icon: ShieldCheck,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        stats: {
          ...p.stats,
          defense: p.stats.defense * 2,
          "special-defense": p.stats["special-defense"] * 2,
        },
      })),
  },
  {
    id: "cheat_multihit_god",
    title: "Mitrailleuse Infinie",
    quality: "legendary",
    description:
      "Toutes les attaques à coups multiples frappent désormais TOUJOURS le nombre maximum de fois",
    icon: Dices,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.maxHits > 1 ? { ...m, minHits: m.maxHits } : m,
        ),
      })),
  },
  {
    id: "cheat_titan_hp",
    title: "Énergie Infinie d'Eternatus",
    quality: "legendary",
    description:
      "Double les PV Max de toute l'équipe et soigne instantanément l'intégralité des PV",
    icon: HeartPulse,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => {
        const newMaxHp = p.stats.hp * 2;
        return {
          ...p,
          stats: { ...p.stats, hp: newMaxHp },
          currentHp: newMaxHp,
        };
      }),
  },
  {
    id: "cheat_god_mode",
    title: "Bénédiction d'Arceus",
    quality: "rare",
    description:
      "+20% à ABSOLUMENT TOUTES les statistiques globales de l'équipe",
    icon: Crown,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        stats: {
          hp: Math.round(p.stats.hp * 1.2),
          attack: Math.round(p.stats.attack * 1.2),
          defense: Math.round(p.stats.defense * 1.2),
          "special-attack": Math.round(p.stats["special-attack"] * 1.2),
          "special-defense": Math.round(p.stats["special-defense"] * 1.2),
          speed: p.stats.speed,
          evasion: Math.round(p.stats.evasion * 1.2),
          accuracy: Math.round(p.stats.accuracy * 1.2),
        },
        currentHp:
          p.currentHp > 0 ? p.currentHp + Math.round(p.stats.hp * 0.2) : 0,
      })),
  },
  {
    id: "cheat_full_revive_heal",
    title: "Larme de Célébi",
    quality: "rare",
    description:
      "Soigne à 100% les PV de toute l'équipe ET réanime tous les morts à 100% des PV",
    icon: HeartHandshake,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({ ...p, currentHp: p.stats.hp })),
  },
  {
    id: "cheat_ultra_evasion",
    title: "Ultra Instinct",
    quality: "rare",
    description: "Augmente l'esquive de 15% pour toute l'équipe",
    icon: Ghost,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        stats: { ...p.stats, evasion: p.stats.evasion * 1.15 },
      })),
  },
  {
    id: "cheat_leech_seed_curse",
    title: "Symbiose Sylvestre",
    quality: "rare",
    description:
      "Toutes les capacités de catégorie 'status' appliquent désormais Vampigraine à la place du status de base",
    icon: Sprout,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.category === "status"
            ? { ...m, status: "leech-seed" as const, statusChance: 100 }
            : m,
        ),
      })),
  },
  {
    id: "rare_type_coverage",
    title: "Maîtrise Caméléon",
    quality: "rare",
    description:
      "Vos attaques de type Normal prennent désormais le type principal du Pokémon qui les utilise",
    icon: RefreshCw,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.type === "normal" && p.types.length > 0
            ? { ...m, type: p.types[0] as any }
            : m,
        ),
      })),
  },
  {
    id: "rare_comeback_kid",
    title: "Esprit de Révolte",
    quality: "rare",
    description: "Augmente les attaques Physiques et Spéciales de +50% dégâts",
    icon: Flame,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => {
        return {
          ...p,
          moves: p.moves.map((m) =>
            m.power > 0 ? { ...m, power: Math.round(m.power * 1.5) } : m,
          ),
        };
      }),
  },
  {
    id: "rare_calculated_risk",
    title: "Lentille Zoom",
    quality: "rare",
    description:
      "Si une capacité a moins de 80% de Précision, elle gagne +25% de Précision fixe et +1 au taux de Critique",
    icon: Target,
    action: (pokes: PokeBattlePokemonDetails[]) =>
      pokes.map((p) => ({
        ...p,
        moves: p.moves.map((m) =>
          m.accuracy < 80
            ? {
                ...m,
                accuracy: Math.min(100, m.accuracy + 25),
                critRate: m.critRate + 1,
              }
            : m,
        ),
      })),
  },
];

export const BATTLE_MUSIC = [
  "/sounds/battle_blue.mp3",
  "/sounds/battle_cynthia.mp3",
  "/sounds/battle_ghechis.mp3",
  "/sounds/battle_gym_gen1.mp3",
  "/sounds/battle_gym_gen2.mp3",
  "/sounds/battle_gym_gen3.mp3",
  "/sounds/battle_gym_gen4.mp3",
  "/sounds/battle_gym_gen5.mp3",
  "/sounds/battle_leg_gen2.mp3",
  "/sounds/battle_leg_gen3.mp3",
  "/sounds/battle_leg_gen4.mp3",
  "/sounds/battle_leg_gen5.mp3",
  "/sounds/battle_red.mp3",
  "/sounds/battle_steven.mp3",
  "/sounds/battle.mp3",
];

export const VICTORY_MUSIC = [
  "/sounds/victory_blue.mp3",
  "/sounds/victory_cynthia.mp3",
  "/sounds/victory_ghechis.mp3",
  "/sounds/victory_gym_gen3.mp3",
  "/sounds/victory_gym_gen4.mp3",
  "/sounds/victory_gym_gen5.mp3",
  "/sounds/victory_red.mp3",
  "/sounds/victory_steven.mp3",
  "/sounds/victory.mp3",
];

export function isEven(n: number) {
  return n % 2 == 0;
}

export const QUALITY_CONFIG = {
  common: {
    border: "border-slate-800 bg-slate-950/40",
    iconBg: "bg-slate-900 border-slate-700",
    iconColor: "text-slate-400",
    badge: "bg-slate-800 text-slate-400 border-slate-700",
    label: "Commun",
  },
  rare: {
    border: "border-blue-900/50 bg-blue-950/10",
    iconBg: "bg-blue-950 border-blue-500/30",
    iconColor: "text-blue-400",
    badge: "bg-blue-950 text-blue-400 border-blue-500/30",
    label: "Rare",
  },
  epic: {
    border: "border-purple-900/60 bg-purple-950/10",
    iconBg: "bg-purple-950 border-purple-500/30",
    iconColor: "text-purple-400",
    badge: "bg-purple-950 text-purple-400 border-purple-500/30",
    label: "Épique",
  },
  legendary: {
    border:
      "border-amber-500/30 bg-amber-950/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]",
    iconBg: "bg-amber-950 border-amber-500/40 animate-pulse",
    iconColor: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/40 font-black",
    label: "Légendaire",
  },
};
