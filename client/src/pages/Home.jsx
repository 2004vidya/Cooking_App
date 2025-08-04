import React, { useEffect } from "react";
import { Mic, Sparkles } from "lucide-react";
import { useRecipe } from "../contexts/RecipeContext";
import RecipeCard from "../components/RecipeCard";
import useVoiceRecognition from "../hooks/useVoiceRecognition";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { recipes, searchQuery, isLoading, fetchRecipes, searchRecipes } =
    useRecipe();
  const { startListening, transcript, processVoiceCommand } =
    useVoiceRecognition();
  const navigate = useNavigate();

  useEffect(() => {
    if (recipes.length === 0) {
      fetchRecipes();
    }
  }, []);

  // Defensive filtering: safely access fields to avoid crashes
  const filteredRecipes = recipes.filter((recipe) => {
    const title = recipe?.title?.toLowerCase() || "";
    const description = recipe?.description?.toLowerCase() || "";
    const ingredients = Array.isArray(recipe?.ingredients)
      ? recipe.ingredients.join(" ").toLowerCase()
      : "";

    const query = searchQuery.toLowerCase();

    return (
      title.includes(query) ||
      description.includes(query) ||
      ingredients.includes(query)
    );
  });

  useEffect(() => {
    if (transcript && transcript.length > 2) {
      const command = processVoiceCommand(transcript);

      if (command.type === "SEARCH") {
        const cleanedQuery = command.query.toLowerCase().trim();
        const found = recipes.find(
          (r) =>
            r.title.toLowerCase().includes(cleanedQuery) ||
            r.description?.toLowerCase().includes(cleanedQuery) ||
            r.ingredients?.some((ing) =>
              ing.toLowerCase().includes(cleanedQuery)
            )
        );

        if (found) {
          navigate(`/recipe/${found._id}`);
        } else {
          searchRecipes(command.query); // fallback to search if not exact match

          setTimeout(() => {
            navigate("/");
          }, 5000);
        }
      }
    }
  }, [transcript]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          Voice-Powered Cooking Experience
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
          Cook with Your
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {" "}
            Voice
          </span>
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Hands-free cooking made simple. Use voice commands to navigate
          recipes, control playback, and never miss a step while your hands are
          busy.
        </p>
        <button
          onClick={startListening}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl"
        >
          <Mic className="w-5 h-5" />
          Try Voice Command
        </button>
      </div>

      {/* Search Results or Featured Recipes */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          {searchQuery
            ? `Search Results for "${searchQuery}"`
            : "Featured Recipes"}
        </h3>

        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery
                ? "No recipes found matching your search."
                : "No recipes available."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

// import React, { useEffect } from 'react';
// import { Mic, Sparkles } from 'lucide-react';
// import { useRecipe } from '../contexts/RecipeContext';
// import RecipeCard from '../components/RecipeCard';
// import useVoiceRecognition  from  '../hooks/useVoiceRecognition';

// const Home = () => {
//   const { recipes, searchQuery, isLoading, fetchRecipes } = useRecipe();
//   const { startListening } = useVoiceRecognition();

//   useEffect(() => {
//     if (recipes.length === 0) {
//       fetchRecipes();
//     }
//   }, []);

//   // Filter recipes based on search query
//   const filteredRecipes = recipes.filter(recipe =>
//     recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     recipe.ingredients.some(ingredient =>
//       ingredient.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//   );

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Hero Section */}
//       <div className="text-center mb-12">
//         <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
//           <Sparkles className="w-4 h-4" />
//           Voice-Powered Cooking Experience
//         </div>
//         <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
//           Cook with Your
//           <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Voice</span>
//         </h2>
//         <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
//           Hands-free cooking made simple. Use voice commands to navigate recipes,
//           control playback, and never miss a step while your hands are busy.
//         </p>
//         <button
//           onClick={startListening}
//           className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl"
//         >
//           <Mic className="w-5 h-5" />
//           Try Voice Command
//         </button>
//       </div>

//       {/* Search Results or Featured Recipes */}
//       <div className="mb-12">
//         <h3 className="text-2xl font-bold text-gray-800 mb-6">
//           {searchQuery ? `Search Results for "${searchQuery}"` : 'Featured Recipes'}
//         </h3>

//         {filteredRecipes.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg">
//               {searchQuery ? 'No recipes found matching your search.' : 'No recipes available.'}
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {filteredRecipes.map(recipe => (
//               <RecipeCard key={recipe._id} recipe={recipe} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;
