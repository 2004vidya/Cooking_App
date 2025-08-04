 
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecipeProvider } from './contexts/RecipeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import RecipeView from './pages/RecipeView'
import Favorites from './pages/Favorites';
import './index.css';

function App() {
  return (
    <RecipeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipe/:id" element={<RecipeView />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </Layout>
      </Router>
    </RecipeProvider>
  );
}

export default App;