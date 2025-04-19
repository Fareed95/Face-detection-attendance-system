'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const InfiniteMovingText = ({
  items = ["Nitin", "Rehbar", "Fareed"],
  direction = "left",
  speed = "fast",
  className = "",
}) => {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
  }, []);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      // Clone more times for ultra-smooth scrolling
      for (let i = 0; i < 5; i++) {
        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          scrollerRef.current.appendChild(duplicatedItem);
        });
      }
      setStart(true);
    }
  }

  const speedValue = {
    fast: 5, // Even faster speed
    normal: 10,
    slow: 15,
  };

  const textItems = items.map((item, idx) => (
    <motion.div
      key={idx}
      className="group relative px-8 py-4 mx-6"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="relative z-10">
        <span className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
          {item}
        </span>
      </div>
      <div className="absolute inset-0 border-[1px] border-white/10 rounded-lg group-hover:border-white/30 group-hover:bg-white/5 transition-all duration-300" />
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0" />
      </motion.div>
    </motion.div>
  ));

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden py-10 ${className}`}
    >
      <motion.div
        ref={scrollerRef}
        className="flex whitespace-nowrap"
        animate={start ? {
          x: direction === "left" 
            ? [0, -50 * items.length * 25] 
            : [50 * items.length * 25, 0],
        } : {}}
        transition={{
          duration: speedValue[speed] * items.length,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {textItems}
      </motion.div>
    </div>
  );
};

// Example usage:
// <InfiniteMovingText 
//   items={["Nitin", "Rehbar", "Fareed"]} 
//   direction="left" 
//   speed="fast" 
//   className="my-8"
// /> 