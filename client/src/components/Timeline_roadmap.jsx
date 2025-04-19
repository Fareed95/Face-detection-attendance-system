"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRoadmap } from '@/app/context/RoadmapContext';
import { motion, useScroll, useInView } from "framer-motion";
import { Star } from 'lucide-react';

const RoadmapNode = ({ title, content, index, isActive, progress, isLocked }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Dynamic color based on active/locked state
  const getBgColor = () => {
    if (isLocked) return 'from-neutral-900/40 to-neutral-900/40';
    if (isActive) return 'from-indigo-900/30 to-violet-900/20';
    return 'from-indigo-800/20 to-purple-800/10';
  };

  const getBorderColor = () => {
    if (isLocked) return 'border-neutral-800/30';
    if (isActive) return 'border-indigo-500/30';
    return 'border-indigo-800/20';
  };

  // More subtle node indicator
  const getNodeColor = () => {
    if (isLocked) return 'bg-neutral-700/50';
    if (isActive) return 'bg-indigo-400';
    return 'bg-indigo-600/80';
  };

  const getConnectorOpacity = () => {
    return isLocked ? '30%' : '75%';
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative"
    >
      {/* Node connector - more elegant with gradient */}
      <div className="absolute left-[10px] sm:left-[15px] top-0 bottom-0 w-[2px]" style={{ opacity: getConnectorOpacity() }}>
        <div className="w-full h-full bg-gradient-to-b from-indigo-950/30 via-indigo-800/20 to-violet-950/30" />
        <motion.div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-indigo-500/60 via-indigo-400/60 to-violet-500/60"
          initial={{ height: 0 }}
          animate={{ height: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      {/* Node circle with subtle animation */}
      <div 
        className={`absolute left-0 top-0 w-[24px] h-[24px] sm:w-[32px] sm:h-[32px] rounded-full flex items-center justify-center
                     border ${getBorderColor()} bg-gradient-to-br ${getBgColor()} z-10
                    ${isLocked ? '' : 'shadow-lg shadow-indigo-900/20'}`}
      >
        <motion.div 
          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${getNodeColor()}`}
          animate={isActive ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
      </div>

      {/* Content Card */}
      <div className={`ml-[35px] sm:ml-[50px] mb-8 sm:mb-12 ${isLocked ? 'opacity-70' : 'opacity-100'}`}>
        <motion.div
          className={`relative p-4 sm:p-6 rounded-xl border ${getBorderColor()} 
                     bg-gradient-to-br ${getBgColor()} backdrop-blur-sm
                     ${isLocked ? '' : 'shadow-xl shadow-indigo-950/5'}`}
          initial={{ x: -20, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ delay: index * 0.15 + 0.2, duration: 0.5 }}
        >
          {/* Subtle decorative element in background */}
          {!isLocked && (
            <div className="absolute top-0 right-0 w-16 sm:w-24 h-16 sm:h-24 opacity-[0.03] rounded-bl-full bg-gradient-to-br from-indigo-500 to-violet-500 -z-1" />
          )}

          <div className="space-y-3 sm:space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] sm:text-xs text-indigo-300/70 font-medium mb-1 block font-sans">Step {index + 1}</span>
                <h3 className={`text-lg sm:text-xl font-semibold ${isLocked ? 'text-neutral-400' : 'text-white'} font-heading`}>
                  {title}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className={`text-sm sm:text-base leading-relaxed ${isLocked ? 'text-neutral-500' : 'text-neutral-300'} font-sans`}>
              {content.content}
            </p>

            {/* Skills */}
            {content.skills && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2">
                {content.skills.map((skill, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.07 + 0.5 }}
                    className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded-full border ${isLocked ? 'border-neutral-800/50 text-neutral-500' : 'border-indigo-800/30 text-indigo-300'}
                               flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-indigo-950/30 to-black/50 backdrop-blur-sm font-sans`}
                  >
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-70" />
                    {skill}
                  </motion.span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

function Timeline_roadmap_function({ roadmapData }) {
  const router = useRouter();
  const { setRoadmap } = useRoadmap();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ 
    target: containerRef,
    offset: ["start center", "end center"]
  });
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(v => {
      const index = Math.floor(v * roadmapData.roadmap.length);
      setActiveNodeIndex(index);
    });
    return () => unsubscribe();
  }, [scrollYProgress, roadmapData.roadmap.length]);

  if (!roadmapData) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="border border-neutral-800 p-6 sm:p-8 rounded-xl bg-black/50 backdrop-blur-sm">
          <p className="text-base sm:text-lg text-neutral-400 font-sans">
            No roadmap data available. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const handleButtonClick = () => {
    setRoadmap({
      roadmap_id: roadmapData.roadmap_id,
      total_components: roadmapData.total_components,
      first_component: roadmapData.first_component
    });
    router.push('/Learning');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative pt-8 sm:pt-12 pb-4 sm:pb-6 px-4"
      >
        <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-indigo-950/30 border border-indigo-800/20 mb-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-indigo-400 mr-1.5 sm:mr-2 animate-pulse" />
            <span className="text-xs sm:text-sm text-indigo-300/80 font-sans">Learning Path</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300 font-heading">
            Your Learning Journey
          </h1>
          
          <p className="text-base sm:text-lg text-indigo-200/60 max-w-xl mx-auto font-sans">
            Track your progress through {roadmapData.total_components} milestones to master your skills
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-indigo-600/10 blur-xl" />
        <div className="absolute bottom-0 right-1/4 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-purple-600/10 blur-xl" />
      </motion.div>

      {/* Roadmap Section */}
      <div 
        ref={containerRef}
        className="relative max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-10 backdrop-blur-sm"
      >
        {roadmapData.roadmap.map((component, index) => (
          <RoadmapNode
            key={index}
            title={component.name}
            content={{
              content: component.description,
              skills: component.skills
            }}
            index={index}
            isActive={index === activeNodeIndex}
            progress={index < activeNodeIndex ? 100 : index === activeNodeIndex ? 50 : 0}
            isLocked={index > activeNodeIndex + 1}
          />
        ))}
      </div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="sticky bottom-4 sm:bottom-6 px-4"
      >
        <div className="max-w-xl mx-auto">
          <button
            onClick={handleButtonClick}
            className="w-full group relative overflow-hidden text-white rounded-xl py-3 sm:py-4 font-medium transition-all duration-300 transform active:scale-[0.98] font-sans text-sm sm:text-base"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 group-hover:from-indigo-500 group-hover:to-violet-500 transition-colors duration-300" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 group-hover:animate-shimmer transition-opacity" />
            <div className="relative flex items-center justify-center gap-1.5 sm:gap-2">
              <span className="text-white/90 group-hover:text-white">Begin Your Journey</span>
              <motion.div 
                animate={{ x: [0, 5, 0] }} 
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="opacity-70 group-hover:opacity-100"
              >
                →
              </motion.div>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Timeline_roadmap_function;