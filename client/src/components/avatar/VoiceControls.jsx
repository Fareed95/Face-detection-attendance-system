'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const VoiceControls = ({
  onSpeechStart,
  onSpeechEnd,
  onTextInput,
  isListening,
  currentLanguage,
  disabled
}) => {
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    // Initialize Web Speech API
    if (typeof window !== 'undefined') {
      // Speech Recognition setup
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = currentLanguage;

        recognitionRef.current.onstart = () => {
          onSpeechStart?.();
        };

        recognitionRef.current.onend = () => {
          onSpeechEnd?.();
        };

        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');

          setText(transcript);
          if (event.results[0].isFinal) {
            onTextInput?.(transcript);
            setText('');
          }
        };
      }

      // Speech Synthesis setup
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [currentLanguage]);

  const startListening = () => {
    if (recognitionRef.current && !disabled) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const speak = (text) => {
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onTextInput?.(text.trim());
      setText('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message or click the microphone to speak..."
            className="w-full h-24 px-4 py-3 bg-black/20 backdrop-blur-md border border-electric-blue/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-electric-blue resize-none"
            disabled={disabled || isListening}
          />
          
          <motion.button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`absolute right-4 bottom-4 p-2 rounded-full ${
              isListening ? 'bg-red-500' : 'bg-blue-500'
            } hover:opacity-80 transition-opacity disabled:opacity-50`}
            disabled={disabled}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isListening ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              )}
            </svg>
          </motion.button>
        </div>

        <motion.button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          disabled={disabled || !text.trim() || isListening}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Send Message
        </motion.button>
      </form>

      {isSpeaking && (
        <div className="mt-4 flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75" />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150" />
        </div>
      )}
    </div>
  );
};

export default VoiceControls;