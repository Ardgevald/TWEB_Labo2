// let csv is the CSV file with headers
function csvJSON(csv) {
  const lines = csv.split('\n');
  const result = [];

  const headers = lines[0].split(';');

  for (let i = 1; i < lines.length; i += 1) {
    const obj = {};
    const currentline = lines[i].split(';');

    for (let j = 0; j < headers.length; j += 1) {
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);
  }

  return result;
}

let pokedex;

$.get('./csv/pokemonType.csv', (data) => {
  pokedex = csvJSON(data);

  const attackerImg = document.getElementById('attackerImg');
  const defenserImg = document.getElementById('defenserImg');
  const attackerId = document.getElementById('attackerId');
  const defenserId = document.getElementById('defenserId');

  pokedex.forEach((pokemon) => {
    if (pokemon.id && pokemon.id <= 802) {
      // Affichage du tableau des users de la region
      const tableBody = document.getElementById('pokedexData');

      const line = document.createElement('tr');

      const colUpdate = document.createElement('td');
      const nodeUpdate = document.createTextNode(pokemon.id);
      colUpdate.appendChild(nodeUpdate);
      line.appendChild(colUpdate);

      const colRepos = document.createElement('td');
      const nodeRepos = document.createTextNode(pokemon.identifier);
      colRepos.appendChild(nodeRepos);
      line.appendChild(colRepos);

      const colImg = document.createElement('td');
      const img = document.createElement('img');
      img.src = `./res/${pokemon.id}.png`;
      img.onerror = () => {
        this.src = `https://pokeapi.co/media/sprites/pokemon/${pokemon.id}.png`;
      };
      img.height = 75;
      img.width = 75;
      colImg.appendChild(img);
      line.appendChild(colImg);

      const colType1 = document.createElement('td');
      const nodeType1 = document.createTextNode(pokemon.type1);
      colType1.appendChild(nodeType1);
      line.appendChild(colType1);

      const colType2 = document.createElement('td');
      const nodeType2 = document.createTextNode(pokemon.type2);
      colType2.appendChild(nodeType2);
      line.appendChild(colType2);

      const colAttack = document.createElement('td');
      const pokemonSelect = document.createElement('button');
      pokemonSelect.class = 'btn btn-default';
      pokemonSelect.type = 'button';
      pokemonSelect.textContent = 'As attacker';
      pokemonSelect.onclick = () => {
        attackerId.value = pokemon.id;
        attackerImg.src = `./res/${pokemon.id}.png`;
        attackerImg.onerror = () => {
          this.src = `https://pokeapi.co/media/sprites/pokemon/${pokemon.id}.png`;
        };
      };
      colAttack.appendChild(pokemonSelect);
      line.appendChild(colAttack);

      const colDefense = document.createElement('td');
      const pokemonSelect2 = document.createElement('button');
      pokemonSelect2.class = 'btn btn-default';
      pokemonSelect2.type = 'button';
      pokemonSelect2.textContent = 'As Defenser';
      pokemonSelect2.onclick = () => {
        defenserId.value = pokemon.id;
        defenserImg.src = `./res/${pokemon.id}.png`;
        defenserImg.onerror = () => {
          this.src = `https://pokeapi.co/media/sprites/pokemon/${pokemon.id}.png`;
        };
      };
      colDefense.appendChild(pokemonSelect2);
      line.appendChild(colDefense);

      tableBody.appendChild(line);
    }
  }, this);
});
