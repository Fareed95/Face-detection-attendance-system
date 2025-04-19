"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useRoadmap } from '@/app/context/RoadmapContext';
import { useUserContext } from '@/app/context/Userinfo';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import Masonry from 'react-masonry-css';
import { ChevronRight, BarChart, FileText, BookOpen, Brain, ArrowRight, Layers, FolderSymlink, Rocket, ArrowDown } from 'lucide-react';

// Enhanced floating particles background
const HeroBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-neutral-950/90" />
    <div className="absolute inset-0 bg-grid-small-white/[0.03] -z-10" />
    <div className="absolute inset-0 bg-dot-white/[0.03] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
    <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent" />
    <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] animate-pulse" />
    <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] animate-pulse" />
  </div>
);

// Move the getProgressGradient function outside of CardWithGradientBorder
// so it can be used anywhere in the component
const getProgressGradient = (progress) => {
  if (progress < 30) {
    return 'from-blue-500 to-purple-500'; 
  } else {
    return 'from-fuchsia-500 to-pink-500';
  }
};

const CardWithGradientBorder = ({ children, onClick, progress }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  

  const transformStyle = useTransform(
    [rotateX, rotateY],
    // Enhanced 3D effect that's more subtle
    ([latestRotateX, latestRotateY]) => `perspective(1000px) rotateX(${latestRotateX * 0.5}deg) rotateY(${latestRotateY * 0.5}deg)`
  );

  const updateMousePosition = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    
    // Set mouse position for gradient effect
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    
    // Calculate rotations for subtle 3D card tilt effect
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Limit the rotation to a small amount
    const rotationIntensity = 1.5; // Reduced intensity
    rotateX.set((centerY - mouseY) / centerY * rotationIntensity);
    rotateY.set((mouseX - centerX) / centerX * rotationIntensity);
  };
  
  const resetCardRotation = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={updateMousePosition}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        resetCardRotation();
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ transform: transformStyle }}
      className="group relative rounded-xl cursor-pointer transition-all duration-500"
      onClick={onClick}
    >
      {/* Animated gradient border */}
      <motion.div 
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
      />
      
      {/* Content area with glass effect */}
      <div className="relative bg-neutral-900/80 backdrop-blur-xl border border-white/10 p-5 sm:p-6 rounded-xl z-10 transition-all duration-300 group-hover:border-white/20">
        {children}
      </div>
    </motion.div>
  );
};

function PrevCources() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCourses, setVisibleCourses] = useState(6); // Show 6 courses initially
  const router = useRouter();
  const { setRoadmap } = useRoadmap();
  const { contextemail } = useUserContext();

  const MODEL_API_SERVER = process.env.NEXT_PUBLIC_MODEL_API_SERVER;

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${MODEL_API_SERVER}/user-roadmaps`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: contextemail,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch roadmaps');
        }

        const data = await response.json();
        setRoadmaps(data);

        setError(null);
      } catch (err) {
        console.error('Error fetching roadmaps:', err);
        setError('Failed to load roadmaps');
      } finally {
        setLoading(false);
      }
    };

    if (contextemail) {
      fetchRoadmaps();
    }
  }, [contextemail]);

  const handleCardClick = async(roadmap) => {
    setRoadmap({ roadmap_id: roadmap.id });
    router.push('/LearningPrev');
  };

  // Add function to handle loading more courses
  const handleLoadMore = () => {
    setVisibleCourses(prev => prev + 6); // Load 6 more courses when clicked
  };

  // Enhanced loading state with animation
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div 
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 blur-sm opacity-50" />
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-transparent border-t-white border-b-blue-500" />
      </motion.div>
    </div>
  );

  // Enhanced error state with styling
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 max-w-md text-center"
      >
        <p className="font-semibold mb-2">Error Loading Roadmaps</p>
        <p className="text-sm opacity-80">{error}</p>
      </motion.div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 bg-white/10 rounded-lg border border-white/10 text-white hover:bg-white/20 transition-all text-sm"
        onClick={() => window.location.reload()}
      >
        Try Again
      </motion.button>
    </div>
  );

  // Updated breakpoint columns for better responsiveness
  const breakpointColumnsObj = {
    default: 3,
    1280: 2,
    900: 2,
    680: 1
  };

  // Map component icons to different learning areas
  const getComponentIcon = (componentName) => {
    const name = componentName?.toLowerCase() || '';
    if (name.includes('basics') || name.includes('foundation')) return <BookOpen size={16} className="text-blue-400" />;
    if (name.includes('advanced') || name.includes('expert')) return <Brain size={16} className="text-purple-400" />;
    if (name.includes('project') || name.includes('build')) return <FolderSymlink size={16} className="text-teal-400" />;
    if (name.includes('theory') || name.includes('concept')) return <FileText size={16} className="text-orange-400" />;
    if (name.includes('practice') || name.includes('exercise')) return <Layers size={16} className="text-pink-400" />;
    return <BarChart size={16} className="text-emerald-400" />;
  };

  return (
    <div className="relative px-4 md:px-6 lg:px-8 py-8 md:py-12">
      <HeroBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-7xl mx-auto z-10"
      >
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center px-3 sm:px-4 py-1 rounded-full bg-white/5 border border-white/10 mb-3 sm:mb-4"
          >
            <div className="w-2 h-2 rounded-full bg-purple-400 mr-2 animate-pulse" />
            <span className="text-xs sm:text-sm text-neutral-300 font-sans">Your Learning Hub</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl sm:text-2xl md:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 space-y-4 font-heading"
          >
            Your Learning Journey
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto font-sans mt-2 sm:mt-3"
          >
            Continue where you left off or start something new to expand your knowledge
          </motion.p>
        </div>

        {roadmaps.length > 0 ? (
          <>
            {/* Roadmap Masonry Grid */}
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="flex w-auto -ml-3 sm:-ml-4 md:-ml-8"
              columnClassName="pl-3 sm:pl-4 md:pl-8 bg-clip-padding"
            >
              {/* Only map over visible roadmaps */}
              {roadmaps.slice(0, visibleCourses).map((roadmap, idx) => {
                // Calculate progress for visual indication
                const componentsCount = roadmap.roadmap_json?.roadmap_components?.length || 0;
                const progress = Math.min(componentsCount * 20, 100);
                
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="mb-3 sm:mb-4 md:mb-6 lg:mb-8" 
                    key={`roadmap-${roadmap.id}`}
                  >
                    <CardWithGradientBorder
                      onClick={() => handleCardClick(roadmap)}
                      progress={progress}
                    >
                      <GlowingEffect
                        spread={50}
                        glow={true}
                        disabled={false}
                        proximity={70}
                        inactiveZone={0.01}
                      />
                      <div className="space-y-4 sm:space-y-6 md:space-y-8">
                        {/* Card header with title and gradient line */}
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex justify-between items-start">
                            <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300 font-heading line-clamp-2">
                              {roadmap.name}
                            </h3>
                            
                            <div className="relative flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 group-hover:border-white/20 transition-all">
                              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </div>
                          
                          <div className="h-1 w-full bg-gradient-to-r from-violet-500/30 to-cyan-500/30 rounded-full overflow-hidden">
                            <motion.div 
                              className={`h-full bg-gradient-to-r ${getProgressGradient(progress)}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                            />
                          </div>
                        </div>

                      
                        {roadmap.roadmap_json?.roadmap_components?.length > 0 ? (
                          <div className="space-y-2 sm:space-y-3">
                            {roadmap.roadmap_json.roadmap_components.slice(0, 3).map((component, index) => (
                              <motion.div
                                key={`component-${roadmap.id}-${index}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="relative p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl backdrop-blur-sm border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all group/card"
                              >    
                                <div className="flex items-start gap-2 sm:gap-3">
                                  <div className="p-1.5 sm:p-2 bg-white/5 backdrop-blur-xl rounded-lg border border-white/10 mt-1 flex-shrink-0">
                                    {getComponentIcon(component.name)}
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-xs sm:text-sm md:text-base font-semibold text-neutral-200 mb-0.5 sm:mb-1 group-hover/card:text-white transition-colors font-heading truncate">
                                      {component.name}
                                    </h4>
                                    <p className="text-neutral-400 text-xs sm:text-sm line-clamp-2 group-hover/card:text-neutral-300 transition-colors font-sans">
                                      {component.description}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                            {roadmap.roadmap_json.roadmap_components.length > 3 && (
                              <div className="text-center text-xs text-neutral-400 mt-2">
                                +{roadmap.roadmap_json.roadmap_components.length - 3} more components
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl text-center border border-neutral-800/50 bg-white/5 backdrop-blur-sm">
                            <p className="text-neutral-400 text-xs sm:text-sm font-sans">No components available yet</p>
                          </div>
                        )}

                        {/* Card footer with progress and button */}
                        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 xs:gap-4 pt-2 border-t border-white/5">
                          <div className="flex flex-col xs:flex-row xs:items-center space-y-1.5 xs:space-y-0 xs:space-x-3 w-full xs:w-auto">
                            <span className="text-xs text-neutral-300 font-sans">Progress</span>
                            <div className="h-1.5 sm:h-2 w-full xs:w-16 sm:w-24 bg-neutral-800/50 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, delay: 0.7 }}
                                className={`h-full bg-gradient-to-r ${getProgressGradient(progress)}`}
                              />
                            </div>
                            <span className="text-xs text-neutral-400 font-sans">{progress}%</span>
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full xs:w-auto px-2.5 xs:px-3 py-1.5 bg-gradient-to-r from-purple-600/90 to-blue-600/90 hover:from-purple-500 hover:to-blue-500 text-white text-xs rounded-lg transition-all duration-300 shadow-lg shadow-purple-900/20 flex items-center justify-center gap-1.5 group/btn overflow-hidden font-sans"
                          >
                            <span>Continue</span>
                            <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform duration-300" />
                          </motion.button>
                        </div>
                      </div>
                    </CardWithGradientBorder>
                  </motion.div>
                );
              })}
            </Masonry>
            
            {/* Load more button - only rendered when needed */}
            {visibleCourses < roadmaps.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mt-6 sm:mt-8 md:mt-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLoadMore}
                  className="px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-purple-600/90 to-blue-600/90 hover:from-purple-500 hover:to-blue-500 text-white text-xs sm:text-sm md:text-base rounded-lg transition-all duration-300 shadow-lg shadow-purple-900/20 flex items-center justify-center gap-1.5 sm:gap-2 group/btn overflow-hidden font-sans"
                >
                  <span>Load More Courses</span>
                  <ArrowDown size={16} className="group-hover/btn:translate-y-0.5 transition-transform duration-300" />
                </motion.button>
              </motion.div>
            )}
          </>
        ) : (
          /* Empty state when there are no roadmaps */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative overflow-hidden rounded-xl"
          >
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-cyan-500/30 animate-pulse" />
            
            {/* Content with glassmorphism */}
            <div className="relative m-[1px] bg-black/80 backdrop-blur-xl rounded-xl border border-white/10 text-center py-6 sm:py-8 md:py-12 lg:py-16 px-4 sm:px-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="max-w-md mx-auto"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                  <Rocket className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-400" />
                </div>
                
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2 sm:mb-3">
                  Start Your Journey
                </h3>
                
                <p className="text-neutral-400 text-xs sm:text-sm md:text-base mb-4 sm:mb-6 md:mb-8">
                  No roadmaps available yet. Create your first personalized learning path to track your progress and master new skills.
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs sm:text-sm md:text-base rounded-lg transition-all duration-300 shadow-lg shadow-purple-900/20 flex items-center justify-center gap-1.5 sm:gap-2 mx-auto"
                  onClick={() => router.push('/')}
                >
                  <span>Create New Roadmap</span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default PrevCources;