const PokedexPromise = require('pokedex-promise-v2');
const fs = require('fs');

const Pokedex = new PokedexPromise();

const pokemons = [];

const first = 408;
const last = 802;

function getPokemon(id) {
  Pokedex.getPokemonByName(id)
    .then((result) => {
      console.log(result.name);
      pokemons.push(result);
      if (id < last) {
        setTimeout(() => {
          getPokemon(id + 1);
        }, 5000);
      } else {
        fs.writeFile('pokemons.json', JSON.stringify(pokemons, null, 2), (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
        });
      }
    })
    .catch((error) => {
      fs.writeFile(`pokemonsTemp${Date.now()}.json`, JSON.stringify(pokemons, null, 2), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });

      console.log(error);
      throw error;
    });
}

getPokemon(first);
