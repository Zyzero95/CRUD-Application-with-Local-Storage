// API Url for PokéApi, a free open source REST API
const API_URL = "https://pokeapi.co/api/v2/";

// Theme - A Pokémon Teambuilder. (Choose Pokémon, Moveset, Regular/Shiny, Ability and Item) Up to 6 Pokémon in a team.

// Empty array used for updating Local Storage
let localStorageList = [];

// DOM Selectors
const pokemonSectionEl = document.getElementById("pokemon-section");
const pokemonDataFormEl = document.getElementById("pokemon-data-form");

// When submit is clicked get value from input and then fetch API.
pokemonDataFormEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const pokemonName = document.getElementById("pokemon-name").value.trim().toLowerCase();
    fetchPokemonData(pokemonName);
});

// Fetch API with specific Pokemon name from input value.
async function fetchPokemonData(pokemonName)  {
    const pokemonUrl = API_URL + `pokemon/${pokemonName}`;
    console.log(pokemonUrl);
    
    try {
        const response = await fetch(pokemonUrl);

        if( !response.ok){
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);

    } catch (error) {

        console.error(error);
    }
}

