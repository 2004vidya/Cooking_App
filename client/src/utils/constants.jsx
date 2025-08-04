
export const VOICE_COMMANDS = {
  NAVIGATION: [
    'go home',
    'show favorites',
    'go back',
    'next page',
    'previous page'
  ],
  RECIPE_CONTROL: [
    'next step',
    'previous step',
    'repeat step',
    'show ingredients',
    'start timer',
    'set timer for 5 minutes'
  ],
  SEARCH: [
    'search for pasta',
    'find chicken recipes',
    'show desserts'
  ],
  FAVORITES: [
    'add to favorites',
    'remove from favorites',
    'favorite this recipe'
  ]
};

// Recipe Categories
export const RECIPE_CATEGORIES = [
  'all',
  'appetizer',
  'main-course',
  'dessert',
  'breakfast',
  'lunch',
  'dinner',
  'snack',
  'beverage'
];

// Cooking Difficulty Levels
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

// Time Units
export const TIME_UNITS = {
  MINUTES: 'minutes',
  HOURS: 'hours',
  SECONDS: 'seconds'
};

// Sample Recipes Data
export const SAMPLE_RECIPES = [
  {
    id: 1,
    title: "Classic Spaghetti Carbonara",
    description: "A traditional Italian pasta dish made with eggs, cheese, pancetta, and pepper.",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400",
    category: "main-course",
    difficulty: "medium",
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    rating: 4.8,
    ingredients: [
      "400g spaghetti",
      "200g pancetta or guanciale, diced",
      "4 large eggs",
      "100g Pecorino Romano cheese, grated",
      "50g Parmesan cheese, grated",
      "Black pepper, freshly ground",
      "Salt to taste",
      "2 cloves garlic (optional)"
    ],
    instructions: [
      "Bring a large pot of salted water to boil and cook spaghetti according to package directions.",
      "While pasta cooks, heat a large skillet over medium heat and add pancetta. Cook until crispy, about 5-7 minutes.",
      "In a bowl, whisk together eggs, Pecorino Romano, Parmesan, and a generous amount of black pepper.",
      "Reserve 1 cup of pasta cooking water, then drain the pasta.",
      "Add hot pasta to the skillet with pancetta and toss for 1 minute.",
      "Remove from heat and quickly stir in the egg mixture, adding pasta water gradually to create a creamy sauce.",
      "Serve immediately with extra cheese and black pepper."
    ],
    tags: ["italian", "pasta", "quick", "traditional"],
    nutrition: {
      calories: 520,
      protein: 28,
      carbs: 58,
      fat: 18
    }
  },
  {
    id: 2,
    title: "Chocolate Chip Cookies",
    description: "Soft and chewy chocolate chip cookies that are perfect for any occasion.",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400",
    category: "dessert",
    difficulty: "easy",
    prepTime: 15,
    cookTime: 12,
    servings: 24,
    rating: 4.9,
    ingredients: [
      "2¼ cups all-purpose flour",
      "1 tsp baking soda",
      "1 tsp salt",
      "1 cup butter, softened",
      "¾ cup granulated sugar",
      "¾ cup brown sugar, packed",
      "2 large eggs",
      "2 tsp vanilla extract",
      "2 cups chocolate chips"
    ],
    instructions: [
      "Preheat oven to 375°F (190°C).",
      "In a bowl, whisk together flour, baking soda, and salt.",
      "In a large bowl, cream together butter and both sugars until light and fluffy.",
      "Beat in eggs one at a time, then stir in vanilla.",
      "Gradually blend in flour mixture.",
      "Stir in chocolate chips.",
      "Drop rounded tablespoons of dough onto ungreased cookie sheets.",
      "Bake for 9-11 minutes or until golden brown.",
      "Cool on baking sheet for 2 minutes before removing to wire rack."
    ],
    tags: ["dessert", "cookies", "chocolate", "baking"],
    nutrition: {
      calories: 180,
      protein: 2,
      carbs: 26,
      fat: 8
    }
  },
  {
    id: 3,
    title: "Grilled Chicken Caesar Salad",
    description: "Fresh romaine lettuce topped with grilled chicken, parmesan, and homemade Caesar dressing.",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
    category: "main-course",
    difficulty: "easy",
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    rating: 4.6,
    ingredients: [
      "4 chicken breasts",
      "2 heads romaine lettuce, chopped",
      "½ cup Parmesan cheese, grated",
      "1 cup croutons",
      "¼ cup olive oil",
      "2 cloves garlic, minced",
      "2 anchovy fillets (optional)",
      "1 lemon, juiced",
      "1 tsp Worcestershire sauce",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Season chicken breasts with salt and pepper.",
      "Grill chicken over medium-high heat for 6-7 minutes per side until cooked through.",
      "Let chicken rest for 5 minutes, then slice.",
      "For dressing, whisk together olive oil, garlic, anchovy, lemon juice, Worcestershire sauce.",
      "In a large bowl, toss romaine with dressing.",
      "Top with sliced chicken, Parmesan cheese, and croutons.",
      "Serve immediately."
    ],
    tags: ["salad", "chicken", "healthy", "protein"],
    nutrition: {
      calories: 380,
      protein: 35,
      carbs: 12,
      fat: 22
    }
  },
  {
    id: 4,
    title: "Avocado Toast with Poached Egg",
    description: "Creamy avocado spread on toasted bread, topped with a perfectly poached egg.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400",
    category: "breakfast",
    difficulty: "easy",
    prepTime: 10,
    cookTime: 5,
    servings: 2,
    rating: 4.5,
    ingredients: [
      "2 slices whole grain bread",
      "1 ripe avocado",
      "2 eggs",
      "1 tbsp white vinegar",
      "1 tbsp lemon juice",
      "Salt and pepper to taste",
      "Red pepper flakes (optional)",
      "Everything bagel seasoning (optional)"
    ],
    instructions: [
      "Toast bread slices until golden brown.",
      "Fill a saucepan with water and bring to a gentle simmer. Add vinegar.",
      "Crack each egg into a small bowl.",
      "Create a gentle whirlpool in the water and carefully slide egg into center.",
      "Poach for 3-4 minutes for runny yolk.",
      "Mash avocado with lemon juice, salt, and pepper.",
      "Spread avocado mixture on toast.",
      "Top with poached egg and seasonings.",
      "Serve immediately."
    ],
    tags: ["breakfast", "healthy", "avocado", "eggs"],
    nutrition: {
      calories: 320,
      protein: 15,
      carbs: 25,
      fat: 18
    }
  },
  {
    id: 5,
    title: "Thai Green Curry",
    description: "Aromatic and spicy Thai curry with coconut milk, vegetables, and your choice of protein.",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400",
    category: "main-course",
    difficulty: "medium",
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    rating: 4.7,
    ingredients: [
      "400ml coconut milk",
      "3 tbsp green curry paste",
      "500g chicken thigh, sliced",
      "1 eggplant, cubed",
      "1 bell pepper, sliced",
      "100g green beans, trimmed",
      "2 tbsp fish sauce",
      "1 tbsp palm sugar",
      "Thai basil leaves",
      "2 kaffir lime leaves",
      "1 red chili, sliced",
      "Jasmine rice for serving"
    ],
    instructions: [
      "Heat half the coconut milk in a wok over medium heat.",
      "Add curry paste and fry for 2-3 minutes until fragrant.",
      "Add chicken and cook until sealed.",
      "Add remaining coconut milk, fish sauce, and palm sugar.",
      "Bring to a simmer and add eggplant.",
      "Cook for 10 minutes, then add bell pepper and green beans.",
      "Simmer for 5 more minutes until vegetables are tender.",
      "Stir in lime leaves and basil.",
      "Serve over jasmine rice, garnished with chili and extra basil."
    ],
    tags: ["thai", "curry", "spicy", "coconut"],
    nutrition: {
      calories: 450,
      protein: 32,
      carbs: 15,
      fat: 28
    }
  },
  {
    id: 6,
    title: "Blueberry Pancakes",
    description: "Fluffy pancakes bursting with fresh blueberries, perfect for weekend mornings.",
    image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400",
    category: "breakfast",
    difficulty: "easy",
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    rating: 4.8,
    ingredients: [
      "2 cups all-purpose flour",
      "2 tbsp sugar",
      "2 tsp baking powder",
      "1 tsp salt",
      "2 eggs",
      "1¾ cups milk",
      "¼ cup melted butter",
      "1 cup fresh blueberries",
      "Butter for cooking",
      "Maple syrup for serving"
    ],
    instructions: [
      "In a large bowl, whisk together flour, sugar, baking powder, and salt.",
      "In another bowl, beat eggs, then stir in milk and melted butter.",
      "Pour wet ingredients into dry ingredients and stir until just combined (lumps are okay).",
      "Gently fold in blueberries.",
      "Heat a griddle or large skillet over medium heat and add butter.",
      "Pour ¼ cup batter for each pancake.",
      "Cook until bubbles form on surface, then flip and cook until golden brown.",
      "Serve hot with butter and maple syrup."
    ],
    tags: ["pancakes", "breakfast", "blueberries", "weekend"],
    nutrition: {
      calories: 350,
      protein: 12,
      carbs: 52,
      fat: 11
    }
  }
];

// Voice Recognition Settings
export const VOICE_SETTINGS = {
  LANGUAGE: 'en-US',
  CONTINUOUS: true,
  INTERIM_RESULTS: true,
  MAX_ALTERNATIVES: 1
};

// Timer Presets (in minutes)
export const TIMER_PRESETS = [
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '15 min', value: 15 },
  { label: '20 min', value: 20 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1 hour', value: 60 }
];

// App Routes
export const ROUTES = {
  HOME: '/',
  RECIPE: '/recipe/:id',
  FAVORITES: '/favorites',
  SEARCH: '/search'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  FAVORITES: 'cookingApp_favorites',
  RECENT_RECIPES: 'cookingApp_recentRecipes',
  USER_PREFERENCES: 'cookingApp_userPreferences'
};

// API Endpoints (for future use)
export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  RECIPES: '/recipes',
  SEARCH: '/recipes/search',
  FAVORITES: '/favorites'
};

export default {
  VOICE_COMMANDS,
  RECIPE_CATEGORIES,
  DIFFICULTY_LEVELS,
  TIME_UNITS,
  SAMPLE_RECIPES,
  VOICE_SETTINGS,
  TIMER_PRESETS,
  ROUTES,
  STORAGE_KEYS,
  API_ENDPOINTS
};