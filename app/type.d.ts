export type Pokemon = {
    pokedex_id: number,
    generation: number,
    category: string,
    name: PokemonName,
    sprites: PokemonSprites,
    types: PokemonTypes[],
    talents: PokemonTalents[] | null,
    stats: PokemonStats,
    resistances: PokemonResistances[],
    evolution: PokemonEvolution,
    height: string,
    weight: string,
    egg_group: string[] | null,
    sexe: PokemonSexe | null,
    catch_rate: number,
    level_100: number,
    formes: PokemonForme[] | null
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
    hp: string;
    atk: string;
    def: string;
    spe_atk: string;
    spe_def: string;
    vit: string;
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
