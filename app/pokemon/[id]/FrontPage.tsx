'use client'

import { Pokemon, Types } from "@/app/type"
import PokemonCombobox from "@/components/generic/pokemonCombobox"
import PokemonTabs from "@/components/singlePokemon/pokemonTabs"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react"

type FrontPageProps = {
  pokemon: Pokemon;
  types: Types[];
}


export default function FrontPage({ pokemon, types }: FrontPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabDefaultValue = searchParams.get('tab') ?? 'information';
  const tabGoDefaultValue = searchParams.get('tab_go') ?? 'info_gen_go';
  const [tab, setTab] = useState(tabDefaultValue);
  const [tabGo, setTabGo] = useState(tabGoDefaultValue);

  useEffect(() => {
    if (tab == "pokemon_go") {
      router.push(`${pathname}?tab=${tab}&tab_go=${tabGo}`);
    } else {
      router.push(`${pathname}?tab=${tab}`);
    }
  }, [tab, tabGo, pathname, router]);

  const previousId = pokemon.pokedex_id - 1;
  const nextId = pokemon.pokedex_id + 1;

  return (
    <div className="flex flex-col items-center justify-center gap-6 m-10">
      <div className="flex flex-row gap-4 items-center justify-around">
        <Button
          variant="default"
          size="default_responsive"
          onClick={() => tab == "pokemon_go" ? router.push(`/pokemon/${previousId}?tab=${tab}&tab_go=${tabGo}`) : router.push(`/pokemon/${previousId}?tab=${tab}`)}
          disabled={previousId < 0 ? true : false}
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={3} />
          <span className="hidden sm:flex">Précédent</span>
        </Button>
        <span className="text-red-400 font-bold text-2xl sm:text-4xl">{pokemon.name.fr}</span>
        <Button
          variant="default"
          size="default_responsive"
          onClick={() => tab == "pokemon_go" ? router.push(`/pokemon/${nextId}?tab=${tab}&tab_go=${tabGo}`) : router.push(`/pokemon/${nextId}?tab=${tab}`)}
          disabled={previousId >= 1024 ? true : false}
        >
          <span className="hidden sm:flex">Suivant</span>
          <ChevronRight className="h-5 w-5" strokeWidth={3} />
        </Button>
      </div>
      <PokemonCombobox />
      <PokemonTabs
        pokemon={pokemon}
        types={types}
        tab={tab}
        setTab={setTab}
        tabGo={tabGo}
        setTabGo={setTabGo}
      />
    </div>
  )
}