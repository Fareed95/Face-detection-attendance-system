"use client";

import { motion } from "framer-motion"; 

const SessionCard = ({ session }) => (
  <div className="p-6 rounded-xl">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold text-electric-blue">{session.mentee}</h3>
        <div className="mt-2 space-y-1">
          <p className="text-sm">
            <span className="text-neon-cyan">Date:</span>{" "}
            <span className="text-foreground/80">{session.date}</span>
          </p>
          <p className="text-sm">
            <span className="text-neon-cyan">Time:</span>{" "}
            <span className="text-foreground/80">{session.time}</span>
          </p>
          <p className="text-sm">
            <span className="text-neon-cyan">Duration:</span>{" "}
            <span className="text-foreground/80">{session.duration}</span>
          </p>
          <p className="text-sm">
            <span className="text-neon-cyan">Topic:</span>{" "}
            <span className="text-foreground/80">{session.topic}</span>
          </p>
        </div>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs ${
        session.status === 'upcoming' ? 'bg-blue-500/20 text-blue-500' :
        session.status === 'completed' ? 'bg-green-500/20 text-green-500' :
        'bg-red-500/20 text-red-500'
      }`}>
        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
      </span>
    </div>
  </div>
);

export default function SessionCalendar() {
  // Mock data - replace with actual data fetching
  const sessions = [
    {
      id: '1',
      mentee: 'Alex Johnson',
      date: '2024-02-22',
      time: '10:00 AM',
      duration: '1 hour',
      topic: 'Backend Development',
      status: 'upcoming',
    },
    {
      id: '2',
      mentee: 'Sarah Williams',
      date: '2024-02-15',
      time: '2:00 PM',
      duration: '1 hour',
      topic: 'Database Design',
      status: 'completed',
    },
    {
      id: '3',
      mentee: 'Michael Brown',
      date: '2024-02-18',
      time: '11:00 AM',
      duration: '1 hour',
      topic: 'API Development',
      status: 'cancelled',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-electric-blue">Session Calendar</h2>
        <button className="neon-btn">Schedule New Session</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sessions.map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <SessionCard session={session} />
          </motion.div>
        ))}
      </div>
    </div>
  );
} 