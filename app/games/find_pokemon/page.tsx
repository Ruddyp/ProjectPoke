import { Generation, Pokemon, Types } from "@/app/type";
import FrontPage from "./FrontPage";
import { getPokemons, getTypes } from "@/lib/fetch";

async function getGenerations() {
  const url = "https://tyradex.app/api/v1/gen";
  const response = await fetch(url, {
    method: "GET",
  });
  return await response.json();
}

export default async function Page() {
  const pokemons: Pokemon[] = await getPokemons();
  const types: Types[] = await getTypes();
  let generations: Generation[] = await getGenerations();
  generations.forEach((generation: Generation) => {
    Object.assign(generation, { isActive: true });
  });
  return (
    <>
      <FrontPage pokemons={pokemons} types={types} generations={generations} />
    </>
  );
}
