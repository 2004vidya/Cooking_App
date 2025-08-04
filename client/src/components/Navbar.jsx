// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChefHat, Search, Settings, Home, BookOpen, Heart } from 'lucide-react';
import { useRecipe } from '../contexts/RecipeContext';
import SearchBar from './SearchBar';

const Navbar = () => {
  const location = useLocation();
  const { favorites } = useRecipe();
  const [showSettings, setShowSettings] = useState(false);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const NavLink = ({ to, children, icon: Icon }) => (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
        isActive(to)
          ? 'bg-blue-500 text-white shadow-lg' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-4 h-4" />
      {children}
    </Link>
  );

  return (
    <>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                VoiceChef
              </h1>
            </Link>
            
            <div className="flex items-center gap-4">
              <SearchBar />
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Settings Dropdown */}
        {showSettings && (
          <div className="absolute top-16 right-4 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50">
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg">
                Voice Settings
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg">
                Display Preferences
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg">
                About
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Navigation */}
      <nav className="bg-white/50 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8 py-4">
            <NavLink to="/" icon={Home}>
              Home
            </NavLink>
            <NavLink to="/recipes" icon={BookOpen}>
              All Recipes
            </NavLink>
            <NavLink to="/favorites" icon={Heart}>
              Favorites ({favorites.length})
            </NavLink>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
