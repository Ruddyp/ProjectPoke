export type Pokemon = {
    pokedex_id: number,
    generation: number,
    category: string,
    name: PokemonName,
    sprites: PokemonSprites,
    types: PokemonTypes[] | null,
    talents: PokemonTalents[] | null,
    stats: PokemonStats | null,
    resistances: PokemonResistances[] | null,
    evolution: PokemonEvolution | null,
    height: string | null,
    weight: string | null,
    egg_group: string[] | null,
    sexe: PokemonSexe | null,
    catch_rate: number | null,
    level_100: number | null,
    formes: PokemonForme[] | null,
    cardStyle?: {
        backgroundImage: string
    }
}

export type PokemonName = {
    fr: string;
    en: string;
    jp: string;
}

export type PokemonSprites = {
    regular: string;
    shiny: string | null;
    gmax: {
        regular: string | null
        shiny: string | null
    };
}

export type PokemonTypes = {
    name: string;
    image: string;
}

export type PokemonTalents = {
    name: string;
    tc: boolean;
}

export type PokemonStats = {
    hp: number;
    atk: number;
    def: number;
    spe_atk: number;
    spe_def: number;
    vit: number;
}

export type PokemonResistances = {
    name: string
    multiplier: number
}

export type MultiplierResistances = 0 | 0.25 | 0.5 | 1 | 2 | 4;

export type PokemonEvolution = {
    pre: Evolution[] | null;
    next: Evolution[] | null;
    mega: MegaEvolution[] | null
}

export type PokemonSexe = {
    male: number
    female: number
}

export type PokemonForme = {
    region: string;
    name: PokemonName;
}

export type Evolution = {
    pokedex_id: number;
    name: string;
    condition: string;
}

export type MegaEvolution = {
    orbe: string,
    sprites: {
        regular: string;
        shiny: string | null;
    }
}

export type Types = {
    id: number,
    name: PokemonName,
    sprites: string,
    resistances: PokemonResistances[],
}

export type PokemonColorType =
    'plante' |
    'plante_light' |
    'feu_light' |
    'poison_light' |
    'poison' |
    'feu' |
    'feu_light' |
    'vol' |
    'vol_light' |
    'eau' |
    'eau_light' |
    'insecte' |
    'insecte_light' |
    'normal' |
    'normal_light' |
    'électrik' |
    'électrik_light' |
    'sol' |
    'sol_light' |
    'fée' |
    'fée_light' |
    'combat' |
    'combat_light' |
    'psy' |
    'psy_light' |
    'roche' |
    'roche_light' |
    'acier' |
    'acier_light' |
    'glace' |
    'glace_light' |
    'spectre' |
    'spectre_light' |
    'ténèbres' |
    'ténèbres_light' |
    'dragon' |
    'dragon_light';


type PokeApiPokemon = {
    cries: {
        latest: string;
        legacy: string;
    }
}

type PokeApiPokemonSpecies = {
    flavor_text_entries: PokeApiFlavorTextEntries[]
}

type PokeApiFlavorTextEntries = {
    flavor_text: string;
    language: PokeApiLanguage;
    version: PokeApiVersion;
}

type PokeApiLanguage = {
    name: string;
    url: string;
}

type PokeApiVersion = {
    name: string;
    url: string;
}

type PoGoApiShinyPokemonList = {
    [key: number]: PoGoApiShinyPokemon
}

type PoGoApiShinyPokemon = {
    name: string;
    found_wild: boolean;
    found_raid: boolean;
    found_egg: boolean;
    found_evolution: boolean;
    found_photobomb: boolean;
    found_research: boolean;
    id: number;
}

type PoGoApiPokemonMaxCp = {
    form: string;
    max_cp: number;
    pokemon_id: number;
    pokemon_name: string;
}

type PoGoApiBuddyDistance = {
    distance: number;
    pokemon_id: number;
    pokemon_name: string;
    form: string;
}

type PoGoApiBuddyDistanceList = {
    [key: string]: PoGoApiBuddyDistance[];
}