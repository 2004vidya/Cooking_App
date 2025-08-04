import { useState, useEffect, useRef } from 'react';

const useVoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const resetTranscript = () => {
    setTranscript('');
  };

  // Voice command processing
  const processVoiceCommand = (command) => {
  const lowerCommand = command.toLowerCase().trim();

  // --- Handle timer ---
  if (lowerCommand.includes('start timer') || lowerCommand.includes('set timer')) {
    const timeMatch = lowerCommand.match(/(\d+)\s*(minute|minutes|min|second|seconds|sec)/i);
    if (timeMatch) {
      return {
        type: 'TIMER',
        duration: parseInt(timeMatch[1]),
        unit: timeMatch[2].toLowerCase().startsWith('min') ? 'minutes' : 'seconds'
      };
    }
  }

  // --- Navigation commands ---
  if (/next step|continue/i.test(lowerCommand)) return { type: 'NEXT_STEP' };
  if (/previous step|go back/i.test(lowerCommand)) return { type: 'PREVIOUS_STEP' };
  if (/repeat|say again/i.test(lowerCommand)) return { type: 'REPEAT_STEP' };
  if (/ingredients|what do i need/i.test(lowerCommand)) return { type: 'SHOW_INGREDIENTS' };

  // --- Favorite commands ---
  if (/add to favorites|favorite this/i.test(lowerCommand)) return { type: 'ADD_TO_FAVORITES' };
  if (/remove from favorites|unfavorite/i.test(lowerCommand)) return { type: 'REMOVE_FROM_FAVORITES' };

  // --- Search commands (more natural) ---
  const searchPhrases = [
    'search for', 'find recipe for', 'find', 'how to cook', 'how do i cook',
    'how to make', 'show me how to make', 'show me', 'recipe for', 'cook'
  ];

  for (let phrase of searchPhrases) {
    if (lowerCommand.startsWith(phrase)) {
      const query = lowerCommand.replace(phrase, '').trim();
      if (query.length > 0) {
        return { type: 'SEARCH', query };
      }
    }
  }

  // --- Fallback ---
  return { type: 'UNKNOWN', command: lowerCommand };
};

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    processVoiceCommand
  };
};

export default useVoiceRecognition;