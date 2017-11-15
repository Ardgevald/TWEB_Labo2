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
      img.src = `https://pokeapi.co/media/sprites/pokemon/${pokemon.id}.png`;
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
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'radioAttack';
      radio.value = pokemon.id;
      colAttack.appendChild(radio);
      line.appendChild(colAttack);

      const colDefense = document.createElement('td');
      const radio2 = document.createElement('input');
      radio2.type = 'radio';
      radio2.name = 'radioDefense';
      radio2.value = pokemon.id;
      colDefense.appendChild(radio2);
      line.appendChild(colDefense);

      tableBody.appendChild(line);
    }
  }, this);
});
