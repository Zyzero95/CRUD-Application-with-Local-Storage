// API Url for PokéApi, a free open source REST API
const API_URL = "https://pokeapi.co/api/v2/";

// Theme - A Pokémon Teambuilder. (Choose Pokémon, Moveset, Regular/Shiny, Ability) Up to 6 Pokémon in a team.

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

clearSavedDataEl.addEventListener("submit", (event) => {
    event.preventDefault();
    localStorage.clear();
});

// Check which button is clicked (either delete or save button) and execute the function of the corresponding button.
pokemonSectionEl.addEventListener("click", (event) => {
    if(event.target.classList.contains("delete-button")){
        deletePokemon(event.target);
    }
    else if(event.target.classList.contains("save-button")){
        savePokemon(event.target);
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
    pokemonMovesForm.innerHTML = "Pokemon Moves";

    // Move Selection 1
    let pokemonMove1 = document.createElement("select");

    // Move Selection 2
    let pokemonMove2 = document.createElement("select");

    // Move Selection 3
    let pokemonMove3 = document.createElement("select");

    // Move Selection 4
    let pokemonMove4 = document.createElement("select");

    // Store all moves learned by this Pokemon in each select to be able to change your selected moves.
    if(Array.isArray(json)){
        
        for(let i = 0; i < json[0][0].Move1.length; i++){

            let pokemonMove1Option = document.createElement("option");
            pokemonMove1Option.value = json[0][0].Move1[i];
            pokemonMove1Option.innerHTML = json[0][0].Move1[i];
            pokemonMove1.appendChild(pokemonMove1Option);
        }
        for(let i = 0; i < json[0][0].Move2.length; i++){

            let pokemonMove2Option = document.createElement("option");
            pokemonMove2Option.value = json[0][0].Move2[i];
            pokemonMove2Option.innerHTML = json[0][0].Move2[i];
            pokemonMove2.appendChild(pokemonMove2Option);
        }
        for(let i = 0; i < json[0][0].Move3.length; i++){

            let pokemonMove3Option = document.createElement("option");
            pokemonMove3Option.value = json[0][0].Move3[i];
            pokemonMove3Option.innerHTML = json[0][0].Move3[i];
            pokemonMove3.appendChild(pokemonMove3Option);
        }
        for(let i = 0; i < json[0][0].Move4.length; i++){

            let pokemonMove4Option = document.createElement("option");
            pokemonMove4Option.value = json[0][0].Move4[i];
            pokemonMove4Option.innerHTML = json[0][0].Move4[i];
            pokemonMove4.appendChild(pokemonMove4Option);
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

    // Store all abilities for this Pokemon

    // Check if the Pokemon data is added(API) or loaded(LocalStorage)
    if(Array.isArray(json)){
        for(let i = 0; i < json[0][0].Abilities.length; i++){
            let pokemonAbility = document.createElement("option");
            pokemonAbility.value = json[0][0].Abilities[i];
            pokemonAbility.innerHTML = json[0][0].Abilities[i];
            pokemonAbilities.appendChild(pokemonAbility);
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

// UPDATE

// Save current Pokémon Element to object => array => localStorage
function savePokemon(e){
    // Save element data to LocalStorage Object
    localStorageObject.Sprite = e.parentElement.children[0].src;
    localStorageObject.ShinySprite = e.parentElement.children[1].src;
    localStorageObject.Name = e.parentElement.children[2].children[0].innerHTML;
    localStorageObject.Types = e.parentElement.children[2].children[1].innerHTML;

    // Save element data array to LocalStorage Object

    for(let i = 0; i < e.parentElement.children[3].children[0].children.length; i++){
        localStorageObject.Move1[i] = e.parentElement.children[3].children[0].children[i].value;
    }

    for(let i = 0; i < e.parentElement.children[3].children[1].children.length; i++){
        localStorageObject.Move2[i] = e.parentElement.children[3].children[1].children[i].value;
    }

    for(let i = 0; i < e.parentElement.children[3].children[2].children.length; i++){
        localStorageObject.Move3[i] = e.parentElement.children[3].children[2].children[i].value;
    }

    for(let i = 0; i < e.parentElement.children[3].children[3].children.length; i++){
        localStorageObject.Move4[i] = e.parentElement.children[3].children[3].children[i].value;
    }

    for(let i = 0; i < e.parentElement.children[5].children[0].children.length; i++){
        localStorageObject.Abilities[i] = e.parentElement.children[5].children[0].children[i].value;
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