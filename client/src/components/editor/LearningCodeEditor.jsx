"use client"
import { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { Code, Play, X, Sparkles, Settings, Maximize, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CODE_SNIPPETS } from "@/constants/constants";
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";

const LearningCodeEditor = ({ isOpen, onClose, editorRef }) => {
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [showOutput, setShowOutput] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const onMount = (editor) => {
    if (editorRef) {
      editorRef.current = editor;
    }
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  // Initialize with default code
  useEffect(() => {
    setValue(CODE_SNIPPETS[language]);
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <motion.div 
      className={`h-full flex flex-col bg-gradient-to-b from-neutral-900 via-black to-neutral-950 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top decorative element */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600"></div>
      
      {/* Header with tabs - Enhanced with glass morphism and better styling */}
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 border-b border-neutral-800/70 gap-1.5 sm:gap-0 mt-16 z-10 backdrop-blur-lg bg-neutral-900/50">
        <div className="flex items-center space-x-1.5 sm:space-x-2 w-full sm:w-auto">
          <motion.button
            onClick={() => setShowOutput(false)}
            className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1 rounded-lg transition-all text-xs sm:text-sm font-medium ${
              !showOutput 
                ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 border border-purple-500/30 shadow-sm shadow-purple-950/30' 
                : 'text-neutral-400 hover:bg-neutral-800/80 hover:text-neutral-300 border border-transparent'
            }`}
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
          >
            <Code className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Editor</span>
          </motion.button>
          <motion.button
            onClick={() => setShowOutput(true)}
            className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1 rounded-lg transition-all text-xs sm:text-sm font-medium ${
              showOutput 
                ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-300 border border-blue-500/30 shadow-sm shadow-blue-950/30' 
                : 'text-neutral-400 hover:bg-neutral-800/80 hover:text-neutral-300 border border-transparent'
            }`}
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
          >
            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Output</span>
          </motion.button>
        </div>
        
        <div className="flex items-center space-x-1.5 sm:space-x-2 w-full sm:w-auto justify-between sm:justify-end">
          <LanguageSelector language={language} onSelect={onSelect} />
          
          <motion.button
            onClick={toggleFullscreen}
            className="p-1.5 sm:p-2 text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800/80 rounded-lg transition-all border border-transparent hover:border-neutral-700/70"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Toggle fullscreen"
          >
            <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </motion.button>
          
          <motion.button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-neutral-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-all border border-transparent hover:border-red-900/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Close editor"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </motion.button>
        </div>
      </div>

      {/* Content area - Improved with better shadows and animations */}
      <div className="flex-1 overflow-hidden relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 left-20 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <motion.div
          initial={false}
          animate={{ 
            x: showOutput ? (isMobile ? '0%' : '-50%') : '0%',
            y: showOutput ? (isMobile ? '-50%' : '0%') : '0%'
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full sm:w-[200%] h-full flex flex-col sm:flex-row"
        >
          {/* Editor Panel - Enhanced with shadows and border effects */}
          <div className="w-full sm:w-1/2 h-1/2 sm:h-full p-2 sm:p-4">
            <div className="h-full border border-neutral-700/80 bg-black/50 rounded-xl overflow-hidden shadow-lg shadow-black/20 backdrop-blur-sm">
              <Editor
                height="100%"
                theme="vs-dark"
                language={language}
                value={value}
                onChange={(value) => setValue(value)}
                onMount={onMount}
                options={{
                  fontSize: isMobile ? 12 : 14,
                  minimap: { enabled: true, side: 'right', showSlider: 'always' },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  lineNumbers: "on",
                  roundedSelection: false,
                  padding: { top: 16, bottom: 16 },
                  cursorStyle: "line",
                  tabSize: 2,
                  wordWrap: "on",
                  formatOnPaste: true,
                  formatOnType: true,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontLigatures: true,
                }}
                className="rounded-xl"
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="w-full sm:w-1/2 h-1/2 sm:h-full p-2 sm:p-4">
            <Output 
              editorRef={editorRef}
              language={language}
              value={value}
              hideSubmit={true}
              onRun={() => setShowOutput(true)}
              className="h-full"
            />
          </div>
        </motion.div>
      </div>

      {/* Run button - Enhanced with gradients and animations */}
      <div className="p-2 sm:p-3 border-t border-neutral-800/70 bg-neutral-900/50 backdrop-blur-sm">
        <motion.button
          onClick={() => {
            const outputComponent = document.querySelector('[data-run-button]');
            if (outputComponent) {
              outputComponent.click();
            }
            setShowOutput(true);
          }}
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ y: 0, scale: 0.98 }}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg transition-all duration-200 shadow-lg shadow-purple-950/30 text-sm font-medium"
        >
          <Play className="w-4 h-4" />
          <span>Run Code</span>
          <span className="hidden sm:inline text-xs opacity-70 bg-white/10 px-1.5 py-0.5 rounded ml-2">⌘R</span>
          
          {/* Subtle sparkle effect */}
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0"
            animate={{ 
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="w-6 h-6 text-white/30" />
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default LearningCodeEditor; 