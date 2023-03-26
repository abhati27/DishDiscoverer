let previousSearchResults;

async function searchRecipes() {
  const searchInput = document.getElementById("search");
  const query = searchInput.value.trim();

  if (query === "") {
    alert("Please enter a search term");
    return;
  }

  const apiKey = "a79e760fe84349c3a40ced2bca758b04";
  const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}&number=10`;

  const response = await fetch(apiUrl);
  const data = await response.json();

  displayResults(data.results);
}

function displayResults(recipes) {
  previousSearchResults = recipes;
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  recipes.forEach(recipe => {
    const recipeDiv = document.createElement("div");
    recipeDiv.classList.add("recipe");

    const title = document.createElement("h2");
    title.innerHTML = `<a href="#" onclick="fetchRecipeDetails(${recipe.id})">${recipe.title}</a>`;

    const image = document.createElement("img");
    image.src = recipe.image;
    image.width = 200;

    recipeDiv.appendChild(title);
    recipeDiv.appendChild(image);

    resultsDiv.appendChild(recipeDiv);
  });
}

async function fetchRecipeDetails(recipeId) {
  const apiKey = "a79e760fe84349c3a40ced2bca758b04";
  const apiUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

  const response = await fetch(apiUrl);
  const recipe = await response.json();

  const prepTime = recipe.preparationMinutes || "N/A";
  const cookTime = recipe.cookingMinutes || "N/A";
  const servings = recipe.servings || "N/A";
  const nutrition = recipe.nutrition || {};

  displayRecipeDetails(recipe, prepTime, cookTime, servings, nutrition);
}

function displayRecipeDetails(recipe, prepTime, cookTime, servings, nutrition) {
  const resultsDiv = document.getElementById("results");
  const recipeDetailsDiv = document.getElementById("recipe-details");
  resultsDiv.style.display = "none";

  const backButton = document.createElement("button");
  backButton.innerText = "Go Back";
  backButton.onclick = () => {
    recipeDetailsDiv.style.display = "none";
    resultsDiv.style.display = "block";
    displayResults(previousSearchResults);
  };

  const title = document.createElement("h2");
  title.innerText = recipe.title;

  const image = document.createElement("img");
  image.src = recipe.image;
  image.width = 200;

  const timesAndServings = document.createElement("p");
  timesAndServings.innerHTML = `Prep Time: ${prepTime} minutes <br> Cook Time: ${cookTime} minutes <br> Servings: ${servings}`;

  const nutritionalInfo = document.createElement("p");

  if (nutrition.nutrients) {
    const calories = nutrition.nutrients.find((n) => n.title === "Calories");
    const protein = nutrition.nutrients.find((n) => n.title === "Protein");
    const fat = nutrition.nutrients.find((n) => n.title === "Fat");
    const carbohydrates = nutrition.nutrients.find((n) => n.title === "Carbohydrates");

    nutritionalInfo.innerHTML = `Calories: ${calories ? calories.amount + " " + calories.unit : "N/A"} <br>
    Protein: ${protein ? protein.amount + " " + protein.unit : "N/A"} <br>
    Fat: ${fat ? fat.amount + " " + fat.unit : "N/A"} <br>
    Carbohydrates: ${carbohydrates ? carbohydrates.amount + " " + carbohydrates.unit : "N/A"}`;
  }

  const instructions = document.createElement("p");
  instructions.innerHTML = recipe.instructions;

  recipeDetailsDiv.innerHTML = "";
  recipeDetailsDiv.appendChild(backButton);
  recipeDetailsDiv.appendChild(title);
  recipeDetailsDiv.appendChild(image);
  recipeDetailsDiv.appendChild(timesAndServings);
  recipeDetailsDiv.appendChild(nutritionalInfo);
  recipeDetailsDiv.appendChild(instructions);
  recipeDetailsDiv.style.display = "block";
}

