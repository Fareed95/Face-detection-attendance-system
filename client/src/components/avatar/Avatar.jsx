'use client';
import { useUserContext } from '@/app/context/Userinfo';
import { useState, useEffect, useRef } from 'react';

const HeroBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-neutral-950" />
    <div className="absolute inset-0 bg-grid-small-white/[0.05] -z-10" />
    <div className="absolute inset-0 bg-dot-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
    <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent" />
  </div>
);

const Avatar = () => {
  const { setcontextInterview,contextInterview,contextsetSpeaking,isSpeaking,setIsSpeaking} = useUserContext(); // Updated hook
  const [isExpanded, setIsExpanded] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const videoRef = useRef(null);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const timeoutRef = useRef(null);
  const interimTranscriptRef = useRef('');
  const [recognition, setRecognition] = useState(null);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    // Get available voices and select a default female voice
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      // Try to find a female English voice
      const maleVoice = voices.find(voice =>
        voice.lang.startsWith('en') &&
        (voice.name.includes('male') || voice.name.includes('Male') || voice.name.includes('Ava'))
      );
      setSelectedVoice(maleVoice || voices[0]);
    };

    // Set voice when voices are loaded
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = setVoice;
    }
    setVoice();
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports the Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition is not supported in this browser');
      return;
    }

    // Create the recognition object
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    // Configure the recognition
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';
    
    // Set up event handlers
    recognitionInstance.onresult = (event) => {
      clearTimeout(timeoutRef.current);
      
      let finalTranscript = '';
      let interimTranscript = '';
      
      // Process the results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptText = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcriptText;
          console.log('Final speech (sentence complete):', transcriptText);
          setTranscript(transcriptText);
          // Trigger the avatar response when we have final transcript
          handleUserInput(transcriptText);
        } else {
          interimTranscript += transcriptText;
        }
      }
      
      // Save the interim transcript to check for pauses
      if (interimTranscript) {
        interimTranscriptRef.current = interimTranscript;
        
        // Set a timeout to detect pauses
        timeoutRef.current = setTimeout(() => {
          console.log('Final speech (after 2-second pause):', interimTranscriptRef.current);
          setTranscript(interimTranscriptRef.current);
          handleUserInput(interimTranscriptRef.current);
          interimTranscriptRef.current = '';
        }, 2000);
      }
    };
    
    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    
    recognitionInstance.onend = () => {
      if (isListening) {
        recognitionInstance.start();
      }
    };
    
    setRecognition(recognitionInstance);
    
    // Cleanup
    return () => {
      if (recognition) {
        recognition.stop();
      }
      clearTimeout(timeoutRef.current);
    };
  }, [isListening]);



  const speak = (text) => {
    if (!selectedVoice) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Break the text into smaller chunks (around 150 characters each)
    const chunks = text.match(/.{1,150}(?:\s|$)/g) || [];
    let currentChunk = 0;
    let isLastChunk = false;

    const stopVideo = () => {
      setIsSpeaking(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        videoRef.current.loop = false;
      }
    };

    const speakChunk = () => {
      if (currentChunk < chunks.length) {
        const utterance = new SpeechSynthesisUtterance(chunks[currentChunk]);
        utterance.voice = selectedVoice;
        utterance.rate = speechRate;
        utterance.pitch = speechPitch;
        utterance.volume = isMuted ? 0 : volume;

        // Check if this is the last chunk
        isLastChunk = currentChunk === chunks.length - 1;

        // Start or ensure video is playing
        if (currentChunk === 0) {
          setIsSpeaking(true);
        }
        
        if (videoRef.current) {
          // Ensure video keeps playing and loops
          videoRef.current.loop = true;
          const playVideo = () => {
            if (videoRef.current && videoRef.current.paused) {
              videoRef.current.play().catch(console.error);
            }
          };
          playVideo();
          
          // Keep checking if video is playing during speech
          const videoCheckInterval = setInterval(playVideo, 100);
          
          utterance.onend = () => {
            clearInterval(videoCheckInterval);
            currentChunk++;
            
            if (currentChunk < chunks.length) {
              speakChunk(); // Speak next chunk
            } else {
              // Ensure video stops after a small delay to prevent any lingering speech
              setTimeout(stopVideo, 100);
            }
          };

          utterance.onerror = (err) => {
            console.error('Speech error:', err);
            clearInterval(videoCheckInterval);
            stopVideo();
          };
        }

        window.speechSynthesis.speak(utterance);
      }
    };

    // Start speaking the first chunk
    speakChunk();

    // Safety timeout to stop video if speech somehow doesn't trigger onend
    const maxSpeechTime = chunks.length * 10000; // 10 seconds per chunk maximum
    const safetyTimeout = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        stopVideo();
      }
    }, maxSpeechTime);

    // Cleanup safety timeout when component unmounts or new speech starts
    return () => clearTimeout(safetyTimeout);
  };

  // Handle user input (both voice and text)
  const handleUserInput = async (text) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { type: 'user', content: text }]);

    // Mock response with a single test message


    // Simulate API response delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    setResponse(contextInterview);
    setMessages(prev => [...prev, { type: 'ai', content: contextInterview }]);

    // Speak the response
    speak(contextInterview);
    setIsLoading(false);
  };

  // Update the toggleListening function
  const toggleListening = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      clearTimeout(timeoutRef.current);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };
  useEffect(()=>{
    console.log("Hello",contextInterview)
    handleUserInput("Hello, how can I help you?")
  },[contextInterview])
  return (
    <div className="w-full h-full relative">
      {/* Background with reduced opacity */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-neutral-950/50" />
        <div className="absolute inset-0 bg-grid-small-white/[0.02] -z-10" />
        <div className="absolute inset-0 bg-dot-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
      </div>

      {/* Avatar Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-full h-full relative overflow-hidden rounded-xl">
          {/* Video Element */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src="/seniorhr.mp4"
            playsInline
            muted={isMuted}
            loop={isSpeaking}
            style={{ objectPosition: '50% 20%' }}
          >
            
          </video>

          {/* Speaking Indicator */}
          {isSpeaking && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse delay-75" />
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse delay-150" />
              </div>
            </div>
          )}

          {/* Add the caption box below the video */}
          {/* <div className="absolute bottom-0 left-0 right-0 h-32 bg-black/30 rounded-xl border border-neutral-800/50 backdrop-blur-sm p-4">
            <div className="h-full flex flex-col">
              <div className="flex-1 text-neutral-400 text-sm">
                {transcript || "Your speech will appear here..."}
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-neutral-800/50">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-neutral-600'}`}></div>
                  <span className="text-xs text-neutral-500">{isListening ? 'Listening...' : 'Click to start'}</span>
                </div>
                <button
                  onClick={toggleListening}
                  className={`px-3 py-1 rounded-lg text-xs ${
                    isListening 
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                      : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                  }`}
                >
                  {isListening ? 'Stop' : 'Start'} Listening
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      
     
    </div>
  );
};

export default Avatar; 