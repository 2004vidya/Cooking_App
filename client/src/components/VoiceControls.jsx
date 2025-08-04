
import React from 'react';
import { Mic, MicOff, Play, Pause } from 'lucide-react';
import { useRecipe } from '../contexts/RecipeContext';
import  useVoiceRecognition  from '../hooks/useVoiceRecognition';
import { useEffect } from 'react';

const VoiceControls = () => {
  const { 
    currentRecipe, 
    currentStep, 
    isListening, 
    voiceCommand, 
    isPlaying,
    actions 
  } = useRecipe();

  const {transcript, processVoiceCommand, resetTranscript} = useVoiceRecognition();

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  

useEffect(() => {
  if (!transcript) return;

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
      actions.repeatStep(); // make sure this exists in your context
      break;
    case "TIMER":
      const duration = command.unit === "minutes" ? command.duration * 60 : command.duration;
      actions.setTimer(duration); // this should also be added to your context
      break;
    default:
      break;
  }

  resetTranscript(); // clear for next command
}, [transcript]);


  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white/90 backdrop-blur-xl rounded-full p-4 shadow-2xl border border-white/20">
        <div className="flex items-center gap-4">
          <button
            onClick={handleVoiceToggle}
            className={`p-4 rounded-full transition-all duration-300 ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
            }`}
            title={isListening ? 'Stop listening' : 'Start voice command'}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          
          {voiceCommand && (
            <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              "{voiceCommand}"
            </div>
          )}
          
          {currentRecipe && (
            <div className="flex items-center gap-2">
              <button
                onClick={actions.prevStep}
                disabled={currentStep === 0}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Previous step"
              >
                ←
              </button>
              <button
                onClick={() => actions.setPlaying(!isPlaying)}
                className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-all"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={actions.nextStep}
                disabled={currentStep === currentRecipe.steps.length - 1}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Next step"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceControls;