// src/components/RecipeCard.jsx
// src/components/RecipeCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, ChefHat, Heart, Star, ArrowRight } from 'lucide-react';
import { useRecipe } from '../contexts/RecipeContext';
import { useNavigate } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  const { favorites, actions } = useRecipe();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const isFavorite = favorites.includes(recipe._id);
  const navigate = useNavigate();

  // Enhanced fallback images based on recipe type
  const getFallbackImage = (recipeName) => {
    const name = recipeName?.toLowerCase() || '';
    
    if (name.includes('butter chicken')) {
      return 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop&auto=format';
    } else if (name.includes('paneer tikka')) {
      return 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop&auto=format';
    } else if (name.includes('chole bhature')) {
      return 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop&auto=format';
    } else if (name.includes('biryani')) {
      return 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400&h=300&fit=crop&auto=format';
    } else if (name.includes('masala dosa')) {
      return 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop&auto=format';
    } else if (name.includes('aloo paratha')) {
      return 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop&auto=format';
    } else if (name.includes('palak paneer')) {
      return 'https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=400&h=300&fit=crop&auto=format';
    } else if (name.includes('samosa')) {
      return 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&auto=format';
    } else if (name.includes('kadai paneer')) {
      return 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop&auto=format';
    } else if (name.includes('dal makhani')) {
      return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&auto=format';
    } else {
      // Generic food fallback
      return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&auto=format';
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    actions.toggleFavorite(recipe._id);
  };

  const handleCardClick = () => {
    console.log("Navigating to recipe with ID:", recipe._id);
    navigate(`/recipe/${recipe._id}`);
  };

  return (
    <div 
      onClick={handleCardClick} 
      className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer"
    >
      <div className="relative overflow-hidden">
        {/* Image with loading state */}
        <div className="relative w-full h-48 bg-gray-200">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <img 
            src={imageError ? getFallbackImage(recipe.title) : recipe.image} 
            
            alt={recipe.title || "Recipe"}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{ display: imageLoading ? 'none' : 'block' }}
          />
          console.log("Image used:", imageError ? getFallbackImage(recipe.title) : recipe.image);

        </div>

        {/* Favorite button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full backdrop-blur-md ${
              isFavorite
                ? 'bg-red-500 text-white' 
                : 'bg-white/20 text-white hover:bg-white/30'
            } transition-all duration-300`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Rating badge */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md rounded-full px-3 py-1">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{recipe.rating || "4.5"}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Title with better positioning - moved inward to prevent cutoff */}
        <div className="px-2">
          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300 transform group-hover:translate-x-1">
            {recipe.title || "Untitled Recipe"}
          </h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 px-2">
          {recipe.description || "A delicious recipe that you'll love to cook and share with family and friends."}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 px-2">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.time || "30 min"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings || "4"} servings</span>
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="w-4 h-4" />
            <span>{recipe.difficulty || "Easy"}</span>
          </div>
        </div>
        
        <Link
          to={`/recipe/${recipe._id}`}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 group/button"
        >
          Start Cooking
          <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Clock, Users, ChefHat, Heart, Star, ArrowRight } from 'lucide-react';
// import { useRecipe } from '../contexts/RecipeContext';
// import { useNavigate } from 'react-router-dom';

// const RecipeCard = ({ recipe }) => {
//   const { favorites, actions } = useRecipe();

//   const isFavorite = favorites.includes(recipe._id);
//   const navigate = useNavigate();

//   // Add logging to see what ID we're working with
//   console.log("Recipe in card:", recipe);
//   console.log("Recipe ID in card:", recipe._id);

//   const handleFavoriteClick = (e) => {
//     e.preventDefault();
//     e.stopPropagation(); // Prevent the card click from triggering
//     actions.toggleFavorite(recipe._id);
//   };

//   const handleCardClick = () => {
//     console.log("Navigating to recipe with ID:", recipe._id);
//     navigate(`/recipe/${recipe._id}`);
//   };

//   return (
//     <div 
//       onClick={handleCardClick} 
//       className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
//     >
//       <div className="relative overflow-hidden">
//         <img 
//           src={recipe.image  || "/fallback.jpg"} 
//           alt={recipe.title  }
//           className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
//         />
//         <div className="absolute top-4 right-4">
//           <button
//             onClick={handleFavoriteClick}
//             className={`p-2 rounded-full backdrop-blur-md ${
//               isFavorite
//                 ? 'bg-red-500 text-white' 
//                 : 'bg-white/20 text-white hover:bg-white/30'
//             } transition-all duration-300`}
//           >
//             <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
//           </button>
//         </div>
//         <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md rounded-full px-3 py-1">
//           <div className="flex items-center gap-1">
//             <Star className="w-4 h-4 text-yellow-500 fill-current" />
//             <span className="text-sm font-medium">{recipe.rating}</span>
//           </div>
//         </div>
//       </div>
      
//       <div className="p-6">
//         <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
//           {recipe.title || "Untitled"}
//         </h3>
//         <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
        
//         <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
//           <div className="flex items-center gap-1">
//             <Clock className="w-4 h-4" />
//             <span>{recipe.time}</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <Users className="w-4 h-4" />
//             <span>{recipe.servings} servings</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <ChefHat className="w-4 h-4" />
//             <span>{recipe.difficulty}</span>
//           </div>
//         </div>
        
//         <Link
//           to={`/recipe/${recipe._id}`}
//           className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 group"
//         >
//           Start Cooking
//           <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default RecipeCard;
