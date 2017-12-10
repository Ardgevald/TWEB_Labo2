let idAttacker = 1;
let idDefenser = 1;

let attacker;
let defenser;

let pokedex;
let moves;

//Optention des stats des 2 Pokémons

d3.csv('./csv/pokemon_complete.csv', (d, j, columns) => {
    return {
        id: +d.id,
        identifier: d.identifier,
        hp: (d.id !== "292" ? +d.hp * 2 + 110 : 1),
        attack: +d.attack * 2 + 5,  //effective stats
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
        }
    });

    //Remplissage de la barre de vie des Pokémons
    $('#healthAttacker').attr('max', attacker.hp);
    $('#healthAttacker').attr('value', attacker.hp);

    $('#healthDefenser').attr('max', defenser.hp);
    $('#healthDefenser').attr('value', defenser.hp);

    //Génération des attaques disponibles pour l'attaquand
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

                //création de l'option de selection d'attaque associée
                let optionText = move.identifier + " (type: " +
                    move.typeName + ", power: " + move.power + ")";
                $('#attackSelector').append(`<option value="${move.id}">${optionText}</option>`);

            }
        });
    });
});

//Déroulement du combat
function attack() {
    //récupération de l'attaque sélectionnée
    let chosenAttackID = +$('#attackSelector :selected').val();
    let chosenAttack = moves.find(m => m.id === chosenAttackID);

    //résumé des choix de l'utilisateur
    let summary = attacker.identifier + " chose " + chosenAttack.identifier +
        " of " + chosenAttack.typeName + " type and a power of " + chosenAttack.power +
        " against " + defenser.identifier + ".";
    $('#choicesSummary').html(summary);

    //détermination de l'efficacité de l'attaque choisie
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
                //nothing to show
                break;
            case 200:
            case 400:
                $('#fightEfficiency').html("It's super effective!")
                break;
        }

        //détails des dégats causés
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

        //this calculation is for a level 100 pokémon
        let damageCaused = ((42 * chosenAttack.power * (attackStat / defenseStat)) / 50) + 2;

        $('#attackerAttackStat').html(attacker.identifier +
            " has " + attackText + " of " + attackStat);

        $('#defenserDefenseStat').html(defenser.identifier +
            " has " + defenseText + " of " + defenseStat);

        $('#damageDetail').html(attacker.identifier + " has caused " + damageCaused +
            " damages to " + defenser.identifier);
        
        let hpAfterAttack = Math.max(defenser.hp - damageCaused, 0);
        $('#healthDefenser').attr('value', hpAfterAttack);

        if (hpAfterAttack < (defenser.hp * 0.33)) {
            $('#healthDefenser').css("background-color", "red");
        } else if (hpAfterAttack < (defenser.hp * 0.5)) {
            $('#healthDefenser').css("background-color", "yellow");            
        }
    });
}

