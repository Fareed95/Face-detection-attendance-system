"use client"
import { useState, useRef, useEffect } from "react";
import { LANGUAGE_VERSIONS } from "@/constants/constants";
import { ChevronDown, Code, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languages = Object.entries(LANGUAGE_VERSIONS);

// Language icons mapping
const getLanguageIcon = (language) => {
  // Language-specific icons (you can expand this list)
  const languageIcons = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    java: "java",
    c: "c",
    "c++": "cpp",
    "c#": "cs",
    ruby: "rb",
    go: "go",
    rust: "rs",
    php: "php",
  };
  
  const icon = languageIcons[language.toLowerCase()];
  if (icon) {
    return (
      <div className="flex items-center justify-center w-4 h-4 text-xs font-bold">
        {icon}
      </div>
    );
  }
  
  return <Code className="w-3.5 h-3.5" />;
};

const LanguageSelector = ({ language, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-neutral-900/90 to-neutral-800/90 hover:from-neutral-800/90 hover:to-neutral-700/90 text-neutral-200 rounded-lg flex items-center justify-between text-sm w-32 sm:w-40 border border-neutral-700/70 shadow-sm shadow-black/20 font-medium transition-all duration-200"
        whileHover={{ y: -1 }}
        whileTap={{ y: 0 }}
      >
        <div className="flex items-center truncate gap-1.5">
          <div className="bg-neutral-700/50 p-1 rounded text-blue-400">
            {getLanguageIcon(language)}
          </div>
          <span className="truncate">{language}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 mt-1 w-48 bg-neutral-900/95 backdrop-blur-lg border border-neutral-700/70 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#4B5563 #1F2937'
            }}
          >
            <div className="p-1.5">
              <div className="border-b border-neutral-800 pb-1.5 px-2 mb-1.5 flex items-center text-xs font-medium text-neutral-400">
                <Languages className="w-3 h-3 mr-1.5" />
                <span>Select Language</span>
              </div>
              
              {languages.map(([lang, version]) => (
                <motion.button
                  key={lang}
                  className={`w-full rounded-md px-2.5 py-1.5 text-left hover:bg-neutral-800/80 transition-all text-sm flex items-center gap-2 ${
                    lang === language 
                      ? 'bg-blue-900/30 text-blue-300 border-l-2 border-blue-500' 
                      : 'text-neutral-300 border-l-2 border-transparent'
                  }`}
                  onClick={() => {
                    onSelect(lang);
                    setIsOpen(false);
                  }}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`p-1 rounded flex items-center justify-center ${
                    lang === language ? 'bg-blue-800/30 text-blue-400' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {getLanguageIcon(lang)}
                  </div>
                  
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="truncate font-medium">{lang}</span>
                    <span className="text-xs text-neutral-500">{version}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
