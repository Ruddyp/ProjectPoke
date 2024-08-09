import { getPokemons } from "@/lib/fetch";
import { getCardBgColor } from "../pokemon/page";
import { Pokemon, Raid } from "../type";
import FrontPage from "./FrontPage";
import * as cheerio from 'cheerio';

// Fonction pour nettoyer les valeurs extraites des balises HTML
function cleanNumber(value: string): number {
  return parseInt(value.replace(/[^0-9]/g, ''), 10);
}

async function getCurrentRaids() {

  try {
    // Faire la requête pour obtenir la page HTML
    const url = "https://pokemongo.fandom.com/wiki/List_of_current_Raid_Bosses"
    const response = await fetch(url, {
      method: 'GET',
      next: {
        revalidate: 3600
      }
    });
    const html = await response.text();
    // Charger le HTML avec cheerio
    const $ = cheerio.load(html)

    // Sélectionner et extraire le contenu de la div spécifique
    const raidData: Raid[] = [];
    const raidTier: string[] = []

    $('.pogo-list-container.bg-raid').each((_, container) => {
      let currentTier = '';
      let additionalInfo = "";

      $(container).children().each((_, element) => {
        const elem = $(element);

        if (elem.hasClass('pogo-list-header')) {
          // Récupérer le texte de la balise
          currentTier = elem.text().trim()

          // Quand on rencontre un nouveau tier on réinitialise les additionnal info
          if (!raidTier.includes(currentTier)) {
            additionalInfo = ""
          }
        } else if (elem.is('p')) {
          additionalInfo = elem.text().trim();
        } else if (elem.hasClass('pogo-list-item') || elem.hasClass('pogo-list-item-desc')) {
          // Récupérer l'ID du Pokémon
          const pokemonId = cleanNumber(elem.find('.pogo-list-item-number').text().replace('#', ''));

          let bossCp = undefined;
          let maxCp = undefined;
          let maxCpBoost = undefined;
          // Récupérer les CP du boss
          const cpInfos = elem.find('.pogo-raid-item-desc').text();
          // Définir la regex pour extraire les valeurs numériques
          const regex = /Boss CP\s*([\d,]+)Max capture CP\s*([\d,]+)\s*([\d,]+)/;
          const match = cpInfos.match(regex);
          if (match) {
            // Extraire et nettoyer les valeurs
            bossCp = parseInt(match[1].replace(/,/g, ''), 10);
            maxCp = parseInt(match[2].replace(/,/g, ''), 10);
            maxCpBoost = parseInt(match[3].replace(/,/g, ''), 10);
          }

          // Ajouter les données au tableau du tier correspondant
          raidData.push({
            pokemon_id: pokemonId,
            boss_cp: bossCp,
            max_cp: maxCp,
            max_cp_boost: maxCpBoost,
            additional_info: additionalInfo != "" ? additionalInfo : undefined,
            tier: currentTier,
          });

        }
      });
    });
    return raidData
  } catch (error) {

  }
}

export default async function Page() {
  // https://pokemongo.fandom.com/wiki/List_of_current_Raid_Bosses
  const raids = await getCurrentRaids();
  // const raids = undefined
  let pokemons = await getPokemons();
  pokemons.forEach((pokemon: Pokemon) => {
    Object.assign(pokemon, { cardStyle: getCardBgColor(pokemon.types) });
  });

  return (
    <>
      <FrontPage raids={raids} pokemons={pokemons} />
    </>
  );
}