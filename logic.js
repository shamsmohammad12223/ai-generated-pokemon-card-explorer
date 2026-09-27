// API URL
const API_URL = "https://pokeapi.co/api/v2/pokemon/";


// Get HTML elements
const searchForm = document.getElementById("searchForm");
const pokemonInput = document.getElementById("pokemonInput");
const message = document.getElementById("message");

const pokemonCard = document.getElementById("pokemonCard");

const pokemonName = document.getElementById("pokemonName");
const pokemonId = document.getElementById("pokemonId");
const pokemonImage = document.getElementById("pokemonImage");

const pokemonType = document.getElementById("pokemonType");
const pokemonTypes = document.getElementById("pokemonTypes");

const pokemonHeight = document.getElementById("pokemonHeight");
const pokemonWeight = document.getElementById("pokemonWeight");
const pokemonAbilities = document.getElementById("pokemonAbilities");


// Search form
searchForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = pokemonInput.value.trim().toLowerCase();

    if (name === "") {

        showError("Please enter a Pokémon name.");

        return;
    }

    getPokemon(name);
});


// Quick search buttons
const quickButtons = document.querySelectorAll(".quick-btn");

quickButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const name = button.dataset.name;

        pokemonInput.value = name;

        getPokemon(name);
    });

});


// Get Pokémon data
async function getPokemon(name) {

    // Show loading message
    message.textContent = "Loading Pokémon data...";
    message.className = "loading";

    pokemonCard.style.display = "none";


    try {

        // Create API URL
        const url = API_URL + name;

        // Request API
        const response = await fetch(url);


        // Check response
        if (!response.ok) {

            throw new Error(
                "Pokémon not found. Please check the name and try again."
            );
        }


        // Convert response to JSON
        const data = await response.json();


        // Display data
        displayPokemon(data);


        // Success message
        message.textContent = `Loaded ${capitalize(data.name)} successfully.`;
        message.className = "";


    } catch (error) {

        showError(error.message);

    }
}


// Display Pokémon
function displayPokemon(data) {

    // Name
    pokemonName.textContent = capitalize(data.name);


    // ID
    pokemonId.textContent =
        "#" + String(data.id).padStart(3, "0");


    // Official artwork
    pokemonImage.src =
        data.sprites.other["official-artwork"].front_default;


    pokemonImage.alt =
        capitalize(data.name);


    // =========================
    // TYPES
    // =========================

    pokemonTypes.innerHTML = "";


    data.types.forEach(function (typeData) {

        const typeName = typeData.type.name;

        const badge = document.createElement("span");

        badge.className = "type-badge";

        badge.textContent = typeName.toUpperCase();

        pokemonTypes.appendChild(badge);

    });


    // Main type
    pokemonType.textContent =
        data.types[0].type.name.toUpperCase() + " TYPE";


    // =========================
    // HEIGHT
    // =========================

    // API gives height in decimeters
    const heightInMeters = data.height / 10;

    pokemonHeight.textContent =
        heightInMeters.toFixed(1) + " M";


    // =========================
    // WEIGHT
    // =========================

    // API gives weight in hectograms
    const weightInKg = data.weight / 10;

    pokemonWeight.textContent =
        weightInKg.toFixed(1) + " KG";


    // =========================
    // ABILITIES
    // =========================

    const abilities = data.abilities
        .map(function (abilityData) {

            return capitalize(
                abilityData.ability.name.replace("-", " ")
            );

        });


    pokemonAbilities.textContent =
        abilities.join(", ");


    // =========================
    // STATS
    // =========================

    data.stats.forEach(function (statData) {

        const statName = statData.stat.name;

        const statValue = statData.base_stat;


        if (statName === "hp") {

            updateStat(
                "hp",
                statValue
            );

        }

        else if (statName === "attack") {

            updateStat(
                "attack",
                statValue
            );

        }

        else if (statName === "defense") {

            updateStat(
                "defense",
                statValue
            );

        }

        else if (statName === "special-attack") {

            updateStat(
                "specialAttack",
                statValue
            );

        }

        else if (statName === "special-defense") {

            updateStat(
                "specialDefense",
                statValue
            );

        }

        else if (statName === "speed") {

            updateStat(
                "speed",
                statValue
            );

        }

    });


    // Show card
    pokemonCard.style.display = "block";


    // Change card according to type
    changeTypeTheme(data.types[0].type.name);
}


// Update one stat
function updateStat(name, value) {

    const valueElement =
        document.getElementById(name + "Value");

    const barElement =
        document.getElementById(name + "Bar");


    valueElement.textContent = value;


    // Maximum normal Pokémon stat is around 255
    const percentage =
        Math.min((value / 255) * 100, 100);


    barElement.style.width =
        percentage + "%";
}


// Show error
function showError(text) {

    message.textContent = text;

    message.className = "error";

    pokemonCard.style.display = "none";
}


// Capitalize first letter
function capitalize(text) {

    return text.charAt(0).toUpperCase() + text.slice(1);
}


// Change card theme based on Pokémon type
function changeTypeTheme(type) {

    const cardTop =
        document.querySelector(".card-top");


    const typeColors = {

        fire: ["#7a241c", "#29121a"],

        water: ["#174f86", "#111b38"],

        grass: ["#21613c", "#10261c"],

        electric: ["#705e16", "#211d10"],

        psychic: ["#6b235c", "#241326"],

        ice: ["#27717c", "#10282d"],

        dragon: ["#4d2a85", "#1a1230"],

        dark: ["#37323d", "#141217"],

        fairy: ["#8a3e62", "#281522"],

        fighting: ["#713522", "#271612"],

        poison: ["#613a76", "#201326"],

        ground: ["#715328", "#271d12"],

        rock: ["#62572e", "#211e12"],

        bug: ["#3e652e", "#172612"],

        ghost: ["#42346d", "#18132b"],

        steel: ["#42536a", "#151c27"],

        flying: ["#3d5682", "#121a2d"],

        normal: ["#50545c", "#17191d"]

    };


    const colors =
        typeColors[type] || typeColors.normal;


    cardTop.style.background =
        `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
}


// Load Pikachu when page opens
getPokemon("pikachu");