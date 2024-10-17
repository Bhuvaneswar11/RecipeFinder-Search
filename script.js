const appId = '5ec4ca30';
const appKey = 'dc620684e47f3cad8dcf59921cdc8d7e';
const apiUrl = 'https://api.edamam.com/api/recipes/v2';

document.getElementById('search-button').addEventListener('click', fetchRecipes);
document.addEventListener('DOMContentLoaded', loadFavorites);
document.getElementById('toggle-mode').addEventListener('click', toggleDarkMode);

async function fetchRecipes() {
    const query = document.getElementById('search-input').value;
    const diet = document.getElementById('diet-select').value;
    const health = document.getElementById('health-select').value;
    const url = `${apiUrl}?type=public&q=${query}&app_id=${appId}&app_key=${appKey}${diet ? `&diet=${diet}` : ''}${health ? `&health=${health}` : ''}&to=10`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayRecipes(data.hits);
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

function displayRecipes(recipes) {
    const container = document.getElementById('recipe-container');
    container.innerHTML = '';

    recipes.forEach(({ recipe }) => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.label}">
            <h3>${recipe.label}</h3>
            <button onclick="viewRecipe('${recipe.uri}')">View Recipe</button>
            <button onclick="toggleFavorite('${recipe.uri}', '${recipe.label}', '${recipe.image}')">Add Favorite</button>
        `;
        container.appendChild(recipeCard);
    });
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

async function viewRecipe(uri) {
    const recipeId = uri.split('#recipe_')[1];
    const url = `https://api.edamam.com/api/recipes/v2/${recipeId}?type=public&app_id=${appId}&app_key=${appKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const recipe = data.recipe;
        alert(`Ingredients: ${recipe.ingredientLines.join(', ')}\nInstructions: ${recipe.url}`);
    } catch (error) {
        console.error('Error fetching recipe details:', error);
    }
}

function toggleFavorite(uri, label, image) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.find(f => f.uri === uri)) {
        favorites = favorites.filter(f => f.uri !== uri);
        alert('Recipe removed from favorites.');
    } else {
        favorites.push({ uri, label, image });
        alert('Recipe added to favorites.');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadFavorites();
}

function loadFavorites() {
    const favoritesContainer = document.getElementById('favorites-list');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favoritesContainer.innerHTML = '';

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p>No favorites added yet.</p>';
    } else {
        favorites.forEach(({ uri, label, image }) => {
            const favoriteCard = document.createElement('div');
            favoriteCard.classList.add('favorite-card');
            favoriteCard.innerHTML = `
                <img src="${image}" alt="${label}">
                <h3>${label}</h3>
                <button onclick="viewRecipe('${uri}')">View Recipe</button>
                <button onclick="toggleFavorite('${uri}', '${label}', '${image}')">Remove from Favorites</button>
            `;
            favoritesContainer.appendChild(favoriteCard);
        });
    }
}


function showHome() {
    document.getElementById('home-section').style.display = 'block';
    document.getElementById('favorites-container').style.display = 'none';
}

function showFavorites() {
    document.getElementById('home-section').style.display = 'none';
    document.getElementById('favorites-container').style.display = 'block';
    loadFavorites();
}
