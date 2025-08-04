// src/pages/RecipeView.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useVoiceRecognition from "../hooks/useVoiceRecognition";
import { useRecipe } from "../contexts/RecipeContext";
import useSpeechSynthesis from "../hooks/useSpeechSynthesis";
import { useRef } from "react";

const RecipeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentRecipe, currentStep, actions } = useRecipe();
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef(null);
  const { speak, cancel } = useSpeechSynthesis();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showIngredients, setShowIngredients] = useState(false);
  const step = currentRecipe?.steps?.[currentStep];

  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    processVoiceCommand,
  } = useVoiceRecognition();

  const getSampleRecipe = (id) => {
    return {
      _id: id,
      id: id,
      title: "Rajma Chawal",
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&h=600&fit=crop",
      description: "A delicious North Indian comfort food combining kidney beans curry with rice.",
      ingredients: [
        "1 cup rajma (kidney beans)",
        "2 cups rice",
        "2 onions, chopped",
        "3 tomatoes, chopped",
        "2 tsp ginger-garlic paste",
        "1 tsp cumin seeds",
        "2 tsp red chili powder",
        "1 tsp turmeric powder",
        "1 tsp garam masala",
        "Salt to taste",
        "2 tbsp oil"
      ],
      steps: [
        { instruction: "Soak rajma overnight and boil until tender.", duration: 30 },
        { instruction: "Heat oil in a pan and add cumin seeds.", duration: 2 },
        { instruction: "Add onions and sauté until golden brown.", duration: 5 },
        { instruction: "Add ginger-garlic paste and cook for 2 minutes.", duration: 2 },
        { instruction: "Add tomatoes and cook until soft.", duration: 8 },
        { instruction: "Add spices and cook for 2 minutes.", duration: 2 },
        { instruction: "Add boiled rajma and simmer for 15 minutes.", duration: 15 },
        { instruction: "Serve hot with steamed rice.", duration: 0 }
      ],
      prepTime: 15,
      cookTime: 45,
      servings: 4,
      difficulty: "medium",
      rating: 4.5
    };
  };

  useEffect(() => {
    if (!id) {
      console.error("No recipe ID provided in URL");
      setError("No recipe ID provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log("Fetching recipe with ID:", id);

    fetch(`/api/recipes/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched recipe data:", data);
        if (!data) {
          throw new Error("No recipe data returned");
        }
        actions.setCurrentRecipe(data);
        actions.setCurrentStep(0);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching recipe:", error);
        console.log("Using sample recipe data instead");
        
        const sampleRecipe = getSampleRecipe(id);
        actions.setCurrentRecipe(sampleRecipe);
        actions.setCurrentStep(0);
        
        setError("Using sample data: " + error.message);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            actions.nextStep();
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timer]);

  useEffect(() => {
    if (step?.instruction) {
      speak(step.instruction);
      if (step.duration && step.duration > 0) {
        setTimer(step.duration);
      }
    }
  }, [currentStep]);

  useEffect(() => {
    const command = processVoiceCommand(transcript);
    if (!command || command.type === "UNKNOWN") return;

    switch (command.type) {
      case "NEXT_STEP":
        actions.nextStep();
        break;
      case "PREVIOUS_STEP":
        actions.prevStep();
        break;
      case "REPEAT_STEP":
        speak(step.instruction); 
        resetTranscript();
        break;
      case "TIMER":
        const duration =
          command.unit === "minutes" ? command.duration * 60 : command.duration;
        setTimer(duration);
        break;
      default:
        break;
    }

    resetTranscript();
  }, [transcript]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6">
            <div className="w-full h-full border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 text-lg font-medium">Loading your recipe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-gray-100">
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 font-medium shadow-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!currentRecipe || !currentRecipe.steps || currentRecipe.steps.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-gray-100">
          <div className="text-gray-400 text-6xl mb-6">🍳</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recipe Not Available</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">This recipe has no cooking steps available.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 font-medium shadow-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{currentRecipe.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {currentRecipe.prepTime + currentRecipe.cookTime} min
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {currentRecipe.servings} servings
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {currentRecipe.rating}/5
                </span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setShowIngredients(!showIngredients)}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all text-sm font-medium shadow-sm"
          >
            {showIngredients ? 'Hide' : 'Show'} Ingredients
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel - Recipe Content */}
        <div className="flex-1 flex flex-col p-6 space-y-6">
          {/* Recipe Image */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 h-64">
            <img
              src={currentRecipe.image}
              alt={currentRecipe.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = 'https://source.unsplash.com/800x600/?food';
              }}
            />
          </div>

          {/* Step Card */}
          <div className="bg-white rounded-2xl shadow-sm p-8 flex-1 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Step {currentStep + 1}
              </h2>
              <div className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-700">
                {currentStep + 1} of {currentRecipe.steps.length}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / currentRecipe.steps.length) * 100}%` }}
              ></div>
            </div>

            {/* Step Instruction */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8 border border-blue-100">
              <p className="text-xl text-gray-800 leading-relaxed text-center">
                {step.instruction}
              </p>
            </div>

            {/* Timer Display */}
            {timer > 0 && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-mono font-bold text-orange-600 mb-4">
                    {Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)}
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${100 - (timer / (step.duration || 60)) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-orange-700 text-sm mt-2 font-medium">Timer Active</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-4">
              <button 
                onClick={actions.prevStep} 
                disabled={currentStep === 0}
                className="flex-1 py-4 px-6 bg-gray-100 text-gray-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-all font-medium text-lg"
              >
                ← Previous
              </button>
              <button
                onClick={actions.nextStep}
                disabled={currentStep >= currentRecipe.steps.length - 1}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-600 transition-all font-medium text-lg"
              >
                {currentStep >= currentRecipe.steps.length - 1 ? '🎉 Complete!' : 'Next →'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Controls */}
        <div className="w-80 p-6 space-y-6">
          {/* Voice Controls */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-2xl">🎙️</span>
              Voice Controls
            </h3>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <button 
                  onClick={startListening}
                  disabled={isListening}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    isListening 
                      ? 'bg-red-50 text-red-600 cursor-not-allowed border border-red-200' 
                      : 'bg-green-500 text-white hover:bg-green-600 shadow-sm'
                  }`}
                >
                  {isListening ? '🔴 Listening...' : '🎤 Start'}
                </button>
                <button 
                  onClick={stopListening}
                  className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-medium shadow-sm"
                >
                  Stop
                </button>
              </div>

              {transcript && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-blue-900 text-sm">
                    <span className="font-bold">You said:</span> "{transcript}"
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-700 font-bold mb-3">Voice Commands:</p>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  <span>"Next step" - Move forward</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  <span>"Previous step" - Go back</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  <span>"Repeat" - Hear step again</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  <span>"Timer 5 minutes" - Set timer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              <button 
                onClick={() => speak(step.instruction)}
                className="w-full py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all font-medium border border-blue-200"
              >
                🔊 Repeat Step
              </button>
              <button 
                onClick={() => setTimer(0)}
                className="w-full py-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-medium border border-gray-200"
              >
                ⏹️ Stop Timer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredients Overlay */}
      {showIngredients && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" 
            style={{
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none'
            }}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-3xl">🥘</span>
                  Ingredients
                </h2>
                <button 
                  onClick={() => setShowIngredients(false)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentRecipe.ingredients.map((item, idx) => (
                  <div key={idx} className="flex items-center text-gray-700 py-3 px-4 bg-gray-50 rounded-xl">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeView;

// // src/pages/RecipeView.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import useVoiceRecognition from "../hooks/useVoiceRecognition";
// import { useRecipe } from "../contexts/RecipeContext";
// import useSpeechSynthesis from "../hooks/useSpeechSynthesis";
// import { useRef } from "react";

// const RecipeView = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { currentRecipe, currentStep, actions } = useRecipe();
//   const [timer, setTimer] = useState(0);
//  const intervalRef = useRef(null);
//   const { speak, cancel } = useSpeechSynthesis();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showIngredients, setShowIngredients] = useState(false);
//   const [selectedTime, setSelectedTime] = useState(5);
//   const step = currentRecipe?.steps?.[currentStep];

//   const {
//     transcript,
//     isListening,
//     startListening,
//     stopListening,
//     resetTranscript,
//     processVoiceCommand,
//   } = useVoiceRecognition();

//   const getSampleRecipe = (id) => {
//     return {
//       _id: id,
//       id: id,
//       title: "Rajma Chawal",
//       image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&h=600&fit=crop",
//       description: "A delicious North Indian comfort food combining kidney beans curry with rice.",
//       ingredients: [
//         "1 cup rajma (kidney beans)",
//         "2 cups rice",
//         "2 onions, chopped",
//         "3 tomatoes, chopped",
//         "2 tsp ginger-garlic paste",
//         "1 tsp cumin seeds",
//         "2 tsp red chili powder",
//         "1 tsp turmeric powder",
//         "1 tsp garam masala",
//         "Salt to taste",
//         "2 tbsp oil"
//       ],
//       steps: [
//         { instruction: "Soak rajma overnight and boil until tender.", duration: 30 },
//         { instruction: "Heat oil in a pan and add cumin seeds.", duration: 2 },
//         { instruction: "Add onions and sauté until golden brown.", duration: 5 },
//         { instruction: "Add ginger-garlic paste and cook for 2 minutes.", duration: 2 },
//         { instruction: "Add tomatoes and cook until soft.", duration: 8 },
//         { instruction: "Add spices and cook for 2 minutes.", duration: 2 },
//         { instruction: "Add boiled rajma and simmer for 15 minutes.", duration: 15 },
//         { instruction: "Serve hot with steamed rice.", duration: 0 }
//       ],
//       prepTime: 15,
//       cookTime: 45,
//       servings: 4,
//       difficulty: "medium",
//       rating: 4.5
//     };
//   };

//   // Analog Clock Component
//   const AnalogClock = ({ selectedTime, onTimeChange, onStart }) => {
//     const [isDragging, setIsDragging] = useState(false);
    
//     const handleMouseDown = (e) => {
//       setIsDragging(true);
//     };
    
//     const handleMouseMove = (e) => {
//       if (!isDragging) return;
      
//       const rect = e.currentTarget.getBoundingClientRect();
//       const centerX = rect.left + rect.width / 2;
//       const centerY = rect.top + rect.height / 2;
//       const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
//       const normalizedAngle = (angle + Math.PI * 2.5) % (Math.PI * 2);
//       const minutes = Math.round((normalizedAngle / (Math.PI * 2)) * 60);
//       onTimeChange(Math.max(1, minutes));
//     };
    
//     const handleMouseUp = () => {
//       setIsDragging(false);
//     };
    
//     useEffect(() => {
//       if (isDragging) {
//         document.addEventListener('mousemove', handleMouseMove);
//         document.addEventListener('mouseup', handleMouseUp);
//         return () => {
//           document.removeEventListener('mousemove', handleMouseMove);
//           document.removeEventListener('mouseup', handleMouseUp);
//         };
//       }
//     }, [isDragging]);

//     const minuteAngle = (selectedTime / 60) * 360 - 90;
    
//     return (
//       <div className="relative">
//         <div className="w-48 h-48 mx-auto">
//           <svg
//             width="192"
//             height="192"
//             className="cursor-pointer"
//             onMouseDown={handleMouseDown}
//           >
//             {/* Clock face */}
//             <circle
//               cx="96"
//               cy="96"
//               r="90"
//               fill="url(#clockGradient)"
//               stroke="#e5e7eb"
//               strokeWidth="2"
//             />
            
//             {/* Hour markers */}
//             {[...Array(12)].map((_, i) => {
//               const angle = (i * 30) - 90;
//               const x1 = 96 + 75 * Math.cos(angle * Math.PI / 180);
//               const y1 = 96 + 75 * Math.sin(angle * Math.PI / 180);
//               const x2 = 96 + 85 * Math.cos(angle * Math.PI / 180);
//               const y2 = 96 + 85 * Math.sin(angle * Math.PI / 180);
              
//               return (
//                 <line
//                   key={i}
//                   x1={x1}
//                   y1={y1}
//                   x2={x2}
//                   y2={y2}
//                   stroke="#9ca3af"
//                   strokeWidth="2"
//                 />
//               );
//             })}
            
//             {/* Minute hand */}
//             <line
//               x1="96"
//               y1="96"
//               x2={96 + 70 * Math.cos(minuteAngle * Math.PI / 180)}
//               y2={96 + 70 * Math.sin(minuteAngle * Math.PI / 180)}
//               stroke="url(#handGradient)"
//               strokeWidth="4"
//               strokeLinecap="round"
//             />
            
//             {/* Center dot */}
//             <circle cx="96" cy="96" r="6" fill="#4f46e5" />
            
//             {/* Gradients */}
//             <defs>
//               <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                 <stop offset="0%" stopColor="#f8fafc" />
//                 <stop offset="100%" stopColor="#e2e8f0" />
//               </linearGradient>
//               <linearGradient id="handGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//                 <stop offset="0%" stopColor="#4f46e5" />
//                 <stop offset="100%" stopColor="#7c3aed" />
//               </linearGradient>
//             </defs>
//           </svg>
//         </div>
        
//         <div className="text-center mt-4">
//           <div className="text-2xl font-bold text-gray-800 mb-2">{selectedTime} min</div>
//           <button
//             onClick={() => onStart(selectedTime * 60)}
//             className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 font-medium shadow-lg"
//           >
//             Start Timer
//           </button>
//         </div>
//       </div>
//     );
//   };

//   useEffect(() => {
//     if (!id) {
//       console.error("No recipe ID provided in URL");
//       setError("No recipe ID provided");
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     console.log("Fetching recipe with ID:", id);

//     fetch(`/api/recipes/${id}`)
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error(`Server returned ${res.status}: ${res.statusText}`);
//         }
//         return res.json();
//       })
//       .then((data) => {
//         console.log("Fetched recipe data:", data);
//         if (!data) {
//           throw new Error("No recipe data returned");
//         }
//         actions.setCurrentRecipe(data);
//         actions.setCurrentStep(0);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error("Error fetching recipe:", error);
//         console.log("Using sample recipe data instead");
        
//         const sampleRecipe = getSampleRecipe(id);
//         actions.setCurrentRecipe(sampleRecipe);
//         actions.setCurrentStep(0);
        
//         setError("Using sample data: " + error.message);
//         setLoading(false);
//       });
//   }, [id]);

//  useEffect(() => {
//   if (timer > 0) {
//     intervalRef.current = setInterval(() => {
//       setTimer((prev) => {
//         if (prev === 1) {
//           actions.nextStep(); // Automatically go to next step
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   }

//   return () => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//   };
// }, [timer]);



//   useEffect(() => {
//   if (step?.instruction) {
//     speak(step.instruction);  // Narrate the step
//     if (step.duration && step.duration > 0) {
//       setTimer(step.duration);  // Start timer automatically
//     }
//   }
// }, [currentStep]);


//   useEffect(() => {
//     const command = processVoiceCommand(transcript);
//     if (!command || command.type === "UNKNOWN") return;

//     switch (command.type) {
//       case "NEXT_STEP":
//         actions.nextStep();
//         break;
//       case "PREVIOUS_STEP":
//         actions.prevStep();
//         break;
//       case "REPEAT_STEP":
//         speak(step.instruction); 
//         resetTranscript();
//         break;
//       case "TIMER":
//         const duration =
//           command.unit === "minutes" ? command.duration * 60 : command.duration;
//         setTimer(duration);
//         break;
//       default:
//         break;
//     }

//     resetTranscript();
//   }, [transcript]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 mx-auto mb-6">
//             <div className="w-full h-full border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
//           </div>
//           <p className="text-gray-600 text-lg">Loading your recipe...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center border border-gray-100">
//           <div className="text-red-500 text-6xl mb-6">⚠️</div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h2>
//           <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
//           <button 
//             onClick={() => navigate('/')}
//             className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 font-medium shadow-lg"
//           >
//             Back to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!currentRecipe || !currentRecipe.steps || currentRecipe.steps.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center border border-gray-100">
//           <div className="text-gray-400 text-6xl mb-6">🍳</div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Recipe Not Available</h2>
//           <p className="text-gray-600 mb-8 leading-relaxed">This recipe has no cooking steps available.</p>
//           <button 
//             onClick={() => navigate('/')}
//             className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 font-medium shadow-lg"
//           >
//             Back to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       {/* Floating Header */}
//       <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <button 
//                 onClick={() => navigate('/')}
//                 className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all transform hover:scale-105"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">{currentRecipe.title}</h1>
//                 <div className="flex items-center gap-6 text-sm text-gray-600 mt-1">
//                   <span className="flex items-center gap-1">
//                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
//                     </svg>
//                     {currentRecipe.prepTime + currentRecipe.cookTime} min
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                       <path d="M7 8a3 3 0 016 0v4a3 3 0 11-6 0V8zM5.5 6.5a6.5 6.5 0 1113 0v4a6.5 6.5 0 01-13 0v-4z" />
//                     </svg>
//                     {currentRecipe.servings} servings
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                     {currentRecipe.rating}/5
//                   </span>
//                 </div>
//               </div>
//             </div>
            
//             <button 
//               onClick={() => setShowIngredients(!showIngredients)}
//               className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 font-medium shadow-lg"
//             >
//               {showIngredients ? 'Hide' : 'Show'} Ingredients
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Floating Ingredients Panel */}
//         {showIngredients && (
//           <div className="mb-8 bg-white rounded-3xl shadow-xl p-8 border border-gray-100 backdrop-blur-lg">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
//               <span className="text-3xl">🥘</span>
//               Ingredients
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {currentRecipe.ingredients.map((item, idx) => (
//                 <div key={idx} className="flex items-center text-gray-700 py-3 px-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
//                   <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-4 flex-shrink-0"></div>
//                   <span className="text-sm font-medium">{item}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//           {/* Main Content - 2 columns */}
//           <div className="xl:col-span-2 space-y-8">
//             {/* Recipe Image */}
//             <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
//               <div className="relative">
//                 <img
//                   src={currentRecipe.image}
//                   alt={currentRecipe.title}
//                   className="w-full h-80 object-cover"
//                   onError={(e) => {
//                     e.target.onerror = null; 
//                     e.target.src = 'https://source.unsplash.com/800x600/?food';
//                   }}
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
//               </div>
//             </div>

//             {/* Current Step */}
//             <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
//               <div className="flex items-center justify-between mb-8">
//                 <h2 className="text-3xl font-bold text-gray-900">
//                   Step {currentStep + 1}
//                 </h2>
//                 <div className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-600">
//                   {currentStep + 1} of {currentRecipe.steps.length}
//                 </div>
//               </div>

//               {/* Circular Progress */}
//               <div className="flex justify-center mb-8">
//                 <div className="relative w-32 h-32">
//                   <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
//                     <circle
//                       cx="50"
//                       cy="50"
//                       r="40"
//                       stroke="#e5e7eb"
//                       strokeWidth="8"
//                       fill="none"
//                     />
//                     <circle
//                       cx="50"
//                       cy="50"
//                       r="40"
//                       stroke="url(#progressGradient)"
//                       strokeWidth="8"
//                       fill="none"
//                       strokeDasharray={`${2 * Math.PI * 40}`}
//                       strokeDashoffset={`${2 * Math.PI * 40 * (1 - (currentStep + 1) / currentRecipe.steps.length)}`}
//                       className="transition-all duration-500"
//                     />
//                     <defs>
//                       <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//                         <stop offset="0%" stopColor="#4f46e5" />
//                         <stop offset="100%" stopColor="#7c3aed" />
//                       </linearGradient>
//                     </defs>
//                   </svg>
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <span className="text-2xl font-bold text-gray-800">
//                       {Math.round(((currentStep + 1) / currentRecipe.steps.length) * 100)}%
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Step Instruction */}
//               <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 mb-8 border border-blue-100">
//                 <p className="text-xl text-gray-800 leading-relaxed text-center">
//                   {step.instruction}
//                 </p>
//               </div>

//               {/* Active Timer Display */}
//               {timer > 0 && (
//                 <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-3xl p-8 mb-8">
//                   <div className="text-center">
//                     <div className="text-6xl font-mono font-bold text-red-600 mb-4">
//                       {Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)}
//                     </div>
//                     <p className="text-red-500 text-lg font-medium">Timer Active</p>
//                     <div className="w-full bg-red-200 rounded-full h-2 mt-4">
//                       <div 
//                         className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-1000"
//                         style={{ width: `${100 - (timer / (step.duration || 60)) * 100}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Navigation */}
//               <div className="flex gap-4">
//                 <button 
//                   onClick={actions.prevStep} 
//                   disabled={currentStep === 0}
//                   className="flex-1 py-4 px-6 bg-gray-100 text-gray-700 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-all font-medium transform hover:scale-105 disabled:transform-none"
//                 >
//                   ← Previous Step
//                 </button>
//                 <button
//                   onClick={actions.nextStep}
//                   disabled={currentStep >= currentRecipe.steps.length - 1}
//                   className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-600 transition-all font-medium transform hover:scale-105 disabled:transform-none shadow-lg"
//                 >
//                   {currentStep >= currentRecipe.steps.length - 1 ? '🎉 Complete!' : 'Next Step →'}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Sidebar - 1 column */}
//           <div className="space-y-8">
//             {/* Voice Controls */}
//             <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
//               <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
//                 <span className="text-2xl">🎙️</span>
//                 Voice Controls
//               </h3>
              
//               <div className="space-y-4">
//                 <div className="flex gap-3">
//                   <button 
//                     onClick={startListening}
//                     disabled={isListening}
//                     className={`flex-1 py-4 rounded-2xl font-medium transition-all transform hover:scale-105 ${
//                       isListening 
//                         ? 'bg-red-100 text-red-600 cursor-not-allowed transform-none' 
//                         : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg'
//                     }`}
//                   >
//                     {isListening ? '🔴 Listening...' : '🎤 Start Voice'}
//                   </button>
//                   <button 
//                     onClick={stopListening}
//                     className="px-6 py-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all font-medium transform hover:scale-105 shadow-lg"
//                   >
//                     Stop
//                   </button>
//                 </div>

//                 {transcript && (
//                   <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
//                     <p className="text-blue-900 text-sm">
//                       <span className="font-bold">You said:</span> "{transcript}"
//                     </p>
//                   </div>
//                 )}
//               </div>

//               <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
//                 <p className="text-xs text-gray-600 font-bold mb-3">Available Commands:</p>
//                 <div className="text-xs text-gray-500 space-y-2">
//                   <div className="flex items-center gap-2">
//                     <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
//                     "Next step" - Move forward
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
//                     "Previous step" - Go back
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
//                     "Repeat" - Hear step again
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
//                     "Timer 5 minutes" - Set timer
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Analog Timer */}
//             <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
//               <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
//                 <span className="text-2xl">⏰</span>
//                 Timer
//               </h3>
              
//               <AnalogClock 
//                 selectedTime={selectedTime}
//                 onTimeChange={setSelectedTime}
//                 onStart={setTimer}
//               />

//               <div className="grid grid-cols-3 gap-3 mt-6">
//                 {[1, 5, 10, 15, 20, 30].map(time => (
//                   <button 
//                     key={time}
//                     onClick={() => setSelectedTime(time)}
//                     className={`py-3 rounded-2xl text-sm font-medium transition-all transform hover:scale-105 ${
//                       selectedTime === time 
//                         ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
//                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                     }`}
//                   >
//                     {time}m
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
//               <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
//                 <span className="text-2xl">⚡</span>
//                 Quick Actions
//               </h3>
              
//               <div className="space-y-3">
//                 <button 
//                   onClick={() => speak(step.instruction)}
//                   className="w-full py-4 bg-blue-50 text-blue-700 rounded-2xl hover:bg-blue-100 transition-all font-medium transform hover:scale-105 border border-blue-200"
//                 >
//                   🔊 Repeat Step
//                 </button>
//                 <button 
//                   onClick={() => setTimer(0)}
//                   className="w-full py-4 bg-gray-50 text-gray-700 rounded-2xl hover:bg-gray-100 transition-all font-medium transform hover:scale-105 border border-gray-200"
//                 >
//                   ⏹️ Stop Timer
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecipeView;