import { getTypes } from "@/lib/fetch";
import FrontPage from "./FrontPage";

async function getPokemonInfo(id: number) {
  const pokemon = `https://tyradex.vercel.app/api/v1/pokemon/${id}`
  const response = await fetch(pokemon, {
    method: 'GET',
  });
  return await response.json();
}

export default async function Page({ params }: any) {
  const pokemon = await getPokemonInfo(params.id);
  const types = await getTypes();
  return (
    <>
      <FrontPage pokemon={pokemon} types={types} />
    </>
  );
}
