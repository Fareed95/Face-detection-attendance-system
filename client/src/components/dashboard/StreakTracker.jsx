import { Flame } from 'lucide-react';

export default function StreakTracker({ streak }) {
  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 p-4 rounded-xl">
      <div className="w-12 h-12 rounded-full bg-orange-500/30 flex items-center justify-center">
        <Flame className="w-6 h-6 text-orange-500" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">{streak} Day Streak!</h3>
        <p className="text-sm text-gray-400">Keep up the great work</p>
      </div>
    </div>
  );
} 