'use client'
import { useEffect, useRef, useState } from 'react';
import { Clock, Users } from 'lucide-react';
import { gsap } from 'gsap';

export default function LiveClass() {
  const buttonRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState('2:00:00');
  const [participants, setParticipants] = useState(42);

  useEffect(() => {
    // Button glow animation
    const button = buttonRef.current;
    
    const timeline = gsap.timeline({ repeat: -1 });
    timeline.to(button, {
      duration: 1.5,
      boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)',
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1
    });

    // Countdown timer
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 2);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = endTime - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft('Starting now!');
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => {
      timeline.kill();
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="text-xl font-semibold text-white mb-6">Next Live Class</h3>
      
      <div className="relative mb-8">
        <div className="w-20 h-20 mx-auto rounded-full bg-indigo-500/20 flex items-center justify-center mb-4">
          <Clock className="w-10 h-10 text-indigo-400" />
        </div>
        
        <div className="text-center">
          <h4 className="text-white font-medium text-lg mb-2">
            Advanced React Patterns
          </h4>
          <p className="text-2xl font-bold text-indigo-400 mb-2">
            {timeLeft}
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Users className="w-4 h-4" />
            <span>{participants} enrolled</span>
          </div>
        </div>

        {/* Live indicator */}
        <div className="absolute top-0 right-0 flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded-full">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-red-400 text-sm">LIVE</span>
        </div>
      </div>

      <div className="space-y-4">
        <button
          ref={buttonRef}
          className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all transform hover:scale-105"
        >
          Join Live Class
        </button>
        
        <button className="w-full py-3 px-6 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors">
          Add to Calendar
        </button>
      </div>
    </div>
  );
}