import { useRef } from 'react';

const useSpeechSynthesis = () => {
  const synthRef = useRef(window.speechSynthesis);

  const speak = (text) => {
    if (!synthRef.current) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1; // You can slow down with 0.9 or speed up with 1.2

    synthRef.current.cancel(); // Stop any current speech
    synthRef.current.speak(utterance);
  };

  const cancel = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  return { speak, cancel };
};

export default useSpeechSynthesis;
