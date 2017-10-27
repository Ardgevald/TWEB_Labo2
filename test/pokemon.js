const should = require('chai').should();
const request = require('request-promise');

const languageFR = {
  uri: 'http://pokeapi.co/api/v2/language/fr',
  headers: {
    'User-Agent': 'Request-Promise',
  },
  json: true, // Automatically parses the JSON string in the response
};

const pokemonBulbazaur = {
  uri: 'http://pokeapi.co/api/v2/pokemon-species/1',
  headers: {
    'User-Agent': 'Request-Promise',
  },
  json: true, // Automatically parses the JSON string in the response
};

describe('the pokemon api', () => {
  it('should allow me to get the french language', (done) => {
    request(languageFR)
      .then((language) => {
        done();
      })
      .catch((err) => {
        should.not.exist(err);
      });
  });

  it('should allow me to get infos on bulbazaur in french', (done) => {
    request(pokemonBulbazaur)
      .then((pokemon) => {
        should.exist(pokemon);
        done();
      })
      .catch((err) => {
        should.not.exist(err);
      });
  });
});
