import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const TrueFocus = ({
  sentence = "True Focus",
  manualMode = false,
  blurAmount = 5,
  borderColor = "green",
  glowColor = "rgba(0, 255, 0, 0.6)",
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
}) => {
  const words = sentence.split(" ");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState(null);
  const containerRef = useRef(null);
  const wordRefs = useRef([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [hoverIndex, setHoverIndex] = useState(null);

  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
      }, (animationDuration + pauseBetweenAnimations) * 1000);

      return () => clearInterval(interval);
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return;
    if (!wordRefs.current[currentIndex] || !containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex].getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height,
    });
  }, [currentIndex, words.length]);

  const handleMouseEnter = (index) => {
    if (manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    if (manualMode) {
      setCurrentIndex(lastActiveIndex);
    }
    setHoverIndex(null);
  };

  // Add sparkle effects at random positions around the active word
  const Sparkles = ({ isActive }) => {
    if (!isActive) return null;
    
    return (
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white"
            initial={{ 
              opacity: 0, 
              scale: 0,
              x: Math.random() * 100 - 50 + focusRect.width/2, 
              y: Math.random() * 100 - 50 + focusRect.height/2 
            }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              delay: i * 0.2,
              repeatDelay: Math.random() * 2
            }}
            style={{ 
              background: `radial-gradient(circle at center, ${borderColor}, transparent)`,
              boxShadow: `0 0 8px ${glowColor}`
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className="relative flex flex-wrap gap-2 justify-center items-center"
      ref={containerRef}
    >
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        const isHovered = index === hoverIndex;
        
        return (
          <motion.span
            key={index}
            ref={(el) => (wordRefs.current[index] = el)}
            className="relative text-[2rem] sm:text-[2.5rem] font-black cursor-pointer leading-tight"
            style={{
              filter: manualMode
                ? isActive
                  ? `blur(0px)`
                  : `blur(${blurAmount * 0.7}px)`
                : isActive
                  ? `blur(0px)`
                  : `blur(${blurAmount * 0.7}px)`,
              color: isActive ? 'white' : 'rgba(255, 255, 255, 0.8)',
              textShadow: isActive ? `0 0 10px ${glowColor}` : 'none',
              "--border-color": borderColor,
              "--glow-color": glowColor,
              transition: `filter ${animationDuration}s ease, color ${animationDuration}s ease, text-shadow ${animationDuration}s ease`,
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.03 }}
            animate={{ 
              y: isActive ? [-3, 0, -3] : 0,
            }}
            transition={{
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            {word}
            {isActive && (
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r"
                style={{
                  backgroundImage: `linear-gradient(to right, transparent, ${borderColor}, transparent)`,
                }}
                layoutId="underline"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: 1 }}
                transition={{ duration: animationDuration * 0.8 }}
              />
            )}
          </motion.span>
        );
      })}

        <motion.div
          className="absolute top-0 left-0 pointer-events-none box-border border-0"
          animate={{
            x: focusRect.x,
            y: focusRect.y,
            width: focusRect.width,
            height: focusRect.height,
            opacity: currentIndex >= 0 ? 1 : 0,
          }}
          transition={{
            duration: animationDuration,
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
          style={{
            "--border-color": borderColor,
            "--glow-color": glowColor,
          }}
        >
          <Sparkles isActive={currentIndex >= 0} />
          
          <span
            className="absolute w-2 h-2 border-[2px] rounded-[2px] top-[-5px] left-[-5px] border-r-0 border-b-0"
            style={{
              borderColor: "var(--border-color)",
              filter: "drop-shadow(0 0 4px var(--border-color))",
            }}
          ></span>
          <span
            className="absolute w-2 h-2 border-[2px] rounded-[2px] top-[-5px] right-[-5px] border-l-0 border-b-0"
            style={{
              borderColor: "var(--border-color)",
              filter: "drop-shadow(0 0 4px var(--border-color))",
            }}
          ></span>
          <span
            className="absolute w-2 h-2 border-[2px] rounded-[2px] bottom-[-5px] left-[-5px] border-r-0 border-t-0"
            style={{
              borderColor: "var(--border-color)",
              filter: "drop-shadow(0 0 4px var(--border-color))",
            }}
          ></span>
          <span
            className="absolute w-2 h-2 border-[2px] rounded-[2px] bottom-[-5px] right-[-5px] border-l-0 border-t-0"
            style={{
              borderColor: "var(--border-color)",
              filter: "drop-shadow(0 0 4px var(--border-color))",
            }}
          ></span>
        </motion.div>
    </div>
  );
};

export default TrueFocus;
