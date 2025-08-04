// src/components/SearchBar.jsx
import React from 'react';
import { Search } from 'lucide-react';
import { useRecipe } from '../contexts/RecipeContext';

const SearchBar = () => {
  const { searchQuery, actions } = useRecipe();

  return (
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchQuery}
        onChange={(e) => actions.setSearchQuery(e.target.value)}
        className="pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all w-full"
      />
    </div>
  );
};

export default SearchBar;