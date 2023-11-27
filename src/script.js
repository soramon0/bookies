const pokeContainer = document.querySelector('.pokemons');
const baseUrl = 'https://pokeapi.co/api/v2';

async function poke(endpoint) {
  let results = JSON.parse(localStorage.getItem(endpoint));
  if (!results) {
    const response = await fetch(endpoint);
    results = await response.json();
    localStorage.setItem(endpoint, JSON.stringify(results));
  }

  return results;
}

function getPokemonsList() {
  return poke(`${baseUrl}/pokemon`);
}

async function getPokemonsDetails(pokemons) {
  const promises = pokemons.map((p) => poke(p.url));

  return Promise.all(promises);
}

function createPokemonCard(pokemon) {
  const types = pokemon.types.map(
    (p) =>
      `<span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">${p.type.name}</span>`
  );

  const moves = pokemon.moves.map((p) => p.move.name).slice(0, 5);
  const imgSrc = pokemon.sprites.other['official-artwork'].front_default;

  const card = `
    <div class="max-w-sm rounded overflow-hidden shadow-lg">
      <img class="w-full" src=${imgSrc}>
      <div class="px-6 py-4">
        <div class="font-bold capitalize text-xl mb-2">${pokemon.name}</div>
        <p class="text-gray-700 text-base">
          Can perform these moves: ${moves.join(', ')}
        </p>
      </div>
      <div class="px-6 pt-4 pb-2">
        ${types.join(' ')}
      </div>
    </div>
  `;

  return card;
}

async function main() {
  try {
    const pokemons = await getPokemonsList();
    const pokemonDetails = await getPokemonsDetails(pokemons.results);
    pokemonDetails.forEach((pokemon) => {
      pokeContainer.innerHTML += createPokemonCard(pokemon);
    });
  } catch (error) {
    console.error(error);
  }
}

main();
