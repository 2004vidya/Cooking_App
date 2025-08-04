import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Heart, 
  Clock, 
  Users, 
  Star, 
  ChefHat, 
  ArrowLeft, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw,
  Timer,
  Volume2,
  VolumeX,
  CheckCircle,
  Circle,
  Utensils,
  Info
} from 'lucide-react';
import { useRecipeContext } from '../contexts/RecipeContext';
import VoiceControls from './VoiceControls';
import useVoiceRecognition from '../hooks/useVoiceRecognition';

const RecipeView_old = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getRecipeById,
    currentRecipe,
    currentStep,
    setCurrentRecipe,
    setCurrentStep,
    nextStep,
    previousStep,
    resetSteps,
    favorites,
    toggleFavorite,
    addTimer,
    timers,
    voiceEnabled,
    toggleVoice
  } = useRecipeContext();

  const { processVoiceCommand } = useVoiceRecognition();
  
  const [cookingMode, setCookingMode] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [speakingStep, setSpeakingStep] = useState(false);
  const [activeTimer, setActiveTimer] = useState(null);

  // Load recipe when component mounts or ID changes
  useEffect(() => {
    const recipe = getRecipeById(id);
    if (recipe) {
      setCurrentRecipe(recipe);
    } else {
      navigate('/');
    }
  }, [id, getRecipeById, setCurrentRecipe, navigate]);

  // Text-to-speech for reading instructions
  const speakInstruction = (instruction) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingStep(true);
      
      const utterance = new SpeechSynthesisUtterance(instruction);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => setSpeakingStep(false);
      utterance.onerror = () => setSpeakingStep(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingStep(false);
    }
  };

  // Handle voice commands
  const handleVoiceCommand = (command) => {
    const result = processVoiceCommand(command);
    
    switch (result.type) {
      case 'NEXT_STEP':
        handleNextStep();
        break;
      case 'PREVIOUS_STEP':
        handlePreviousStep();
        break;
      case 'REPEAT_STEP':
        if (currentRecipe) {
          speakInstruction(currentRecipe.instructions[currentStep]);
        }
        break;
      case 'TIMER':
        if (result.duration) {
          const timerId = addTimer(result.duration, `Step ${currentStep + 1} Timer`);
          setActiveTimer(timerId);
        }
        break;
      case 'ADD_TO_FAVORITES':
        toggleFavorite(currentRecipe.id);
        break;
      case 'SHOW_INGREDIENTS':
        document.getElementById('ingredients-section')?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  // Step navigation
  const handleNextStep = () => {
    if (currentRecipe && currentStep < currentRecipe.instructions.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      setCompletedSteps(prev => [...prev, currentStep]);
      
      if (cookingMode) {
        speakInstruction(currentRecipe.instructions[newStep]);
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      setCompletedSteps(prev => prev.filter(step => step !== currentStep));
      
      if (cookingMode) {
        speakInstruction(currentRecipe.instructions[newStep]);
      }
    }
  };

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
    if (cookingMode) {
      speakInstruction(currentRecipe.instructions[stepIndex]);
    }
  };

  const toggleCookingMode = () => {
    setCookingMode(!cookingMode);
    if (!cookingMode && currentRecipe) {
      speakInstruction(currentRecipe.instructions[currentStep]);
    } else {
      stopSpeaking();
    }
  };

  const resetProgress = () => {
    resetSteps();
    setCompletedSteps([]);
    stopSpeaking();
  };

  const startQuickTimer = (minutes) => {
    const duration = minutes * 60;
    const timerId = addTimer(duration, `${minutes} min timer`);
    setActiveTimer(timerId);
  };

  if (!currentRecipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  const isLastStep = currentStep === currentRecipe.instructions.length - 1;
  const isFavorited = favorites.includes(currentRecipe.id);
  const progressPercentage = ((currentStep + 1) / currentRecipe.instructions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            <div className="flex items-center gap-3">
              <VoiceControls onCommand={handleVoiceCommand} />
              <button
                onClick={() => toggleFavorite(currentRecipe.id)}
                className={`p-2 rounded-full transition-colors ${
                  isFavorited ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`w-6 h-6 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recipe Info */}
          <div className="lg:col-span-2">
            {/* Recipe Header */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <img 
                src={currentRecipe.image} 
                alt={currentRecipe.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-3">
                  {currentRecipe.title}
                </h1>
                <p className="text-gray-600 mb-4">
                  {currentRecipe.description}
                </p>
                
                {/* Recipe Meta */}
                <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Prep: {currentRecipe.prepTime} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4" />
                    <span>Cook: {currentRecipe.cookTime} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Serves: {currentRecipe.servings}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{currentRecipe.rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-4 h-4" />
                    <span className="capitalize">{currentRecipe.difficulty}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {currentRecipe.tags?.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Cooking Controls */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Cooking Mode</h2>
                <button
                  onClick={toggleVoice}
                  className={`p-2 rounded-full transition-colors ${
                    voiceEnabled ? 'text-blue-500 bg-blue-50' : 'text-gray-400'
                  }`}
                  title={voiceEnabled ? 'Voice enabled' : 'Voice disabled'}
                >
                  {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Step {currentStep + 1} of {currentRecipe.instructions.length}</span>
                  <span>{Math.round(progressPercentage)}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={toggleCookingMode}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    cookingMode 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {cookingMode ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {cookingMode ? 'Pause' : 'Start'} Cooking
                </button>
                
                <button
                  onClick={handlePreviousStep}
                  disabled={currentStep === 0}
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleNextStep}
                  disabled={isLastStep}
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
                
                <button
                  onClick={resetProgress}
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  title="Reset progress"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                
                <button
                  onClick={speakingStep ? stopSpeaking : () => speakInstruction(currentRecipe.instructions[currentStep])}
                  className={`p-2 rounded-lg transition-colors ${
                    speakingStep 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                  title={speakingStep ? 'Stop speaking' : 'Read instruction'}
                >
                  {speakingStep ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Quick Timers */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-600">Quick timers:</span>
                {[5, 10, 15, 20].map(minutes => (
                  <button
                    key={minutes}
                    onClick={() => startQuickTimer(minutes)}
                    className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors text-sm"
                  >
                    {minutes}m
                  </button>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Instructions</h2>
              
              {/* Current Step Highlight */}
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                    {currentStep + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 leading-relaxed">
                      {currentRecipe.instructions[currentStep]}
                    </p>
                    {speakingStep && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-orange-600">
                        <Volume2 className="w-4 h-4 animate-pulse" />
                        <span>Reading instruction...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* All Steps */}
              <div className="space-y-3">
                {currentRecipe.instructions.map((instruction, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      index === currentStep 
                        ? 'bg-orange-100 border-orange-200' 
                        : completedSteps.includes(index)
                        ? 'bg-green-50 border-green-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleStepClick(index)}
                  >
                    <div className="mt-1">
                      {completedSteps.includes(index) ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : index === currentStep ? (
                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-600">
                          Step {index + 1}
                        </span>
                        {index === currentStep && (
                          <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                            Current
                          </span>
                        )}
                        {completedSteps.includes(index) && (
                          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                            Done
                          </span>
                        )}
                      </div>
                      <p className={`text-sm leading-relaxed ${
                        index === currentStep ? 'text-gray-800 font-medium' : 'text-gray-600'
                      }`}>
                        {instruction}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ingredients */}
            <div id="ingredients-section" className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Utensils className="w-5 h-5" />
                Ingredients
              </h2>
              <ul className="space-y-2">
                {currentRecipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Circle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nutrition */}
            {currentRecipe.nutrition && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Nutrition
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-800">
                      {currentRecipe.nutrition.calories}
                    </div>
                    <div className="text-gray-600">Calories</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-800">
                      {currentRecipe.nutrition.protein}g
                    </div>
                    <div className="text-gray-600">Protein</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-800">
                      {currentRecipe.nutrition.carbs}g
                    </div>
                    <div className="text-gray-600">Carbs</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-800">
                      {currentRecipe.nutrition.fat}g
                    </div>
                    <div className="text-gray-600">Fat</div>
                  </div>
                </div>
              </div>
            )}

            {/* Active Timers */}
            {timers.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Timer className="w-5 h-5" />
                  Active Timers
                </h2>
                <div className="space-y-3">
                  {timers.map(timer => (
                    <div key={timer.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{timer.name}</span>
                        <span className="text-lg font-mono">
                          {Math.floor(timer.remaining / 60)}:{(timer.remaining % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Voice Commands Help */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                Voice Commands
              </h3>
              <div className="space-y-2 text-sm text-blue-700">
                <p>• "Next step" - Go to next instruction</p>
                <p>• "Previous step" - Go back one step</p>
                <p>• "Repeat step" - Read current step again</p>
                <p>• "Set timer for 5 minutes" - Start a timer</p>
                <p>• "Show ingredients" - Scroll to ingredients</p>
                <p>• "Add to favorites" - Save this recipe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeView_old;