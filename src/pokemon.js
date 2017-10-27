const request = require('request-promise');

const allPokemon = {
  uri: 'http://pokeapi.co/api/v2/pokemon',
  headers: {
    'User-Agent': 'Request-Promise',
  },
  json: true, // Automatically parses the JSON string in the response
};

function getAllPokemons() {
  request(allPokemon)
    .then((pokemonList) => {
      console.log(pokemonList);
    })
    .catch((err) => {
      console.log(`Could not retrieve data : ${err}`);
    });
}

getAllPokemons();
