import FrontPage from "./FrontPage";

async function getPokemons() {
  const allPokemon = "https://tyradex.vercel.app/api/v1/pokemon"
  const gen1 = "https://tyradex.vercel.app/api/v1/gen/1"
  const response = await fetch(gen1, {
    method: 'GET',
  });
  return await response.json();
}

async function getTypes() {
  const url = "https://tyradex.tech/api/v1/types"
  const response = await fetch(url, {
    method: 'GET',
  });
  return await response.json();
}

export default async function Page() {

  const pokemons = await getPokemons();
  const types = await getTypes();
  return (
    <>
      <FrontPage pokemons={pokemons} types={types} />
    </>
  );
}
