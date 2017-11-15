// let csv is the CSV file with headers
function csvJSON(csv) {
  const lines = csv.split('\n');
  const result = [];

  const headers = lines[0].split(',');

  for (let i = 1; i < lines.length; i += 1) {
    const obj = {};
    const currentline = lines[i].split(',');

    for (let j = 0; j < headers.length; j += 1) {
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);
  }

  return result;
}

let pokedex;

$.get('./csv/pokemon.csv', (data) => {
  pokedex = csvJSON(data);

  pokedex.forEach((pokemon) => {
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

    tableBody.appendChild(line);
  }, this);
});
