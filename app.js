const searchInput = document.querySelector("#search-input");
const searchForm = document.querySelector("#meal-search-form");
const mealList = document.querySelector("#meal");
const mealDetails = document.querySelector(".meal-details");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.querySelector("#recipe-close-btn");

// search by main ingredient
// https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast

//event listener
searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  getMealList();
});

mealList.addEventListener("click", getMealRecipe);

recipeCloseBtn.addEventListener("click", function () {
  mealDetails.classList.remove("showRecipe");
});

async function fetchMealList(ingredient) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  );

  const responseData = await response.json();

  let html = "";
  if (responseData.meals) {
    responseData.meals.map((meal) => {
      mealList.classList.remove("notFound");

      html += ` <div class="meal-item" data-id="${meal.idMeal}">
    <div class="meal-img">
      <img src="${meal.strMealThumb}" alt="" />
    </div>

    <div class="meal-name">
      <h3>${meal.strMeal}</h3>
      <a href="#" " class="recipe-btn">Get Recipe</a>
    </div>
  </div>`;
    });
  } else {
    html += "Sorry, we didn't find any meal!";
    mealList.classList.add("notFound");
  }

  document.querySelector("#meal-result-for").innerHTML = ingredient;
  mealList.innerHTML = html;
}

// ingredients နဲ့ ကိုက်ညီတဲ့ meal list ကို ပြန်ထုတ်ပေးပါ
function getMealList() {
  let searchInputText = searchInput.value.trim().replace(/ /g, "_");
  fetchMealList(searchInputText);
  searchInput.value = " ";
}

async function fetchMealRecipe(id) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );

  const responseData = await response.json();

  return responseData.meals[0];
}

async function getMealRecipe(e) {
  let html = "";
  e.preventDefault();
  const mealId = e.target.closest(".meal-item").getAttribute("data-id");
  const recipe = await fetchMealRecipe(mealId);

  console.log(recipe);

  html += `<div class="meal-details-content">
    <h2 class="recipe-title">${recipe.strMeal}</h2>
    <p class="recipe-category">${recipe.strCategory}</p>
    <div class="recipe-instruct">
      <h3>Instructions:</h3>
      <p>
        ${recipe.strInstructions}
      </p>
    </div>

    <div class="recipe-meal-img">
      <img src="${recipe.strMealThumb}" alt="" />
    </div>

    <div class="recipe-link">
      <a href="${recipe.strYoutube}" target="_blank">Watch Video</a>
    </div>
  </div>`;

  mealDetails.classList.add("showRecipe");
  mealDetailsContent.innerHTML = html;
}
