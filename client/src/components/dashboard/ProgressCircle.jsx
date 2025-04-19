import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function ProgressCircle({ progress, size = 120 }) {
  const circleRef = useRef(null);
  const radius = 54;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    gsap.to(circleRef.current, {
      strokeDashoffset: circumference - (progress / 100) * circumference,
      duration: 1.5,
      ease: "power2.out"
    });
  }, [progress, circumference]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-gray-700"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size/2}
          cy={size/2}
        />
        <circle
          ref={circleRef}
          className="text-indigo-500"
          strokeWidth="8"
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size/2}
          cy={size/2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: circumference
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-white">{progress}%</span>
      </div>
    </div>
  );
} 