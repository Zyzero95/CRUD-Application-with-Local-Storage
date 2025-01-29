// API Url for PokéApi, a free open source REST API
const API_URL = "https://pokeapi.co/api/v2/";

// Theme - A Pokémon Teambuilder. (Choose Pokémon, Moveset, Regular/Shiny, Ability) Up to 6 Pokémon in a team.

//TODO: bättre design/ Ordna felhantering så felet syns på UI/ städa och reformera kod.
// EV: Göra så delete button bara tar bort elementen men inte ifrån LocalStorage, möjligtvis en till knapp som tar bort från LocalStorage.

// Empty object used for updating Local Storage
let localStorageList = [];

let localStorageObject = {
    Sprite: "",
    ShinySprite: "",
    isShiny: false,
    Name: "",
    Types: [],
    Move1: [],
    Move2: [],
    Move3: [],
    Move4: [],
    Move1Selected: "",
    Move2Selected: "",
    Move3Selected: "",
    Move4Selected: "",
    AbilitySelected: "",
    Abilities: []
};

// DOM Selectors
const pokemonSectionEl = document.getElementById("pokemon-section");
const pokemonNewDataFormEl = document.getElementById("pokemon-new-data-form");
const pokemonLoadDataFormEl = document.getElementById("pokemon-load-data-form");
const clearSavedDataEl = document.getElementById("clear-save-data-form");

// When submit is clicked get value from input and then fetch API.
pokemonNewDataFormEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const pokemonName = document.getElementById("pokemon-name").value.trim().toLowerCase();
    fetchPokemonData(pokemonName);
});

// When submit is clicked get value from input and compare it to LocalStorage key names then render data.
pokemonLoadDataFormEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const pokemonName = document.getElementById("pokemon-load-name").value.trim().toUpperCase();
    if(pokemonSectionEl.childElementCount >= 6){
        console.error("You already have a full team!");
    }
    else{
        localStoragePokemonData(pokemonName);
    }
});

// Button for clearing LocalStorage.
clearSavedDataEl.addEventListener("submit", (event) => {
    event.preventDefault();
    localStorage.clear();
});

// Check which button is clicked and execute the function of the corresponding button.
pokemonSectionEl.addEventListener("click", (event) => {
    if(event.target.classList.contains("delete-button")){
        deletePokemon(event.target);
    }
    else if(event.target.classList.contains("save-button")){
        savePokemon(event.target);
    }
    else if(event.target.classList.contains("move-1-desc")){
        let moveName = event.target.parentElement.getElementsByClassName("move-select-1")[0].value;
        fetchMoveData(moveName, event.target);
    }
    else if(event.target.classList.contains("move-2-desc")){
        let moveName = event.target.parentElement.getElementsByClassName("move-select-2")[0].value;
        fetchMoveData(moveName, event.target);
    }
    else if(event.target.classList.contains("move-3-desc")){
        let moveName = event.target.parentElement.getElementsByClassName("move-select-3")[0].value;
        fetchMoveData(moveName, event.target);
    }
    else if(event.target.classList.contains("move-4-desc")){
        let moveName = event.target.parentElement.getElementsByClassName("move-select-4")[0].value;
        fetchMoveData(moveName, event.target);
    }
    else if(event.target.classList.contains("pokemon-ability-desc")){
        let abilityName = event.target.parentElement.getElementsByClassName("pokemon-ability-select")[0].value;
        fetchAbilityData(abilityName, event.target);
    }
});

// Listens if checkbox is being changed, and if it does, execute function below
pokemonSectionEl.addEventListener("change", (event) => {
    if(event.target.classList.contains("pokemon-shiny-checkbox")){

        changeSprite(event.target);
    }
});

// CREATE

// Fetch API with specific Pokemon name from input value.
async function fetchPokemonData(pokemonName)  {
    const pokemonUrl = API_URL + `pokemon/${pokemonName}`;

    if(pokemonSectionEl.childElementCount >= 6){
        console.error("You already have a full team!");
    }

    else{
        try {
            const response = await fetch(pokemonUrl);
    
            if( !response.ok){
                throw new Error(`Response status: ${response.status}`);
            }
    
            const json = await response.json();
            
            renderPokemon(json);
    
        } catch (error) {
    
            console.error(error);
        }
    }
}

async function fetchMoveData(moveName, e){
    const moveURL = API_URL + `move/${moveName}`;

    try {
        const response = await fetch(moveURL);

        if(!response.ok){
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();

        readMoveDesc(json, e);
    }
    catch (error){
        console.error(error);
        
    }
}

async function fetchAbilityData(abilityName, e){
    const abilityURL = API_URL + `ability/${abilityName}`;

    try {
        const response = await fetch(abilityURL);

        if(!response.ok){
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();

        readAbilityDesc(json, e);
    }
    catch (error){
        console.error(error);
        
    }
}

// Render Pokémon data on the website
function renderPokemon(json){
    
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

    if(Array.isArray(json)){
        localStorageList = [];
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

// READ

// Get data from Local Storage to render saved Pokémon
function localStoragePokemonData(pokemonName){
    if(localStorage.length <= 0){
        console.error("You have no saved Pokemon.");
    }
    else{
        for(let i = 0; i < localStorage.length; i++){
    
            if(localStorage.key(i) === pokemonName.toUpperCase()){
                localStorageList.push(JSON.parse(localStorage.getItem(`${pokemonName.toUpperCase()}`)));
            }
        }
        renderPokemon(localStorageList);
    }
}

// Using the target element to find the elements we want to change and a fetched API for the targeted move name.
function readMoveDesc(json, e){
    // Save target article to make it easier to access the individual elements we want to change.
    let overLayContent = e.parentElement.getElementsByClassName("pokemon-move-overlay")[0].getElementsByClassName("pokemon-move-overlay-content")[0];

    // Overlay Heading
    overLayContent.getElementsByClassName("pokemon-move-overlay-heading")[0].innerHTML = json.name.toUpperCase();

    // Overlay Type
    overLayContent.getElementsByClassName("pokemon-move-overlay-type")[0].innerHTML = `Type: ${json.type.name.toUpperCase()}`;

    // Overlay Power
    overLayContent.getElementsByClassName("pokemon-move-overlay-power")[0].innerHTML = `Power: ${json.power}`;

    // Overlay PP
    overLayContent.getElementsByClassName("pokemon-move-overlay-pp")[0].innerHTML = `PP: ${json.pp}`;

    // Overlay Accuracy
    overLayContent.getElementsByClassName("pokemon-move-overlay-acc")[0].innerHTML = `Accuracy: ${json.accuracy}`;

    // Overlay Description
    overLayContent.getElementsByClassName("pokemon-move-overlay-desc")[0].innerHTML = json.effect_entries[0].effect;
    
}

// Using the target element to find the elements we want to change and a fetched API for the targeted ability name.
function readAbilityDesc(json, e){
    // Save target article to make it easier to access the individual elements we want to change.
    let overLayContent = e.parentElement.getElementsByClassName("pokemon-ability-overlay")[0].getElementsByClassName("pokemon-ability-overlay-content")[0];
    
    // Overlay Heading
    overLayContent.getElementsByClassName("pokemon-ability-overlay-heading")[0].innerHTML = json.name.toUpperCase();

    // Overlay Description
    overLayContent.getElementsByClassName("pokemon-ability-overlay-desc")[0].innerHTML = json.effect_entries[1].effect;
    
}

// UPDATE

// Save current Pokémon Element to object => array => localStorage
function savePokemon(e){

    console.log(e.parentElement);
    console.log(e.parentElement.getElementsByClassName("move-select-1")[0].value);
    
    
    // Save element data to LocalStorage Object
    localStorageObject.Sprite = e.parentElement.getElementsByClassName("pokemon-sprite")[0].src;
    localStorageObject.ShinySprite = e.parentElement.getElementsByClassName("pokemon-shiny-sprite")[0].src;
    localStorageObject.Name = e.parentElement.getElementsByClassName("pokemon-data-name")[0].innerHTML;
    localStorageObject.Types = e.parentElement.getElementsByClassName("pokemon-data-type")[0].innerHTML;

    // Save element data array to LocalStorage Object

    // Save element data for moves
    for(let i = 0; i < e.parentElement.getElementsByClassName("move-select-1")[0].length; i++){
        localStorageObject.Move1[i] = e.parentElement.getElementsByClassName("move-select-1")[0][i].value;
        localStorageObject.Move1Selected = e.parentElement.getElementsByClassName("move-select-1")[0].value;
    }

    for(let i = 0; i < e.parentElement.getElementsByClassName("move-select-2")[0].length; i++){
        localStorageObject.Move2[i] = e.parentElement.getElementsByClassName("move-select-2")[0][i].value;
        localStorageObject.Move2Selected = e.parentElement.getElementsByClassName("move-select-2")[0].value;
    }

    for(let i = 0; i < e.parentElement.getElementsByClassName("move-select-3")[0].length; i++){
        localStorageObject.Move3[i] = e.parentElement.getElementsByClassName("move-select-3")[0][i].value;
        localStorageObject.Move3Selected = e.parentElement.getElementsByClassName("move-select-3")[0].value;
    }

    for(let i = 0; i < e.parentElement.getElementsByClassName("move-select-4")[0].length; i++){
        localStorageObject.Move4[i] = e.parentElement.getElementsByClassName("move-select-4")[0][i].value;
        localStorageObject.Move4Selected = e.parentElement.getElementsByClassName("move-select-4")[0].value;
    }

    // Save element data for abilities
    for(let i = 0; i < e.parentElement.getElementsByClassName("pokemon-ability-select")[0].length; i++){
        localStorageObject.Abilities[i] = e.parentElement.getElementsByClassName("pokemon-ability-select")[0][i].value;
        localStorageObject.AbilitySelected = e.parentElement.getElementsByClassName("pokemon-ability-select")[0].value;
    }
    
    // Save Object to List.
    localStorageList.push(localStorageObject);

    // Make Object empty again.
    localStorageObject = {
        Sprite: "",
        SpiteAlt: "",
        ShinySprite: "",
        ShinySpriteAlt: "",
        isShiny: false,
        Name: "",
        Types: [],
        Move1: [],
        Move2: [],
        Move3: [],
        Move4: [],
        Abilities: []
    };
    
    saveToLocalStorage(localStorageList);
}

// Checks if shiny checkbox is checked, then change display style for the two different img elements and the other way around
function changeSprite(e){
    if(e.checked){
        e.parentElement.parentElement.children[0].style.display = "none";
        e.parentElement.parentElement.children[1].style.display = "block";
        localStorageObject.isShiny = true;
    }
    else {
        e.parentElement.parentElement.children[0].style.display = "block";
        e.parentElement.parentElement.children[1].style.display = "none";
        localStorageObject.isShiny = false;
    }
}

// For every index in list, save it to LocalStorage.
function saveToLocalStorage(array){
    localStorage.setItem(`${array[0].Name}`, JSON.stringify(array));
    localStorageList = [];
}

// DELETE

// Delete current Pokémon Element and delete Pokemon data from Local Storage
function deletePokemon(e){

    if(localStorage.length !== 0){
        for(let i = 0; i < localStorage.length; i++){
            if(e.parentElement.children[2].children[0].innerHTML === localStorage.key(i)){
                localStorage.removeItem(`${localStorage.key(i)}`);
            }
        }
    }
    e.parentElement.remove();
}