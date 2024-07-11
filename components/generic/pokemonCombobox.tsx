'use client';

import { useEffect, useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "../ui/command";
import { Pokemon } from "@/app/type";
import SearchBar from "../searchBar";
import Image from 'next/image'
import { useRouter, useSearchParams } from "next/navigation";


function getFilteredPokemonBySearch(pokemons: Pokemon[], searchValue: string) {
    if (searchValue == "") return pokemons;
    return pokemons.filter((pokemon) => pokemon.name.fr.toLowerCase().includes(searchValue));
}

export default function PokemonCombobox() {
    const [searchValue, setSearchValue] = useState("");
    const [pokemons, setPokemons] = useState<Pokemon[]>([])
    const router = useRouter();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab') ?? 'information';
    const tabGo = searchParams.get('tab_go') ?? 'info_gen_go';

    useEffect(() => {
        async function getPokemon() {
            const url = "https://tyradex.vercel.app/api/v1/pokemon"
            const response = await fetch(url, {
                method: 'GET',
            });
            const pokemons: Pokemon[] = await response.json();
            setPokemons(pokemons);
        }
        getPokemon();
    }, [])

    return (
        <Command className="w-[230px] bg-background">
            <SearchBar onChange={setSearchValue} value={searchValue} className="w-[100%]" />
            <CommandList className={`${searchValue == "" ? "hidden" : ""} bg-secondary-foreground rounded-md mx-1 border border-slate-500`}>
                <CommandEmpty>Aucun pokémon trouvé.</CommandEmpty>
                <CommandGroup>
                    {searchValue != "" && getFilteredPokemonBySearch(pokemons, searchValue).map((pokemon) => (
                        <CommandItem
                            key={pokemon.pokedex_id}
                            value={pokemon.name.fr}
                            onSelect={(currentValue) => {
                                if (tab == "pokemon_go") {
                                    router.push(`/pokemon/${pokemon.pokedex_id}?tab=${tab}&tab_go=${tabGo}`)
                                } else {
                                    router.push(`/pokemon/${pokemon.pokedex_id}?tab=${tab}`)
                                }
                            }}
                            className="text-red-400 border-b border-t"
                        >
                            {pokemon.name.fr}
                            <div className="relative size-20 ml-1">
                                <Image
                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokedex_id}.png`}
                                    alt={`${pokemon.name.fr}`}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    );
}