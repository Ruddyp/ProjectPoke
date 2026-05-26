import { PokeBattlePokemonDetails } from "@/app/type";
import { SHOWDOWN_EXCEPTIONS, simplifyMove } from "./utils";

export async function getTypes() {
  const url = "https://tyradex.app/api/v1/types";
  const response = await fetch(url, {
    method: "GET",
  });
  return await response.json();
}

export async function getPokemons() {
  const allPokemon = "https://tyradex.app/api/v1/pokemon";
  const gen1 = "https://tyradex.app/api/v1/gen/1";
  const response = await fetch(allPokemon, {
    method: "GET",
  });
  return await response.json();
}

export async function getGen1() {
  const gen1 = "https://tyradex.app/api/v1/gen/1";
  const response = await fetch(gen1, {
    method: "GET",
  });
  return await response.json();
}

export async function getPokemonDetails(
  pokemonId: number,
): Promise<PokeBattlePokemonDetails | null> {
  try {
    const pokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
    );

    if (!pokemonResponse.ok) {
      throw new Error("Pokémon introuvable");
    }

    const pokemonData = await pokemonResponse.json();

    //Récupération du nom francais
    const speciesResponse = await fetch(pokemonData.species.url);
    const speciesData = await speciesResponse.json();

    const name =
      speciesData.names.find((n: any) => n.language.name === "fr")?.name ??
      pokemonData.name;

    // Récupération des types
    const types = await Promise.all(
      pokemonData.types.map(async (t: any) => {
        const typeResponse = await fetch(t.type.url);
        const typeData = await typeResponse.json();

        return (
          typeData.names
            .find((n: any) => n.language.name === "fr")
            ?.name.toLowerCase() ?? t.type.name.toLowerCase()
        );
      }),
    );

    // Récupération du cri
    const cries = pokemonData.cries.latest ?? null;

    // Récupération des stats
    let stats = pokemonData.stats.reduce((acc: any, stat: any) => {
      acc[stat.stat.name] = stat.base_stat;
      return acc;
    }, {});

    stats = { ...stats, accuracy: 100, evasion: 100 };

    // Récupération des sprites
    let pokemonKey = "";
    if (SHOWDOWN_EXCEPTIONS[pokemonData.name.toLowerCase()]) {
      pokemonKey = SHOWDOWN_EXCEPTIONS[pokemonData.name.toLowerCase()];
    } else if (pokemonData.name.toLowerCase().endsWith("-male")) {
      pokemonKey = pokemonData.name.toLowerCase().replace("-male", "");
    } else if (pokemonData.name.toLowerCase().endsWith("-female")) {
      pokemonKey = pokemonData.name.toLowerCase().replace("-female", "");
    } else {
      pokemonKey = pokemonData.name.toLowerCase().replace(/-/g, "");
    }

    // Définition des URLs Showdown
    const showdownSprites = {
      front: `https://play.pokemonshowdown.com/sprites/ani/${pokemonKey}.gif`,
      back: `https://play.pokemonshowdown.com/sprites/ani-back/${pokemonKey}.gif`,
    };

    // Définition des URLs PokeAPI (Fallback)
    const spritesFallback = {
      front: pokemonData.sprites.front_default,
      back: pokemonData.sprites.back_default,
    };

    const sprites = {
      front: showdownSprites.front,
      back: showdownSprites.back,
    };

    // Récupération des faiblesses et résistances
    const typeResponses = await Promise.all(
      pokemonData.types.map((t: any) => fetch(t.type.url)),
    );

    const typesData = await Promise.all(typeResponses.map((r) => r.json()));

    const typeMultipliers: Record<string, number> = {};

    for (const typeData of typesData) {
      // x2 dégâts reçus
      typeData.damage_relations.double_damage_from.forEach((t: any) => {
        typeMultipliers[t.name] = (typeMultipliers[t.name] ?? 1) * 2;
      });

      // x0.5 dégâts reçus
      typeData.damage_relations.half_damage_from.forEach((t: any) => {
        typeMultipliers[t.name] = (typeMultipliers[t.name] ?? 1) * 0.5;
      });

      // immunité
      typeData.damage_relations.no_damage_from.forEach((t: any) => {
        typeMultipliers[t.name] = 0;
      });
    }

    // traduction FR des types
    const translatedTypeChart = await Promise.all(
      Object.entries(typeMultipliers).map(async ([typeName, multiplier]) => {
        const response = await fetch(
          `https://pokeapi.co/api/v2/type/${typeName}`,
        );

        const data = await response.json();

        return {
          name:
            data.names
              .find((n: any) => n.language.name === "fr")
              ?.name.toLowerCase() ?? typeName.toLowerCase(),
          multiplier,
        };
      }),
    );

    // Récupération des moves
    const moves = await Promise.all(
      pokemonData.moves.map(async ({ move }: any) => {
        try {
          const moveResponse = await fetch(move.url);

          if (!moveResponse.ok) {
            return null;
          }

          const moveData = await moveResponse.json();

          const bannedMoves = [
            "snore", // Ne marche que si on dort
            "sleep-talk", // Ne marche que si on dort et lance un move au pif
            "fake-out", // Ne marche qu'au premier tour sur le terrain
            "dream-eater", // Ne marche que si la CIBLE dort (Dévore-Rêve)
            "snatch", // Vole les boosts (Saisie)
          ];

          if (bannedMoves.includes(moveData.name)) {
            return null;
          }

          // Cibles autorisées (on évite les cibles globales, le terrain entier, etc.)
          const allowedTargets = ["selected-pokemon", "user"];
          if (!allowedTargets.includes(moveData.target?.name)) {
            return null;
          }

          // Altérations d'état autorisées
          const allowedStatus = [
            "none",
            "paralysis",
            "sleep",
            "freeze",
            "burn",
            "poison",
            "confusion",
            "leech-seed",
          ];
          const ailmentName = moveData.meta?.ailment?.name ?? "none";
          if (!allowedStatus.includes(ailmentName)) {
            return null;
          }

          // Filtrage par Catégorie de mécanique
          // On ne garde STRICTEMENT que les catégories gérables facilement :
          const allowedCategories = [
            "damage", // Dégâts purs (ex: Vive-Attaque)
            "damage-ailment", // Dégâts + chance d'altération (ex: Lance-Flammes)
            "damage-change", // Dégâts + chance de buff/debuff (ex: Coud'Boue, Nitrocharge)
            "damage-heal", // Dégâts + soin (ex: Giga-Sangsue)
            "net-good-stats", // Boosts de stats purs (ex: Danse-Lames, Reflet)
            "ailment", // Altération pure sans dégâts (ex: Cage-Éclair, Hypnose)
            "heal", // Soin pur (ex: Soin, E-Coque)
          ];
          const moveCategory = moveData.meta?.category?.name;
          if (!allowedCategories.includes(moveCategory)) {
            return null; // Élimine "unique" (Dégommage), "ohko" (Abîme), "field-effect", etc.
          }

          // Sécurité sur la puissance des attaques offensives
          // Si c'est une attaque Physique ou Spéciale, elle doit avoir une puissance chiffrée.
          // On élimine les attaques avec des dégâts fixes (Frappe Atlas) ou variables complexes (Fléau).
          if (
            moveData.damage_class.name !== "status" &&
            moveData.power === null
          ) {
            return null;
          }

          return await simplifyMove(moveData);
        } catch {
          return null;
        }
      }),
    );

    return {
      id: pokemonData.id,
      name,
      types,
      stats,
      sprites,
      spritesFallback,
      cries,
      typeChart: translatedTypeChart,
      moves: moves.filter(Boolean),
      isActive: false,
      isFlinch: false,
      isParalyze: false,
      isAsleep: false,
      isFrozen: false,
      isBurnt: false,
      isPoisoned: false,
      isConfused: false,
      isSeeded: false,
      confusionTurns: 0,
      sleepTurns: 0,
      currentHp: stats.hp,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
