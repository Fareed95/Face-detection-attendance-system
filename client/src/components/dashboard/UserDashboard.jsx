'use client'
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import ProgressCircle from './ProgressCircle';
import StreakTracker from './StreakTracker';
import ActivityGraph from './ActivityGraph';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import Book3D from '../dashboard/Book3D';
import LiveClass from '../dashboard/LiveClass';
import ParticleBackground from '../animations/ParticleBackground';


export default function UserDashboard() {
  const bookRef = useRef(null);
  const liveClassButtonRef = useRef(null);

  useEffect(() => {
    // GSAP animation for live class button
    const button = liveClassButtonRef.current;
    
    gsap.to(button, {
      duration: 1.5,
      boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)',
      repeat: -1,
      yoyo: true
    });
  }, []);

  return (
    <>
        <ParticleBackground/>
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Section */}
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <ProgressCircle progress={75} />
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                    alt="Profile"
                    className="absolute inset-0 m-auto w-24 h-24 rounded-full"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Welcome back, Alex!</h2>
                  <p className="text-gray-400">You're making great progress</p>
                </div>
              </div>
            </div>

            {/* Streak & Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StreakTracker streak={5} />
              <div className="glass-card p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                <ActivityGraph data={[3, 5, 2, 4, 6, 2, 4]} />
              </div>
            </div>

            {/* Recommended Topics */}
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-xl font-semibold text-white mb-6">Recommended Next Steps</h3>
              <div className="grid gap-4">
                {['Advanced CSS Layouts', 'JavaScript Promises', 'React Hooks'].map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{topic}</h4>
                        <p className="text-sm text-gray-400">Estimated 2 hours</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Live Class Component */}
            <LiveClass />

            {/* 3D Book Animation */}
            <div className="glass-card rounded-2xl overflow-hidden h-64">
              {/* <Book3D /> */}
            </div>
          </div>
        </div>
      </div>
    </div>

    </>
  );
} 