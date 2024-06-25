import FrontPage from "./FrontPage";

async function getPokemonInfo(id: number) {
  const pokemon = `https://tyradex.vercel.app/api/v1/pokemon/${id}`
  const response = await fetch(pokemon, {
    method: 'GET',
  });
  return await response.json();
}

// async function getTypes() {
//   const url = "https://tyradex.tech/api/v1/types"
//   const response = await fetch(url, {
//     method: 'GET',
//   });
//   return await response.json();
// }

export default async function Page({ params }: any) {

  const pokemon = await getPokemonInfo(params.id);
  return (
    <>
      <FrontPage pokemon={pokemon} />
    </>
  );
}
