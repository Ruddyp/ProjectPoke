export type Pokemon = {
  pokedex_id: number;
  generation: number;
  category: string;
  name: PokemonName;
  sprites: PokemonSprites;
  types: PokemonTypes[] | null;
  talents: PokemonTalents[] | null;
  stats: PokemonStats | null;
  resistances: PokemonResistances[] | null;
  evolution: PokemonEvolution | null;
  height: string | null;
  weight: string | null;
  egg_group: string[] | null;
  sexe: PokemonSexe | null;
  catch_rate: number | null;
  level_100: number | null;
  formes: PokemonForme[] | null;
  cardStyle?: {
    backgroundImage: string;
  };
};

export type PokemonName = {
  fr: string;
  en: string;
  jp: string;
};

export type PokemonSprites = {
  regular: string;
  shiny: string | null;
  gmax: {
    regular: string | null;
    shiny: string | null;
  };
};

export type PokemonTypes = {
  name: string;
  image: string;
};

export type PokemonTalents = {
  name: string;
  tc: boolean;
};

export type PokemonStats = {
  hp: number;
  atk: number;
  def: number;
  spe_atk: number;
  spe_def: number;
  vit: number;
};

export type PokemonResistances = {
  name: string;
  multiplier: number;
};

export type MultiplierResistances = 0 | 0.25 | 0.5 | 1 | 2 | 4;

export type PokemonEvolution = {
  pre: Evolution[] | null;
  next: Evolution[] | null;
  mega: MegaEvolution[] | null;
};

export type PokemonSexe = {
  male: number;
  female: number;
};

export type PokemonForme = {
  region: string;
  name: PokemonName;
};

export type Evolution = {
  pokedex_id: number;
  name: string;
  condition: string;
};

export type MegaEvolution = {
  orbe: string;
  sprites: {
    regular: string;
    shiny: string | null;
  };
};

export type Types = {
  id: number;
  name: PokemonName;
  sprites: string;
  resistances: PokemonResistances[];
};

export type Generation = {
  generation: number;
  from: number;
  to: number;
  isActive?: boolean;
};

export type PokemonColorType =
  | "plante"
  | "plante_light"
  | "feu_light"
  | "poison_light"
  | "poison"
  | "feu"
  | "feu_light"
  | "vol"
  | "vol_light"
  | "eau"
  | "eau_light"
  | "insecte"
  | "insecte_light"
  | "normal"
  | "normal_light"
  | "électrik"
  | "électrik_light"
  | "sol"
  | "sol_light"
  | "fée"
  | "fée_light"
  | "combat"
  | "combat_light"
  | "psy"
  | "psy_light"
  | "roche"
  | "roche_light"
  | "acier"
  | "acier_light"
  | "glace"
  | "glace_light"
  | "spectre"
  | "spectre_light"
  | "ténèbres"
  | "ténèbres_light"
  | "dragon"
  | "dragon_light";

type PokeApiPokemon = {
  cries: {
    latest: string;
    legacy: string;
  };
};

type PokeApiPokemonSpecies = {
  flavor_text_entries: PokeApiFlavorTextEntries[];
  names: {
    name: string;
    language: PokeApiLanguage;
  }[];
};

type PokeApiFlavorTextEntries = {
  flavor_text: string;
  language: PokeApiLanguage;
  version: PokeApiVersion;
};

type PokeApiLanguage = {
  name: string;
  url: string;
};

type PokeApiVersion = {
  name: string;
  url: string;
};

type PokeApiMove = {
  name: string;
  names: {
    name: string;
    language: PokeApiLanguage;
  }[];
  type: {
    name: string;
  };
};

type PokeApiMoves = {
  [key: string]: PokeApiMove;
};

type PoGoApiShinyPokemonList = {
  [key: number]: PoGoApiShinyPokemon;
};

type PoGoApiShinyPokemon = {
  name: string;
  found_wild: boolean;
  found_raid: boolean;
  found_egg: boolean;
  found_evolution: boolean;
  found_photobomb: boolean;
  found_research: boolean;
  id: number;
};

type PoGoApiPokemonMaxCp = {
  form: string;
  max_cp: number;
  pokemon_id: number;
  pokemon_name: string;
};

interface PoGoApiJsonList<T> {
  [key: string]: T[];
}

type PoGoApiBuddyDistance = {
  distance: number;
  pokemon_id: number;
  pokemon_name: string;
  form: string;
};

type PoGoApiCandyEvolve = {
  candy_required: number;
  form: string;
  pokemon_id: number;
  pokemon_name: string;
};

type PoGoApiPokemonRarity = {
  rarity: string;
  form: string;
  pokemon_id: number;
  pokemon_name: string;
};

type PoGoApiCurrentPokemonMoves = {
  charged_moves: string[];
  fast_moves: string[];
  elite_charged_moves: string[];
  elite_fast_moves: string[];
  form: string;
  pokemon_id: number;
  pokemon_name: string;
};

type PoGoApiPvpMoves = {
  energy_delta: number;
  move_id: number;
  power: number;
  turn_duration: number;
  name: string;
  type: string;
};

type PoGoApiEvolutions = {
  pokemon_id: number;
  pokemon_name: string;
  evolutions: PoGoApiEvolution[];
};

type PoGoApiEvolution = {
  pokemon_id: number;
  pokemon_name: string;
  form: string;
  candy_required: number;
  buddy_distance_required?: number;
  must_be_buddy_to_evolve?: boolean;
  only_evolves_in_daytime?: boolean;
  only_evolves_in_nighttime?: boolean;
  priority?: number;
  lure_required?: string;
  item_required?: string;
  no_candy_cost_if_traded?: boolean;
  gender_required?: string;
};

type Raid = {
  pokemon_id: number;
  boss_cp: number | undefined;
  max_cp: number | undefined;
  max_cp_boost: number | undefined;
  additional_info: string | undefined;
  tier: string;
};

export type MemoryGameStatus = "waiting" | "ongoing" | "ending";
export type MemoryTuileType = {
  source: string;
  flipState: boolean;
  id: number;
};

export type MemoryDifficulty = "easy" | "intermediate" | "hard";

export type PokeBattlePokemonMove = {
  id: number;

  // noms
  name: string;

  // combat
  power: number;
  accuracy: number;
  pp: number;
  priority: number;

  // type / catégorie
  type: PokeBattlePokemonType;
  category: PokeBattleMoveCategory;

  // status
  status: PokeBattlePokemonStatus;
  statusChance: number;

  // effets secondaires
  flinchChance: number;
  critRate: number;

  // soin / recoil
  drain: number;
  healing: number;

  // multi hit
  minHits: number;
  maxHits: number;

  // buffs / debuffs
  targetBuff: string;
  statChanges: {
    stat: PokeBattlePokemonStatName;
    change: number;
  }[];

  // cible
  target: PokeBattlePokemonTarget;

  // description
  description: string;
};

export type PokeBattlePokemonStats = {
  hp: number;
  attack: number;
  defense: number;
  "special-attack": number;
  "special-defense": number;
  speed: number;
  evasion: number;
  accuracy: number;
};

export type PokeBattlePokemonSprites = {
  front: string | null;
  back: string | null;
};

export type PokeBattlePokemonTypeChart = {
  name: string;
  multiplier: number;
};

export type PokeBattlePokemonDetails = {
  id: number;

  // nom FR
  name: string;

  // cries
  cries: string | null;

  // types FR
  types: string[];

  // stats
  stats: PokeBattlePokemonStats;

  // sprites
  sprites: PokeBattlePokemonSprites;
  spritesFallback: PokeBattlePokemonSprites;

  // résistances / faiblesses
  typeChart: PokeBattlePokemonTypeChart[];

  // attaques
  moves: PokeBattlePokemonMove[];

  isActive: boolean;
  isFlinch: boolean;
  isParalyze: boolean;
  isAsleep: boolean;
  isFrozen: boolean;
  isBurnt: boolean;
  isConfused: boolean;
  isPoisoned: boolean;
  isSeeded: boolean;
  isRecharging: boolean;
  confusionTurns: number;
  sleepTurns: number;
  currentHp: number;
};

export type PokeBattleMoveCategory = "physical" | "special" | "status";

export type PokeBattlePokemonStatus =
  | "none"
  | "paralysis"
  | "sleep"
  | "freeze"
  | "burn"
  | "poison"
  | "confusion"
  | "infatuation"
  | "trap"
  | "nightmare"
  | "torment"
  | "disable"
  | "yawn"
  | "leech-seed";

export type PokeBattlePokemonTarget = "selected-pokemon" | "user";

export type PokeBattlePokemonStatName =
  | "hp"
  | "attack"
  | "defense"
  | "special-attack"
  | "special-defense"
  | "speed"
  | "accuracy"
  | "evasion";

export type PokeBattlePokemonType =
  | "normal"
  | "feu"
  | "eau"
  | "plante"
  | "électrik"
  | "glace"
  | "combat"
  | "poison"
  | "sol"
  | "vol"
  | "psy"
  | "insecte"
  | "roche"
  | "spectre"
  | "dragon"
  | "ténèbres"
  | "acier"
  | "fée";

export type PokeBattleGameStatus =
  | "waiting"
  | "presentation"
  | "user_turn"
  | "ending"
  | "enemy_turn"
  | "tower_market"
  | "intermission";

export type PokeBattleSound =
  | PokeBattlePokemonType
  | PokeBattlePokemonStatus
  | "poison-status"
  | "status"
  | "stat-up"
  | "stat-down"
  | "leech-seed-dgt"
  | "effective"
  | "weak"
  | "normal_hit"
  | "KO";

export type PokeBattleObjectType = "heal" | "reborn" | "status";

export type PokeBattleObject = {
  name: string;
  type: PokeBattleObjectType;
  quantity: number;
  src: string;
};

export type PokeBattleTrainer = {
  name: string;
  pokemons: number[];
  battleAudioSrc: string;
  victoryAudioSrc: string;
  img: string;
  power: number;
  gen: number | string;
  intelligence: number;
};

export type PokeBattleMode = "pve" | "pvp" | "tower";

export type PokeBattleBuffOption = {
  id: string;
  title: string;
  description: string;
  quality: "common" | "rare" | "epic" | "legendary";
  icon: any;
  action: (pokemons: any[]) => any[];
};
