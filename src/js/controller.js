// controller: File that will connect the view with the model

import * as model from './model.js'
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import 'regenerator-runtime/runtime' // polyfill async await for older browser
import 'core-js/stable'; // polyfill everything else
import 'regenerator-runtime';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
//https://forkify-api.herokuapp.com/api/v2/recipes/:id

if(module.hot){
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if(!id) return;
    recipeView.renderSpinner();
    
    //0) Update results view to mark selected search result
    resultView.update(model.getSearchResultsPage());
    
    // 0.1) Updation bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 1) Loading Recipe
    await model.loadRecipe(id)

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);


  } catch (err) {
    console.error(err);
    recipeView.renderError()
  }
};

const controlSearchResult = async function(){
  try{
    resultView.renderSpinner();
    console.log(resultView);
    // 1) Get search query
    const query = searchView.getQuery();
    if(!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultView.render(model.getSearchResultsPage(1));

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search)
  } catch (err){
    console.log(err);
  }
}

const controlPagination = function(goToPage){
      // 1) Render NEW results
    resultView.render(model.getSearchResultsPage(goToPage));

    // 2) Render NEW initial pagination buttons
    paginationView.render(model.state.search)
}

const newFeature = function(){
  console.log("Welcome to the application");
}

// event handlers: controls can be called by handlers too
const controlServings = function(newServings){
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function(){
  // 1) Add/Remove bookmark
  if(!model.state.recipe.bookmarked) 
    model.addBookmark(model.state.recipe);
  else if(model.state.recipe.bookmarked) 
    model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function(newRecipe) {
  try{
    // Show loading spinner 
    addRecipeView.renderSpinner()

    // console.log(newRecipe);
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe)

    // Sucess message
    addRecipeView.renderMessage();

    // render bookmark view 
    bookmarksView.render(model.state.bookmarks); 

    // Change ID in URL
    console.log('Change ID in URL');
    window.history.pushState({}, '', `#${model.state.recipe.id}`);

    //Close form window
    setTimeout(function(){
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

  } catch(err){
    console.error('💥💥💥', err);
    addRecipeView.renderError(err.message);
  }
}

const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination); 
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature()
}

init()