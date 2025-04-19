"use client";

import { motion } from "framer-motion";

const MenteeCard = ({ mentee }) => (
  <div className="p-4 rounded-xl bg-neutral-900">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold text-neutral-200">{mentee.name}</h3>
        <div className="mt-2 space-y-1">
          <p className="text-sm">
            <span className="text-neon-cyan">Progress:</span>{" "}
            <span className="text-foreground/80">{mentee.progress}%</span>
          </p>
          <p className="text-sm">
            <span className="text-neon-cyan">Last Session:</span>{" "}
            <span className="text-foreground/80">{mentee.lastSession}</span>
          </p>
          <p className="text-sm">
            <span className="text-neon-cyan">Next Session:</span>{" "}
            <span className="text-foreground/80">{mentee.nextSession}</span>
          </p>
        </div>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs ${
        mentee.status === 'active' ? 'bg-green-500/20 text-green-500' :
        mentee.status === 'completed' ? 'bg-blue-500/20 text-blue-500' :
        'bg-yellow-500/20 text-yellow-500'
      }`}>
        {mentee.status.charAt(0).toUpperCase() + mentee.status.slice(1)}
      </span>
    </div>
  </div>
);

export default function MenteeList() {
  // Mock data - replace with actual data fetching
  const mentees = [
    {
      id: '1',
      name: 'Alex Johnson',
      progress: 75,
      lastSession: '2024-02-15',
      nextSession: '2024-02-22',
      status: 'active',
    },
    {
      id: '2',
      name: 'Sarah Williams',
      progress: 100,
      lastSession: '2024-02-14',
      nextSession: '-',
      status: 'completed',
    },
    {
      id: '3',
      name: 'Michael Brown',
      progress: 0,
      lastSession: '-',
      nextSession: '2024-02-25',
      status: 'pending',
    },
    // Add more mentees as needed
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-electric-blue">Your Mentees</h2>
        <button className="neon-btn">Add New Mentee</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mentees.map((mentee, index) => (
          <motion.div
            key={mentee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <MenteeCard mentee={mentee} />
          </motion.div>
        ))}
      </div>
    </div>
  );
} 