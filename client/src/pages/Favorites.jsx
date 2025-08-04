import React from 'react';
import { Heart, Clock, Users, Star, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import useRecipes from '../hooks/useRecipes';
import VoiceControls from '../components/VoiceControls';

const Favorites = () => {
  const { 
    getFavoriteRecipes, 
    removeFromFavorites, 
    loading,
    isFavorite 
  } = useRecipes();

  const favoriteRecipes = getFavoriteRecipes();

  const handleVoiceCommand = (command) => {
    const { type, recipeId } = command;
    
    switch (type) {
      case 'REMOVE_FROM_FAVORITES':
        if (recipeId) {
          removeFromFavorites(recipeId);
        }
        break;
      case 'CLEAR_FAVORITES':
        // Clear all favorites functionality could be added here
        break;
      default:
        break;
    }
  };

  const handleRemoveFavorite = (recipeId) => {
    removeFromFavorites(recipeId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            <h1 className="text-4xl font-bold text-gray-800">My Favorites</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Your saved recipes for easy access
          </p>
        </div>

        {/* Voice Controls */}
        <div className="mb-8 flex justify-center">
          <VoiceControls onCommand={handleVoiceCommand} />
        </div>

        {/* Favorites Stats */}
        {favoriteRecipes.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {favoriteRecipes.length} Favorite Recipe{favoriteRecipes.length !== 1 ? 's' : ''}
                  </h3>
                  <p className="text-gray-600">
                    Keep your best recipes handy
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  Total cooking time: {favoriteRecipes.reduce((total, recipe) => total + recipe.cookTime, 0)} minutes
                </p>
                <p className="text-sm text-gray-500">
                  Average rating: {(favoriteRecipes.reduce((total, recipe) => total + (recipe.rating || 0), 0) / favoriteRecipes.length || 0).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {favoriteRecipes.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              No favorites yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start building your collection by adding recipes to your favorites. 
              Click the heart icon on any recipe to save it here.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Browse Recipes
            </Link>
          </div>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteRecipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Recipe Image */}
                <div className="relative">
                  <img 
                    src={recipe.image} 
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => handleRemoveFavorite(recipe.id)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm capitalize">
                      {recipe.category.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                {/* Recipe Content */}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {recipe.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {recipe.description}
                  </p>

                  {/* Recipe Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{recipe.prepTime + recipe.cookTime} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{recipe.servings}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{recipe.rating}</span>
                    </div>
                  </div>

                  {/* Difficulty Badge */}
                  <div className="mb-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      recipe.difficulty === 'easy' 
                        ? 'bg-green-100 text-green-700'
                        : recipe.difficulty === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {recipe.tags?.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      to={`/recipe/${recipe.id}`}
                      className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-center font-medium"
                    >
                      View Recipe
                    </Link>
                    <button
                      onClick={() => handleRemoveFavorite(recipe.id)}
                      className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Remove from favorites"
                    >
                      <Heart className="w-5 h-5 text-red-500 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Voice Commands Help */}
        {favoriteRecipes.length > 0 && (
          <div className="mt-12 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              Voice Commands for Favorites
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <p className="font-medium mb-1">Navigation:</p>
                <ul className="space-y-1">
                  <li>• "Go home" - Return to home page</li>
                  <li>• "Show all recipes" - Browse recipes</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">Recipe Actions:</p>
                <ul className="space-y-1">
                  <li>• "Remove from favorites" - Remove recipe</li>
                  <li>• "Open recipe [name]" - View specific recipe</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {favoriteRecipes.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <div className="text-2xl font-bold text-orange-500">
                {favoriteRecipes.filter(r => r.category === 'main-course').length}
              </div>
              <div className="text-sm text-gray-600">Main Courses</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <div className="text-2xl font-bold text-green-500">
                {favoriteRecipes.filter(r => r.category === 'dessert').length}
              </div>
              <div className="text-sm text-gray-600">Desserts</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <div className="text-2xl font-bold text-blue-500">
                {favoriteRecipes.filter(r => r.category === 'breakfast').length}
              </div>
              <div className="text-sm text-gray-600">Breakfast</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <div className="text-2xl font-bold text-purple-500">
                {favoriteRecipes.filter(r => r.difficulty === 'easy').length}
              </div>
              <div className="text-sm text-gray-600">Easy Recipes</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;