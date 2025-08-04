import { useState, useEffect } from 'react';
import { SAMPLE_RECIPES } from '../utils/constants';

const useRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setRecipes(SAMPLE_RECIPES);
        
        // Load favorites from memory (would be localStorage in real app)
        const savedFavorites = JSON.parse(sessionStorage.getItem('favorites') || '[]');
        setFavorites(savedFavorites);
      } catch (err) {
        setError('Failed to load recipes');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Save favorites to session storage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Search and filter recipes
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.ingredients.some(ingredient => 
                           ingredient.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Add recipe to favorites
  const addToFavorites = (recipeId) => {
    setFavorites(prev => {
      if (!prev.includes(recipeId)) {
        return [...prev, recipeId];
      }
      return prev;
    });
  };

  // Remove recipe from favorites
  const removeFromFavorites = (recipeId) => {
    setFavorites(prev => prev.filter(id => id !== recipeId));
  };

  // Toggle favorite status
  const toggleFavorite = (recipeId) => {
    if (favorites.includes(recipeId)) {
      removeFromFavorites(recipeId);
    } else {
      addToFavorites(recipeId);
    }
  };

  // Check if recipe is favorited
  const isFavorite = (recipeId) => {
    return favorites.includes(recipeId);
  };

  // Get favorite recipes
  const getFavoriteRecipes = () => {
    return recipes.filter(recipe => favorites.includes(recipe._id));
  };

  // Get recipe by ID
  const getRecipeById = (id) => {
    return recipes.find(recipe => recipe.id === parseInt(id));
  };

  // Search recipes by voice query
  const searchRecipes = async (query) => {
    setLoading(true);
    setSearchQuery(query);
    
    // Simulate API search delay
    await new Promise(resolve => setTimeout(resolve, 300));
    setLoading(false);
  };

  // Get recipe suggestions based on ingredients
  const getRecipeSuggestions = (ingredients) => {
    return recipes.filter(recipe => 
      ingredients.some(ingredient => 
        recipe.ingredients.some(recipeIngredient => 
          recipeIngredient.toLowerCase().includes(ingredient.toLowerCase())
        )
      )
    ).slice(0, 5);
  };

  // Get popular recipes
  const getPopularRecipes = () => {
    return recipes
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 6);
  };

  // Get recent recipes (mock implementation)
  const getRecentRecipes = () => {
    return recipes.slice(-4);
  };

  // Get categories
  const getCategories = () => {
    const categories = [...new Set(recipes.map(recipe => recipe.category))];
    return ['all', ...categories];
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return {
    recipes: filteredRecipes,
    allRecipes: recipes,
    favorites,
    loading,
    error,
    searchQuery,
    selectedCategory,
    setSearchQuery,
    setSelectedCategory,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    getFavoriteRecipes,
    getRecipeById,
    searchRecipes,
    getRecipeSuggestions,
    getPopularRecipes,
    getRecentRecipes,
    getCategories,
    clearSearch
  };
};

export default useRecipes;