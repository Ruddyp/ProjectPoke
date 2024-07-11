export async function getTypes() {
    const url = "https://tyradex.tech/api/v1/types"
    const response = await fetch(url, {
        method: 'GET',
    });
    return await response.json();
}

export async function getPokemons() {
    const allPokemon = "https://tyradex.vercel.app/api/v1/pokemon"
    const gen1 = "https://tyradex.vercel.app/api/v1/gen/1"
    const response = await fetch(allPokemon, {
        method: 'GET',
    });
    return await response.json();
}