// DOM Selectors
const pokemonSectionEl = document.getElementById("pokemon-section");



// Render Pokémon data on the website
export default function renderPokemon(json){
    
    // Pokemon Data Container
    let pokemonDataContainer = document.createElement("section");
    pokemonDataContainer.classList.add("pokemon-data-container");
    pokemonSectionEl.appendChild(pokemonDataContainer);

    // Pokemon Sprite
    let pokemonSprite = document.createElement("img");
    pokemonSprite.classList.add("pokemon-sprite");

    // Check if the Pokemon data is added(API) or loaded(LocalStorage)
    if(Array.isArray(json)){
        pokemonSprite.src = json[0][0].Sprite;
    }
    else {
        pokemonSprite.src = json.sprites.front_default;
    }
    pokemonSprite.alt = "It's the Pokémon of your choice!";
    if(Array.isArray(json) && json[0][0].isShiny === true){
        pokemonSprite.style.display = "none";
    }
    else{
        pokemonSprite.style.display = "block";
    }
    pokemonDataContainer.appendChild(pokemonSprite);

    // Pokemon Shiny Sprite
    let pokemonShinySprite = document.createElement("img");
    pokemonShinySprite.classList.add("pokemon-shiny-sprite");

    // Check if the Pokemon data is added(API) or loaded(LocalStorage)
    if(Array.isArray(json)){
        pokemonShinySprite.src = json[0][0].ShinySprite;
    }
    else{
        pokemonShinySprite.src = json.sprites.front_shiny;
    }
    pokemonShinySprite.alt = "It's the shiny version of the Pokémon of your choice!"
    if(Array.isArray(json) && json[0][0].isShiny === true){
        pokemonShinySprite.style.display = "block";
    }
    else{
        pokemonShinySprite.style.display = "none";
    }
    pokemonDataContainer.appendChild(pokemonShinySprite);

    // Pokemon Name and Type Section
    let pokemonNameSection = document.createElement("section");
    pokemonNameSection.classList.add("pokemon-data-name-section");

    // Pokemon Name
    let pokemonName = document.createElement("p");
    pokemonName.classList.add("pokemon-data-name");

    // Check if the Pokemon data is added(API) or loaded(LocalStorage)
    if(Array.isArray(json)){
        pokemonName.innerHTML = json[0][0].Name;
    }
    else{
        pokemonName.innerHTML = json.name.toUpperCase();
    }
    pokemonNameSection.appendChild(pokemonName);

    // Pokemon Type Array
    let pokemonTypesArray = json.types;

    // Pokemon Types
    let pokemonType = document.createElement("p");
    pokemonType.classList.add("pokemon-data-type");

    // Some Pokémon have 1 type or 2 types but no more than 2, checking if the targeted Pokémon has one or two types then render data
    if(Array.isArray(json)){
        pokemonType.innerHTML = json[0][0].Types;
    }
    else{
        for(let i = 0; i < pokemonTypesArray.length; i++){
            if(pokemonTypesArray[1] === undefined){
                pokemonType.innerHTML = `Type: ${pokemonTypesArray[i].type.name.toUpperCase()}`;
            }
            else {
                pokemonType.innerHTML = `Type: ${pokemonTypesArray[0].type.name.toUpperCase()} / ${pokemonTypesArray[1].type.name.toUpperCase()}`;
            }
        }
    }

    pokemonNameSection.appendChild(pokemonType);
    pokemonDataContainer.appendChild(pokemonNameSection);

    // Pokemon Moves

    // Pokemon Moves Array
    let pokemonMovesArray = json.moves;

    // Check if the Pokemon data is added(API) or loaded(LocalStorage)
    if(Array.isArray(json)){
        pokemonMovesArray = json[0][0].Move1;
    }

    // Store all moves in this form
    let pokemonMovesForm = document.createElement("form");
    pokemonMovesForm.classList.add("pokemon-moves-form");
    pokemonMovesForm.id = `${pokemonName.innerHTML}-move-overlay-form`;

    // Create pop up Modal to read description of moves
    let pokemonMoveOverlay = document.createElement("section");
    pokemonMoveOverlay.classList.add("pokemon-move-overlay");
    pokemonMoveOverlay.id = "overlay";
    pokemonMovesForm.appendChild(pokemonMoveOverlay);

    let pokemonMovePopUpContent = document.createElement("article");
    pokemonMovePopUpContent.classList.add("pokemon-move-overlay-content");
    pokemonMoveOverlay.appendChild(pokemonMovePopUpContent);

    let pokemonMovePopUpHeading = document.createElement("h2");
    pokemonMovePopUpHeading.classList.add("pokemon-move-overlay-heading");
    pokemonMovePopUpContent.appendChild(pokemonMovePopUpHeading);

    let pokemonMovePopUpClose = document.createElement("a");
    pokemonMovePopUpClose.classList.add("pokemon-move-overlay-close");
    pokemonMovePopUpClose.href = "#";
    pokemonMovePopUpClose.innerHTML = "&times;";
    pokemonMovePopUpContent.appendChild(pokemonMovePopUpClose);

    let pokemonMovePopUpType = document.createElement("p");
    pokemonMovePopUpType.classList.add("pokemon-move-overlay-type");
    pokemonMovePopUpContent.appendChild(pokemonMovePopUpType);

    let pokemonMovePopUpPower = document.createElement("p");
    pokemonMovePopUpPower.classList.add("pokemon-move-overlay-power");
    pokemonMovePopUpContent.appendChild(pokemonMovePopUpPower);

    let pokemonMovePopUpPP = document.createElement("p");
    pokemonMovePopUpPP.classList.add("pokemon-move-overlay-pp");
    pokemonMovePopUpContent.appendChild(pokemonMovePopUpPP);

    let pokemonMovePopUpAcc = document.createElement("p");
    pokemonMovePopUpAcc.classList.add("pokemon-move-overlay-acc");
    pokemonMovePopUpContent.appendChild(pokemonMovePopUpAcc);

    let pokemonMovePopUpDesc = document.createElement("p");
    pokemonMovePopUpDesc.classList.add("pokemon-move-overlay-desc");
    pokemonMovePopUpContent.appendChild(pokemonMovePopUpDesc);

    // Pokemon Move Text
    let pokemonMoveText = document.createElement("p");
    pokemonMoveText.classList.add("pokemon-move-text");
    pokemonMoveText.innerHTML = "Moves";
    pokemonMovesForm.appendChild(pokemonMoveText);

    // Move Selection 1
    let pokemonMove1 = document.createElement("select");
    pokemonMove1.classList.add("move-select-1");
    let pokemonMove1Desc = document.createElement("a");
    pokemonMove1Desc.classList.add("move-1-desc");
    pokemonMove1Desc.href = "#overlay";
    pokemonMove1Desc.innerHTML = "Desc.";
    pokemonMovesForm.appendChild(pokemonMove1Desc);

    // Move Selection 2
    let pokemonMove2 = document.createElement("select");
    pokemonMove2.classList.add("move-select-2");
    let pokemonMove2Desc = document.createElement("a");
    pokemonMove2Desc.classList.add("move-2-desc");
    pokemonMove2Desc.href = "#overlay";
    pokemonMove2Desc.innerHTML = "Desc.";
    pokemonMovesForm.appendChild(pokemonMove2Desc);

    // Move Selection 3
    let pokemonMove3 = document.createElement("select");
    pokemonMove3.classList.add("move-select-3");
    let pokemonMove3Desc = document.createElement("a");
    pokemonMove3Desc.classList.add("move-3-desc");
    pokemonMove3Desc.href = "#overlay";
    pokemonMove3Desc.innerHTML = "Desc.";
    pokemonMovesForm.appendChild(pokemonMove3Desc);

    // Move Selection 4
    let pokemonMove4 = document.createElement("select");
    pokemonMove4.classList.add("move-select-4");
    let pokemonMove4Desc = document.createElement("a");
    pokemonMove4Desc.classList.add("move-4-desc");
    pokemonMove4Desc.href = "#overlay";
    pokemonMove4Desc.innerHTML = "Desc.";
    pokemonMovesForm.appendChild(pokemonMove4Desc);

    // Store all moves learned by this Pokemon in each select to be able to change your selected moves.
    // Uses a variable to pick the last selected element value when saved to show the value as selected.
    if(Array.isArray(json)){
        
        for(let i = 0; i < json[0][0].Move1.length; i++){

            let pokemonMove1Option = document.createElement("option");
            pokemonMove1Option.value = json[0][0].Move1[i];
            pokemonMove1Option.innerHTML = json[0][0].Move1[i];
            pokemonMove1.appendChild(pokemonMove1Option);
            if(json[0][0].Move1[i] === json[0][0].Move1Selected){
                pokemonMove1Option.selected = true;
            }
        }
        for(let i = 0; i < json[0][0].Move2.length; i++){

            let pokemonMove2Option = document.createElement("option");
            pokemonMove2Option.value = json[0][0].Move2[i];
            pokemonMove2Option.innerHTML = json[0][0].Move2[i];
            pokemonMove2.appendChild(pokemonMove2Option);
            if(json[0][0].Move2[i] === json[0][0].Move2Selected){
                pokemonMove2Option.selected = true;
            }
        }
        for(let i = 0; i < json[0][0].Move3.length; i++){

            let pokemonMove3Option = document.createElement("option");
            pokemonMove3Option.value = json[0][0].Move3[i];
            pokemonMove3Option.innerHTML = json[0][0].Move3[i];
            pokemonMove3.appendChild(pokemonMove3Option);
            if(json[0][0].Move3[i] === json[0][0].Move3Selected){
                pokemonMove3Option.selected = true;
            }
        }
        for(let i = 0; i < json[0][0].Move4.length; i++){

            let pokemonMove4Option = document.createElement("option");
            pokemonMove4Option.value = json[0][0].Move4[i];
            pokemonMove4Option.innerHTML = json[0][0].Move4[i];
            pokemonMove4.appendChild(pokemonMove4Option);
            if(json[0][0].Move4[i] === json[0][0].Move4Selected){
                pokemonMove4Option.selected = true;
            }
        }
    }
    else{
        pokemonMovesArray.forEach(move => {
            // List for first Move Option
            let pokemonMove1Option = document.createElement("option");
            pokemonMove1Option.value = move.move.name;
            pokemonMove1Option.innerHTML = move.move.name;
            pokemonMove1.appendChild(pokemonMove1Option);
        
            // List for second Move Option
            let pokemonMove2Option = document.createElement("option");
            pokemonMove2Option.value = move.move.name;
            pokemonMove2Option.innerHTML = move.move.name;
            pokemonMove2.appendChild(pokemonMove2Option);
        
            // List for third Move Option
            let pokemonMove3Option = document.createElement("option");
            pokemonMove3Option.value = move.move.name;
            pokemonMove3Option.innerHTML = move.move.name;
            pokemonMove3.appendChild(pokemonMove3Option);
        
            // List for fourth Move Option
            let pokemonMove4Option = document.createElement("option");
            pokemonMove4Option.value = move.move.name;
            pokemonMove4Option.innerHTML = move.move.name;
            pokemonMove4.appendChild(pokemonMove4Option);
        
        });
    }

    pokemonMovesForm.appendChild(pokemonMove1);
    pokemonMovesForm.appendChild(pokemonMove2);
    pokemonMovesForm.appendChild(pokemonMove3);
    pokemonMovesForm.appendChild(pokemonMove4);
    pokemonDataContainer.appendChild(pokemonMovesForm);

    // Pokemon Shint Container for Text and Checkbox
    let pokemonShinyContainer = document.createElement("section");
    pokemonShinyContainer.classList.add("pokemon-shiny-container");

    // Pokemon Shiny Text
    let pokemonShinyText = document.createElement("p");
    pokemonShinyText.classList.add("pokemon-shiny-text");
    pokemonShinyText.innerHTML = "Shiny";
    pokemonShinyContainer.appendChild(pokemonShinyText);

    // Pokemon Shiny Checkbox
    let pokemonShinyCheckbox = document.createElement("input");
    pokemonShinyCheckbox.classList.add("pokemon-shiny-checkbox");
    pokemonShinyCheckbox.setAttribute("type", "checkbox");
    if(Array.isArray(json)){
        if(json[0][0].isShiny === true){
            pokemonShinyCheckbox.checked = true;
        }
    }
    pokemonShinyContainer.appendChild(pokemonShinyCheckbox);
    pokemonDataContainer.appendChild(pokemonShinyContainer);

    // Pokemon Abilities

    let pokemonAbilitiesArray = json.abilities;

    // Check if the Pokemon data is added(API) or loaded(LocalStorage)
    if(Array.isArray(json)){
        pokemonAbilitiesArray = json[0][0].Abilities;
    }

    // Store abilities in this form
    let pokemonAbilityForm = document.createElement("form");
    pokemonAbilityForm.classList.add("pokemon-ability-form");
    pokemonAbilityForm.id = `${pokemonName.innerHTML}-ability-overlay-form`;
    pokemonAbilityForm.innerHTML = "Ability";

    // Pokemon Ability Selection
    let pokemonAbilities = document.createElement("select");
    pokemonAbilities.classList.add("pokemon-ability-select");

    let pokemonAbilityDesc = document.createElement("a");
    pokemonAbilityDesc.classList.add("pokemon-ability-desc");
    pokemonAbilityDesc.href = "#ability-overlay";
    pokemonAbilityDesc.innerHTML = "Desc."
    pokemonAbilityForm.appendChild(pokemonAbilityDesc);

    // Create pop up Modal to read description of moves
    let pokemonAbilityOverlay = document.createElement("section");
    pokemonAbilityOverlay.classList.add("pokemon-ability-overlay");
    pokemonAbilityOverlay.id = "ability-overlay";
    pokemonAbilityForm.appendChild(pokemonAbilityOverlay);

    let pokemonAbilityPopUpContent = document.createElement("article");
    pokemonAbilityPopUpContent.classList.add("pokemon-ability-overlay-content");
    pokemonAbilityOverlay.appendChild(pokemonAbilityPopUpContent);

    let pokemonAbilityPopUpHeading = document.createElement("h2");
    pokemonAbilityPopUpHeading.classList.add("pokemon-ability-overlay-heading");
    pokemonAbilityPopUpContent.appendChild(pokemonAbilityPopUpHeading);

    let pokemonAbilityPopUpClose = document.createElement("a");
    pokemonAbilityPopUpClose.classList.add("pokemon-ability-overlay-close");
    pokemonAbilityPopUpClose.href = "#";
    pokemonAbilityPopUpClose.innerHTML = "&times;";
    pokemonAbilityPopUpContent.appendChild(pokemonAbilityPopUpClose);

    let pokemonAbilityPopUpDesc = document.createElement("p");
    pokemonAbilityPopUpDesc.classList.add("pokemon-ability-overlay-desc");
    pokemonAbilityPopUpContent.appendChild(pokemonAbilityPopUpDesc);

    // Store all abilities for this Pokemon

    // Check if the Pokemon data is added(API) or loaded(LocalStorage)
    if(Array.isArray(json)){
        for(let i = 0; i < json[0][0].Abilities.length; i++){
            let pokemonAbility = document.createElement("option");
            pokemonAbility.value = json[0][0].Abilities[i];
            pokemonAbility.innerHTML = json[0][0].Abilities[i];
            pokemonAbilities.appendChild(pokemonAbility);
            if(json[0][0].Abilities[i] === json[0][0].AbilitySelected){
                pokemonAbility.selected = true;
            }
        }
    }
    else{
        pokemonAbilitiesArray.forEach(ability => {
            let pokemonAbility = document.createElement("option");
            pokemonAbility.value = ability.ability.name;
            pokemonAbility.innerHTML = ability.ability.name;
            pokemonAbilities.appendChild(pokemonAbility);
        });
    }

    pokemonAbilityForm.appendChild(pokemonAbilities);
    pokemonDataContainer.appendChild(pokemonAbilityForm);

    // Save Button
    let saveButton = document.createElement("button");
    saveButton.classList.add("save-button");
    saveButton.innerHTML = "Save";
    pokemonDataContainer.appendChild(saveButton);

    // Delete Button
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerHTML = "Delete";
    pokemonDataContainer.appendChild(deleteButton);
}