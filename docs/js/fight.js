let idAttacker = 1;
let idDefenser = 1;

let attacker;
let defenser;

//Optention des stats des 2 Pokémons

d3.csv('./csv/pokemon_complete.csv', (d, j, columns) => {
    return {
        id: d.id,
        hp: d.hp,
        attack: d.attack,
        defense: d.defense,
        attackSpe: d.special-attack,
        defenseSpe: d.special-defense,
        speed: d.speed,
        type1: d.type1,
        type2: d.type2,
        moves: [],
    };
  }, (error, data) => {
    data.forEach((pokemon) => {
        if (pokemon.id === idAttacker) {
            attacker = pokemon;
        }

        if (pokemon.id === idDefenser) {
            defenser = pokemon;
        }
    });
});

//Remplissage de la barre de vie des Pokémons
$('#healthAttacker').max = attacker.hp;
$('#healthAttacker').value = attacker.hp;

$('#healthDefenser').max = defenser.hp;
$('#healthDefenser').value = defenser.hp / 2; //pour le test

//Génération des attaques disponibles pour l'attaquand
d3.csv('./csv/moves.csv', (d, j, columns) => {
    return {
        pokemonID: d.pokemon_id,
        identifier: d.identifier,
        typeID: d.type_id,
        typeName: d.type_name,
        power: d.power,
        damageClassName: damage_class_text,
    };
  }, (error, data) => {
    data.forEach((move) => {
        if (move.pokemonID === attacker.id) {
            attacker.moves.push(move);

            //création de l'option de selection d'attaque associée
            let option = document.createElement('option');
            option.text = move.identifier + "(type: " +
                move.typeName + ", power: " + move.power + ")";
            $('#attackSelector').add(option);
        }
    });
});

//Déroulement du combat
function attack(attacker, defenser, chosenAttack) {
    //résumé des choix de l'utilisateur
    let summary = attacker.identifier + " chose " + chosenAttack +
        " of " + chosenAttack.typeName + " type and a power of" + chosenAttack.power +
        " against " + defenser.identifier + ".";
    $('#choicesSummary').value = summary;

    //détermination de l'efficacité de l'attaque choisie
    let damageFactor;
    d3.csv('../csv/type_efficacy.csv', (d, j, columns) => {
        return {
            damageTypeID: d.damage_type_id,
            defenserTypeID: d.target_type_id,
            damageFactor: d.damage_factor,
        };
      }, (error, data) => {
        let damageFactorType1;
        let damageFactorType2;
        data.forEach((move) => {
            if (chosenAttack.typeID === move.damageTypeID &&
                defenser.type1 === move.defenserTypeID) {
                    damageFactorType1 = move.damageFactor;
            }

            if (chosenAttack.typeID === move.damageTypeID &&
                defenser.type2 === move.defenserTypeID) {
                    damageFactorType2 = move.damageFactor;
                }
        });

        damageFactor = damageFactorType1 * (damageFactorType2/100);

        switch(damageFactor) {
            case 0:
            case 25:
            case 50:
                $('#fightEfficiency').value = "It's not very effective !"
                break;
            case 100:
                //nothing to show
                break;
            case 200:
            case 400:
                $('#fightEfficiency').value = "It's super effective !"
                break;
        }
    });

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
    let damageCaused = ((42 * chosenAttack.power * (attackStat/defense)) / 50) + 2;
    
    $('#attackerAttackStat').value = attacker.identifier + 
        " has " + attackText + " of " + attackStat;

    $('#defenserDefenseStat').value = defenser.identifier + 
        " has " + defenseText + " of " + defenseStat;

    $('damageDetail') = attacker.identifier + " has caused " + damageCaused +
    " damages to " + defenser.identifier;

}
