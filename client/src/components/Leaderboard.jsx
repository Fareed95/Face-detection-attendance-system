'use client';

import { motion } from 'framer-motion';
import { Trophy, Medal, Crown } from 'lucide-react';

const mockLeaderboardData = [
  {
    id: 1,
    name: "Alex Johnson",
    score: 980,
    rank: 1,
    avatar: "A",
    recentBadge: "Quiz Master",
    progress: 98,
    streak: 7
  },
  {
    id: 2,
    name: "Sarah Chen",
    score: 945,
    rank: 2,
    avatar: "S",
    recentBadge: "Fast Learner",
    progress: 94,
    streak: 5
  },
  {
    id: 3,
    name: "Mike Wilson",
    score: 920,
    rank: 3,
    avatar: "M",
    recentBadge: "Consistent",
    progress: 92,
    streak: 4
  },
  {
    id: 4,
    name: "Emily Davis",
    score: 890,
    rank: 4,
    avatar: "E",
    recentBadge: "Rising Star",
    progress: 89,
    streak: 3
  },
  {
    id: 5,
    name: "David Kim",
    score: 870,
    rank: 5,
    avatar: "D",
    recentBadge: "Dedicated",
    progress: 87,
    streak: 2
  }
];

const RankIcon = ({ rank }) => {
  if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-6 h-6 text-neutral-400" />;
  if (rank === 3) return <Medal className="w-6 h-6 text-amber-700" />;
  return <span className="text-neutral-400 font-mono">{rank}</span>;
};

const LeaderboardCard = ({ user, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl backdrop-blur-sm hover:bg-neutral-800/50 transition-all"
  >
    <div className="flex items-center space-x-4">
      <div className="flex items-center justify-center w-8 h-8">
        <RankIcon rank={user.rank} />
      </div>
      
      <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-xl font-semibold text-neutral-200">
        {user.avatar}
      </div>

      <div className="flex-1">
        <h3 className="text-neutral-200 font-semibold">{user.name}</h3>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-neutral-400">{user.recentBadge}</span>
          <span className="text-neutral-600">•</span>
          <span className="text-neutral-400">{user.streak} day streak</span>
        </div>
      </div>

      <div className="text-right">
        <div className="text-xl font-bold text-neutral-200">{user.score}</div>
        <div className="text-sm text-neutral-400">points</div>
      </div>
    </div>

    <div className="mt-3">
      <div className="flex justify-between items-center text-sm text-neutral-400 mb-1">
        <span>Progress</span>
        <span>{user.progress}%</span>
      </div>
      <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${user.progress}%` }}
          className="h-full bg-neutral-600 rounded-full"
        />
      </div>
    </div>
  </motion.div>
);

export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-neutral-950 p-4 relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-neutral-950" />
        <div className="absolute inset-0 bg-grid-small-white/[0.05] -z-10" />
        <div className="absolute inset-0 bg-dot-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
        <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-neutral-200 flex items-center justify-center gap-3 mb-2">
            <Crown className="w-8 h-8 text-yellow-500" />
            Leaderboard
          </h1>
          <p className="text-neutral-400">Top performers this week</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl backdrop-blur-sm">
            <div className="text-sm text-neutral-400">Total Participants</div>
            <div className="text-2xl font-bold text-neutral-200">1,234</div>
          </div>
          <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl backdrop-blur-sm">
            <div className="text-sm text-neutral-400">Average Score</div>
            <div className="text-2xl font-bold text-neutral-200">756</div>
          </div>
          <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl backdrop-blur-sm">
            <div className="text-sm text-neutral-400">Active Streaks</div>
            <div className="text-2xl font-bold text-neutral-200">89</div>
          </div>
        </motion.div>

        {/* Leaderboard List */}
        <div className="space-y-4">
          {mockLeaderboardData.map((user, index) => (
            <LeaderboardCard key={user.id} user={user} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
