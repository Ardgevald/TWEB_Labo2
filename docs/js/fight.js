let idAttacker = 1;
let idDefenser = 1;

$('#fighterAttack').attr('src', `./res/${idAttacker}.png`);
$('#fighterDefense').attr('src', `./res/${idDefenser}.png`);

let attacker;
let defenser;

let pokedex;
let moves;

function changeAttacker(id) {
    pokedex.forEach((pokemon) => {
        if (pokemon.id == id) {
            attacker = pokemon;
        }
    });

    $('#fighterAttack').attr('src', `./res/${id}.png`);

    $('#attackSelector').html('');

    moves.forEach((move) => {
        if (move.pokemonID == id) {
            // creation of the options for the move selector
            let optionText = move.identifier + " (type: " +
                move.typeName + ", power: " + move.power + ")";
            $('#attackSelector').append(`<option value="${move.id}">${optionText}</option>`);

        }
    });
}

function changeDefenser(id) {
    pokedex.forEach((pokemon) => {
        if (pokemon.id == id) {
            defenser = pokemon;
        }
    });

    $('#fighterDefense').attr('src', `./res/${id}.png`);
    $('#healthDefenser').html(defenser.hp);
}

// Getting the stats of both pokemon (we load all the pokemons in a variable)
d3.csv('./csv/pokemon_complete.csv', (d, j, columns) => {
    return {
        id: +d.id,
        identifier: d.identifier,
        hp: (d.id !== "292" ? +d.hp * 2 + 110 : 1),
        attack: +d.attack * 2 + 5,  // effective stats
        defense: +d.defense * 2 + 5,
        attackSpe: +d.special_attack * 2 + 5,
        defenseSpe: +d.special_defense * 2 + 5,
        speed: +d.speed * 2 + 5,
        type1: d.type1,
        type1ID: +d.type1ID,
        type2: d.type2,
        type2ID: +d.type2ID,
        moves: [],
    };
}, (error, data) => {
    pokedex = data;
    data.forEach((pokemon) => {
        if (pokemon.id === idAttacker) {
            attacker = pokemon;
        }

        if (pokemon.id === idDefenser) {
            defenser = pokemon;
            $('#healthDefenser').html(defenser.hp);
        }
    });

    // Generating the chosable moves of the pokemon (all are loaded)
    d3.csv('./csv/moves.csv', (d, j, columns) => {
        return {
            id: +d.move_id,
            pokemonID: +d.pokemon_id,
            identifier: d.identifier,
            typeID: +d.type_id,
            typeName: d.type_name,
            power: +d.power,
            damageClassName: d.damage_class_text,
        };
    }, (error, data) => {
        moves = data;
        data.forEach((move) => {
            if (move.pokemonID === attacker.id) {
                attacker.moves.push(move);

                // creation of the options for the move selector
                let optionText = move.identifier + " (type: " +
                    move.typeName + ", power: " + move.power + ")";
                $('#attackSelector').append(`<option value="${move.id}">${optionText}</option>`);

            }
        });
    });
});

// Fight flow
function attack() {
    // We get the chosen attack
    let chosenAttackID = +$('#attackSelector :selected').val();
    let chosenAttack = moves.find(m => m.id === chosenAttackID);

    // summary of the user's choices
    let summary = attacker.identifier + " chose " + chosenAttack.identifier +
        " of " + chosenAttack.typeName + " type and a power of " + chosenAttack.power +
        " against " + defenser.identifier + ".";
    $('#choicesSummary').html(summary);

    // calculating the efficiency of the chosen move
    let damageFactor;
    d3.csv('./csv/type_efficacy.csv', (d, j, columns) => {
        return {
            damageTypeID: +d.damage_type_id,
            defenserTypeID: +d.target_type_id,
            damageFactor: +d.damage_factor,
        };
    }, (error, data) => {
        let damageFactorType1 = 100;
        let damageFactorType2 = 100;
        data.forEach((move) => {
            if (chosenAttack.typeID === move.damageTypeID &&
                defenser.type1ID === move.defenserTypeID) {
                damageFactorType1 = move.damageFactor;
            }

            if (chosenAttack.typeID === move.damageTypeID &&
                defenser.type2ID === move.defenserTypeID) {
                damageFactorType2 = move.damageFactor;
            }
        });

        damageFactor = damageFactorType1 * (damageFactorType2 / 100);

        switch (damageFactor) {
            case 0:
                $('#fightEfficiency').html("It has no effect!");
                break;
            case 25:
            case 50:
                $('#fightEfficiency').html("It's not very effective!");
                break;
            case 100:
                // nothing to show
                $('#fightEfficiency').html("");
                break;
            case 200:
            case 400:
                $('#fightEfficiency').html("It's super effective!");
                break;
        }

        // details of the damages
        let attackStat;
        let defenseStat;

        let attackText;
        let defenseText;

        if (chosenAttack.damageClassName === 'special') {
            attackStat = attacker.attackSpe;
            defenseStat = defenser.defenseSpe;
            attackText = "a special attack";
            defenseText = "a special defense";
        } else {
            attackStat = attacker.attack;
            defenseStat = defenser.defense;
            attackText = "an attack";
            defenseText = "a defense";
        }

        // this calculation is for a level 100 pokémon without stab
        let damageCaused = Math.ceil(chosenAttack.power === 0 ? 0 : damageFactor / 100 * (((42 * chosenAttack.power * (attackStat / defenseStat)) / 50) + 2));

        $('#attackerAttackStat').html(attacker.identifier +
            " has " + attackText + " of " + attackStat);

        $('#defenserDefenseStat').html(defenser.identifier +
            " has " + defenseText + " of " + defenseStat);

        $('#damageDetail').html(attacker.identifier + " has caused " + damageCaused +
            " damages to " + defenser.identifier);

        let hpAfterAttack = Math.max(defenser.hp - damageCaused, 0);
        $('#healthDefenser').attr('style', `width:${hpAfterAttack / defenser.hp * 100}%;`).html(hpAfterAttack);

        if (hpAfterAttack < (defenser.hp * 0.33)) {
            $('#healthDefenser').attr('class', 'progress-bar progress-bar-danger');
        } else if (hpAfterAttack < (defenser.hp * 0.5)) {
            $('#healthDefenser').attr('class', 'progress-bar progress-bar-warning');
        } else {
            $('#healthDefenser').attr('class', 'progress-bar progress-bar-success');
        }
    });
}
