"use client";
import { motion } from "framer-motion";

export const GlassCard = ({ children, className = "", hover = true }) => {
  return (
    <motion.div
      className={`
        relative overflow-hidden
        backdrop-blur-xl bg-white/5
        border border-white/10
        rounded-2xl
        ${className}
      `}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Animated border */}
      <div className="absolute inset-0 border border-white/10 rounded-2xl" />
    </motion.div>
  );
}; 