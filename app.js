// API Url for PokéApi, a free open source REST API.
const API_URL = "https://pokeapi.co/api/v2/";

// Import renderPokemon.
import renderPokemon from "./renderPokemon.js"; 

// Empty object used for updating Local Storage.
let localStorageList = [];

// Stores data from API to be saved in Local Storage.
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

// Will help decide which API page that will be fetched.
let apiPageData = {
    pokemonName: "",
    moveName: "",
    abilityName: ""
};

// DOM Selectors.
const pokemonSectionEl = document.getElementById("pokemon-section");
const pokemonNewDataFormEl = document.getElementById("pokemon-new-data-form");
const pokemonLoadDataFormEl = document.getElementById("pokemon-load-data-form");
const clearSavedDataEl = document.getElementById("clear-save-data-form");

// When submit is clicked get value from input and then fetch API.
pokemonNewDataFormEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const pokemonName = document.getElementById("pokemon-name").value.trim().toLowerCase();
    apiPageData.pokemonName = pokemonName;
    fetchPokemonData(pokemonName);
});

// Event Listeners

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
    // DELETE
    if(event.target.classList.contains("delete-button")){
        event.target.parentElement.remove();
    }
    // Save to Local Storage
    else if(event.target.classList.contains("save-button")){
        savePokemon(event.target);
    }
    // Fetch API data for Move 1 value.
    else if(event.target.classList.contains("move-1-desc")){
        let moveName = event.target.parentElement.getElementsByClassName("move-select-1")[0].value;
        apiPageData.moveName = moveName;
        fetchPokemonData(moveName, event.target.parentElement);
    }
    // Fetch API data for Move 2 value.
    else if(event.target.classList.contains("move-2-desc")){
        let moveName = event.target.parentElement.getElementsByClassName("move-select-2")[0].value;
        apiPageData.moveName = moveName;
        fetchPokemonData(moveName, event.target.parentElement);
        
    }
    // Fetch API data for Move 3 value.
    else if(event.target.classList.contains("move-3-desc")){
        let moveName = event.target.parentElement.getElementsByClassName("move-select-3")[0].value;
        apiPageData.moveName = moveName;
        fetchPokemonData(moveName, event.target.parentElement);
    }
    // Fetch API data for Move 4 value.
    else if(event.target.classList.contains("move-4-desc")){
        let moveName = event.target.parentElement.getElementsByClassName("move-select-4")[0].value;
        apiPageData.moveName = moveName;
        fetchPokemonData(moveName, event.target.parentElement);
    }
    // Fetch API data for ability value.
    else if(event.target.classList.contains("pokemon-ability-desc")){
        let abilityName = event.target.parentElement.getElementsByClassName("pokemon-ability-select")[0].value;
        apiPageData.abilityName = abilityName;
        fetchPokemonData(abilityName, event.target.parentElement);
    }
    // Sets styling of unique modal ID.
    else if(event.target.classList.contains("pokemon-move-overlay-close") || event.target.classList.contains("pokemon-ability-overlay-close")){
        event.target.parentElement.parentElement.style.display = "none";
        event.target.parentElement.parentElement.style.opacity = "0";
    }
});

// Listens if checkbox is being changed, and if it does, execute function below.
pokemonSectionEl.addEventListener("change", (event) => {
    if(event.target.classList.contains("pokemon-shiny-checkbox")){

        changeSprite(event.target);
    }
});

// Fetch API depending on which data value is present. pokemon name fetches pokemon data, move name fetches move data and ability name fetches ability data.
async function fetchPokemonData(apiName, e)  {
    // Fetch API data when clicking Add Pokemon
    if(apiName === apiPageData.pokemonName){
        
        const pokemonUrl = API_URL + `pokemon/${apiName}`;

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
                apiPageData.pokemonName = "";
                renderPokemon(json);
    
            } catch (error) {
    
                console.error(error);
            }
        }
    }
    // Fetch API data when clicking on Desc. for a move.
    else if(apiName === apiPageData.moveName){
            
            const moveURL = API_URL + `move/${apiName}`;

        try {
            const response = await fetch(moveURL);

            if(!response.ok){
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            apiPageData.moveName = "";
            readMoveDesc(json, e);
        }
        catch (error){
            console.error(error);
        
            }
    }
    // Fetch API data when clicking on Desc. for ability.
    else if(apiName === apiPageData.abilityName){
            
            const abilityURL = API_URL + `ability/${apiName}`;

        try {
            const response = await fetch(abilityURL);

            if(!response.ok){
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            apiPageData.abilityName = "";
            readAbilityDesc(json, e);
        }
        catch (error){
            console.error(error);
        
        }
    }
    
}

// Get data from Local Storage to render saved Pokémon.
function localStoragePokemonData(pokemonName){
    if(localStorage.length <= 0){
        console.error("You have no saved Pokemon.");
    }
    else{
        for(let i = 0; i < localStorage.length; i++){
    
            if(localStorage.key(i) === pokemonName.toUpperCase()){
                localStorageList.push(JSON.parse(localStorage.getItem(`${pokemonName.toUpperCase()}`)));
            }
            else{
                console.error("You don't have this Pokémon saved.");
            }
        }
        if(localStorageList.length != 0){
            renderPokemon(localStorageList);
            localStorageList = [];
        }
    }
}

// Using the target element to find the elements we want to change and a fetched API for the targeted move name.
function readMoveDesc(json, e){

    // Save target section to make it easier to access the individual elements we want to change.
    let overlay = e.getElementsByClassName("pokemon-move-overlay")[0];
    overlay.style.display = "block"
    overlay.style.opacity = "1";
    let overLayContent = overlay.getElementsByClassName("pokemon-move-overlay-content")[0];
    
    // Overlay Heading.
    overLayContent.getElementsByClassName("pokemon-move-overlay-heading")[0].innerHTML = json.name.toUpperCase();

    // Overlay Type.
    overLayContent.getElementsByClassName("pokemon-move-overlay-type")[0].innerHTML = `Type: ${json.type.name.toUpperCase()}`;

    // Overlay Power.
    overLayContent.getElementsByClassName("pokemon-move-overlay-power")[0].innerHTML = `Power: ${json.power}`;

    // Overlay PP.
    overLayContent.getElementsByClassName("pokemon-move-overlay-pp")[0].innerHTML = `PP: ${json.pp}`;

    // Overlay Accuracy.
    overLayContent.getElementsByClassName("pokemon-move-overlay-acc")[0].innerHTML = `Accuracy: ${json.accuracy}`;

    // Overlay Description.
    overLayContent.getElementsByClassName("pokemon-move-overlay-desc")[0].innerHTML = json.effect_entries[0].effect;
    
}

// Using the target element to find the elements we want to change and a fetched API for the targeted ability name.
function readAbilityDesc(json, e){

    // Save target section to make it easier to access the individual elements we want to change and set styling for appropriate id.
    let overlay = e.getElementsByClassName("pokemon-ability-overlay")[0];
    overlay.style.display = "block";
    overlay.style.opacity = "1";
    let overLayContent = overlay.getElementsByClassName("pokemon-ability-overlay-content")[0];
    
    // Overlay Heading.
    overLayContent.getElementsByClassName("pokemon-ability-overlay-heading")[0].innerHTML = json.name.toUpperCase();

    // Overlay Description.
    overLayContent.getElementsByClassName("pokemon-ability-overlay-desc")[0].innerHTML = json.effect_entries[1].effect;
    
}

// Save current Pokémon Element to object => array => localStorage.
function savePokemon(e){
    
    // Save element data to LocalStorage Object.
    localStorageObject.Sprite = e.parentElement.getElementsByClassName("pokemon-sprite")[0].src;
    localStorageObject.ShinySprite = e.parentElement.getElementsByClassName("pokemon-shiny-sprite")[0].src;
    localStorageObject.Name = e.parentElement.getElementsByClassName("pokemon-data-name")[0].innerHTML;
    localStorageObject.Types = e.parentElement.getElementsByClassName("pokemon-data-type")[0].innerHTML;

    // Save element data array to LocalStorage Object.

    // Save element data value for move 1.
    for(let i = 0; i < e.parentElement.getElementsByClassName("move-select-1")[0].length; i++){
        localStorageObject.Move1[i] = e.parentElement.getElementsByClassName("move-select-1")[0][i].value;
        localStorageObject.Move1Selected = e.parentElement.getElementsByClassName("move-select-1")[0].value;
    }
    // Save element data value for move 2.
    for(let i = 0; i < e.parentElement.getElementsByClassName("move-select-2")[0].length; i++){
        localStorageObject.Move2[i] = e.parentElement.getElementsByClassName("move-select-2")[0][i].value;
        localStorageObject.Move2Selected = e.parentElement.getElementsByClassName("move-select-2")[0].value;
    }
    // Save element data value for move 3.
    for(let i = 0; i < e.parentElement.getElementsByClassName("move-select-3")[0].length; i++){
        localStorageObject.Move3[i] = e.parentElement.getElementsByClassName("move-select-3")[0][i].value;
        localStorageObject.Move3Selected = e.parentElement.getElementsByClassName("move-select-3")[0].value;
    }
    // Save element data value for move 4.
    for(let i = 0; i < e.parentElement.getElementsByClassName("move-select-4")[0].length; i++){
        localStorageObject.Move4[i] = e.parentElement.getElementsByClassName("move-select-4")[0][i].value;
        localStorageObject.Move4Selected = e.parentElement.getElementsByClassName("move-select-4")[0].value;
    }

    // Save element data value for abilities.
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
        Move1Selected: "",
        Move2Selected: "",
        Move3Selected: "",
        Move4Selected: "",
        AbilitySelected: "",
        Abilities: []
    };
    
    saveToLocalStorage(localStorageList);
}

// Checks if shiny checkbox is checked, then change display style for the two different img elements and the other way around.
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

// Save the only present index to Local Storage and empty List.
function saveToLocalStorage(array){
    localStorage.setItem(`${array[0].Name}`, JSON.stringify(array));
    localStorageList = [];
}
