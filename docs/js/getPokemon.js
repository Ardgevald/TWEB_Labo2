const reader = new XMLHttpRequest();

// let csv is the CSV file with headers
function loadCSVToJson(url, done) {
  reader.open('get', url, true);
  reader.onload = () => {
    done(null, $.csv.toObjects(reader.response));
  };
  reader.onerror = () => {
    if (reader.readyState === 4) {
      done(reader.response);
    }
  };
  reader.send(null);
}

let typeEfficiency;

/* exported getEfficiency */
function getEfficiency(offenserType, defenderType1, defenderType2, callback) {
  if (!typeEfficiency) {
    loadCSVToJson('./csv/type_efficacy.csv', (err, response) => {
      if (err) {
        throw err;
      }

      typeEfficiency = response;
      getEfficiency(offenserType, defenderType1, defenderType2, callback);
    });
  } else {
    let modifier = 1;

    typeEfficiency.forEach((efficiency) => {
      if (parseInt(efficiency.damage_type_id, 10) === offenserType && (
        parseInt(efficiency.target_type_id, 10) === defenderType1 ||
        parseInt(efficiency.target_type_id, 10) === defenderType2
      )) {
        modifier *= efficiency.damage_factor / 100;
      }
    });

    callback(modifier);
  }
}

loadCSVToJson('./csv/pokemonType.csv', (err, pokedex) => {
  if (err) {
    throw err;
  }

  const attackerImg = document.getElementById('attackerImg');
  const defenserImg = document.getElementById('defenserImg');
  const attackerId = document.getElementById('attackerId');
  const defenserId = document.getElementById('defenserId');
  const attackerCaption = document.getElementById('attackerCaption');
  const defenserCaption = document.getElementById('defenserCaption');

  pokedex.forEach((pokemon) => {
    if (pokemon.id && pokemon.id <= 802) {
      // Affichage du tableau des users de la region
      const tableBody = document.getElementById('pokedexData');

      const line = document.createElement('tr');

      const colUpdate = document.createElement('td');
      colUpdate.classList.add('id');
      const nodeUpdate = document.createTextNode(pokemon.id);
      colUpdate.appendChild(nodeUpdate);
      line.appendChild(colUpdate);

      const colRepos = document.createElement('td');
      colRepos.classList.add('name');
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
      pokemonSelect.classList.add('btn');
      pokemonSelect.classList.add('btn-default');
      pokemonSelect.type = 'button';
      pokemonSelect.textContent = 'As attacker';
      pokemonSelect.onclick = () => {
        attackerId.value = pokemon.id;
        attackerImg.src = `./res/${pokemon.id}.png`;
        attackerImg.alt = pokemon.identifier;
        attackerCaption.textContent = pokemon.identifier;
        attackerImg.onerror = () => {
          this.src = `https://pokeapi.co/media/sprites/pokemon/${pokemon.id}.png`;
        };
      };
      colAttack.appendChild(pokemonSelect);
      line.appendChild(colAttack);

      const colDefense = document.createElement('td');
      const pokemonSelect2 = document.createElement('button');
      pokemonSelect2.classList.add('btn');
      pokemonSelect2.classList.add('btn-default');
      pokemonSelect2.type = 'button';
      pokemonSelect2.textContent = 'As Defenser';
      pokemonSelect2.onclick = () => {
        defenserId.value = pokemon.id;
        defenserImg.src = `./res/${pokemon.id}.png`;
        defenserImg.alt = pokemon.identifier;
        defenserCaption.textContent = pokemon.identifier;
        defenserImg.onerror = () => {
          this.src = `https://pokeapi.co/media/sprites/pokemon/${pokemon.id}.png`;
        };
      };
      colDefense.appendChild(pokemonSelect2);
      line.appendChild(colDefense);

      tableBody.appendChild(line);
    }
  }, this);

  $(document).ready(() => {
    $('#pokedexTable').dataTable();
    getEfficiency(3, 4, 2, (modifier) => {
      console.log(modifier);
    });
  });
});
