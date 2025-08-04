// src/contexts/RecipeContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";

const RecipeContext = createContext();

const initialState = {
  recipes: [],
  favorites: [],
  currentRecipe: null,
  currentStep: 0,
  isLoading: false,
  error: null,
  searchQuery: "",
  isListening: false,
  voiceCommand: "",
  isPlaying: false,
};

function recipeReducer(state, action) {
  switch (action.type) {
    case "SET_RECIPES":
      return { ...state, recipes: action.payload, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "SET_CURRENT_RECIPE":
      return { ...state, currentRecipe: action.payload, currentStep: 0 };
    case "SET_CURRENT_STEP":
      return { ...state, currentStep: action.payload };
    case "TOGGLE_FAVORITE":
      const recipeId = action.payload;
      const isFavorite = state.favorites.includes(recipeId);
      return {
        ...state,
        favorites: isFavorite
          ? state.favorites.filter((id) => id !== recipeId)
          : [...state.favorites, recipeId],
      };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_LISTENING":
      return { ...state, isListening: action.payload };
    case "SET_VOICE_COMMAND":
      return { ...state, voiceCommand: action.payload };
    case "SET_PLAYING":
      return { ...state, isPlaying: action.payload };
    case "NEXT_STEP":
      return {
        ...state,
        currentStep:
          state.currentRecipe &&
          state.currentStep < state.currentRecipe.steps.length - 1
            ? state.currentStep + 1
            : state.currentStep,
      };
    case "PREV_STEP":
      return {
        ...state,
        currentStep: state.currentStep > 0 ? state.currentStep - 1 : 0,
      };
    default:
      return state;
  }
}

export function RecipeProvider({ children }) {
  const [state, dispatch] = useReducer(recipeReducer, initialState);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("voiceChef_favorites");
    if (savedFavorites) {
      const favorites = JSON.parse(savedFavorites);
      favorites.forEach((id) =>
        dispatch({ type: "TOGGLE_FAVORITE", payload: id })
      );
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem(
      "voiceChef_favorites",
      JSON.stringify(state.favorites)
    );
  }, [state.favorites]);

  // Fetch recipes from API
  const fetchRecipes = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch("/api/recipes");
      const recipes = await response.json();
      dispatch({ type: "SET_RECIPES", payload: recipes });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      // Fallback to sample data if API fails
      dispatch({ type: "SET_RECIPES", payload: getSampleRecipes() });
    }
  };

  const getRecipeById = (id) => {
    if (!id) return null;

    // Try to find by both id and _id properties
    return state.recipes.find(
      (r) => String(r._id) === String(id) || String(r.id) === String(id)
    );
  };

  const getSampleRecipes = () => [
    {
      _id: 1,
      title: "Creamy Mushroom Risotto",
      image:
        "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop",
      time: "35 min",
      difficulty: "Medium",
      rating: 4.8,
      servings: 4,
      description:
        "Rich and creamy risotto with wild mushrooms and parmesan cheese",
      ingredients: [
        "2 cups Arborio rice",
        "1 lb mixed mushrooms",
        "4 cups warm chicken broth",
        "1 cup dry white wine",
        "1/2 cup grated Parmesan",
        "2 shallots, minced",
        "3 cloves garlic",
        "Fresh thyme and parsley",
      ],
      steps: [
        "Heat olive oil in a large pan over medium heat. Add mushrooms and cook until golden brown, about 5 minutes.",
        "Add minced shallots and garlic, cook for 2 minutes until fragrant.",
        "Add Arborio rice and stir for 2 minutes until lightly toasted.",
        "Pour in white wine and stir until absorbed.",
        "Add warm broth one ladle at a time, stirring constantly until absorbed before adding more.",
        "Continue for 18-20 minutes until rice is creamy and tender.",
        "Stir in Parmesan cheese, butter, and fresh herbs. Season with salt and pepper.",
        "Serve immediately with extra Parmesan and fresh black pepper.",
      ],
    },
    {
      _id: 2,
      title: "Mediterranean Chicken Bowls",
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
      time: "25 min",
      difficulty: "Easy",
      rating: 4.6,
      servings: 4,
      description:
        "Healthy and flavorful chicken bowls with Mediterranean vegetables",
      ingredients: [
        "4 chicken breasts",
        "2 cups quinoa",
        "1 cucumber, diced",
        "2 tomatoes, chopped",
        "1 red onion, sliced",
        "1/2 cup kalamata olives",
        "1/2 cup feta cheese",
        "Olive oil and lemon juice",
      ],
      steps: [
        "Season chicken breasts with Mediterranean herbs, salt, and pepper.",
        "Cook quinoa according to package instructions.",
        "Heat olive oil in a large skillet over medium-high heat.",
        "Cook chicken for 6-7 minutes per side until golden and cooked through.",
        "Let chicken rest for 5 minutes, then slice.",
        "Prepare vegetables: dice cucumber, chop tomatoes, slice red onion.",
        "Assemble bowls with quinoa, sliced chicken, and vegetables.",
        "Top with feta cheese, olives, and a drizzle of olive oil and lemon juice.",
      ],
    },
    {
      _id: 3,
      title: "Chocolate Lava Cake",
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
      time: "20 min",
      difficulty: "Easy",
      rating: 4.9,
      servings: 2,
      description: "Decadent individual chocolate cakes with molten centers",
      ingredients: [
        "4 oz dark chocolate",
        "4 tbsp butter",
        "2 large eggs",
        "2 tbsp granulated sugar",
        "2 tbsp all-purpose flour",
        "Pinch of salt",
        "Butter for ramekins",
        "Powdered sugar for dusting",
      ],
      steps: [
        "Preheat oven to 425°F (220°C). Butter two 6-oz ramekins.",
        "Melt chocolate and butter in a double boiler or microwave, stirring until smooth.",
        "In a bowl, whisk eggs and sugar until thick and pale.",
        "Fold in the melted chocolate mixture.",
        "Gently fold in flour and salt until just combined.",
        "Divide batter between prepared ramekins.",
        "Bake for 12-14 minutes until edges are firm but centers still jiggle.",
        "Let cool for 1 minute, then invert onto plates. Dust with powdered sugar and serve immediately.",
      ],
    },
  ];

  const searchRecipes = async (query) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });

    // simulate loading (optional)
    await new Promise((resolve) => setTimeout(resolve, 300));

    dispatch({ type: "SET_LOADING", payload: false });
  };

  const value = {
    ...state,
    dispatch,
    fetchRecipes,
    getRecipeById,
    searchRecipes,
    actions: {
      setRecipes: (recipes) =>
        dispatch({ type: "SET_RECIPES", payload: recipes }),
      setCurrentRecipe: (recipe) =>
        dispatch({ type: "SET_CURRENT_RECIPE", payload: recipe }),
      setCurrentStep: (step) =>
        dispatch({ type: "SET_CURRENT_STEP", payload: step }),
      toggleFavorite: (id) =>
        dispatch({ type: "TOGGLE_FAVORITE", payload: id }),
      setSearchQuery: (query) =>
        dispatch({ type: "SET_SEARCH_QUERY", payload: query }),
      setListening: (listening) =>
        dispatch({ type: "SET_LISTENING", payload: listening }),
      setVoiceCommand: (command) =>
        dispatch({ type: "SET_VOICE_COMMAND", payload: command }),
      setPlaying: (playing) =>
        dispatch({ type: "SET_PLAYING", payload: playing }),
      nextStep: () => dispatch({ type: "NEXT_STEP" }),
      prevStep: () => dispatch({ type: "PREV_STEP" }),
      repeatStep: () => {
        const step = currentRecipe.steps[currentStep];
        if (step) speak(step.instruction);
      },
      setTimer: (seconds) => {
        setTimer(seconds); // your existing timer setter
      },
    },
  };

  return (
    <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
  );
}

export function useRecipe() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipe must be used within a RecipeProvider");
  }
  return context;
}

export const useRecipeContext = () => useContext(RecipeContext);
