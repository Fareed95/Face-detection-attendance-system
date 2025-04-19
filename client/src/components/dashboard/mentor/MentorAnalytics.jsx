"use client";

import { motion } from "framer-motion";

const StatCard = ({ title, value, icon, change }) => (
  <div className="p-4 rounded-xl">
    <div className="flex justify-between items-start">
      <div>   
        <h3 className="text-sm text-neon-cyan font-medium">{title}</h3>
        <p className="text-2xl font-bold mt-2 text-neutral-200">{value}</p>
      </div>
      {icon && <div className="text-soft-purple">{icon}</div>}
    </div>
    {change && (
      <div className={`mt-2 text-sm ${
        change.type === 'increase' ? 'text-green-500' : 'text-red-500'
      }`}>
        {change.type === 'increase' ? '↑' : '↓'} {Math.abs(change.value)}%
      </div>
    )}
  </div>
);

export default function MentorStats() {
  const stats = [
    {
      title: "Active Mentees",
      value: 12,
      change: { value: 8, type: 'increase' },
    },
    {
      title: "Sessions This Month",
      value: 48,
      change: { value: 12, type: 'increase' },
    },
    {
      title: "Average Rating",
      value: "4.8/5",
      change: { value: 0.2, type: 'increase' },
    },
    {
      title: "Hours Mentored",
      value: 156,
      change: { value: 15, type: 'increase' },
    },
    {
      title: "Completion Rate",
      value: "94%",
      change: { value: 2, type: 'increase' },
    },
    {
      title: "Earnings This Month",
      value: "$2,400",
      change: { value: 10, type: 'increase' },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
} 