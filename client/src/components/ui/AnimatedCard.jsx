import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useSound } from '../animations/SoundEffects';

export default function AnimatedCard({ children, className = '', onClick }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const { playSound } = useSound();

  const handleMouseEnter = () => {
    setIsHovered(true);
    playSound('hover');
    gsap.to(cardRef.current, {
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    gsap.to(cardRef.current, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
      boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
    });
  };

  const handleClick = (e) => {
    playSound('click');
    gsap.to(cardRef.current, {
      scale: 0.98,
      duration: 0.1,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
    });
    onClick?.(e);
  };

  return (
    <div
      ref={cardRef}
      className={`
        glass-card rounded-xl p-6
        transition-colors duration-300
        ${isHovered ? 'bg-white/10' : 'bg-white/5'}
        ${className}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
    </div>
  );
} 