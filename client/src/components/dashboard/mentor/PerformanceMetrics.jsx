"use client";

import { motion } from "framer-motion";

const MetricCard = ({ metric } ) => (
  <div className=" p-4 rounded-xl">
    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-neon-cyan">{metric.title}</h3>
        <span className={`flex items-center text-sm ${
          metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
        }`}>
          {metric.trend === 'up' ? '↑' : '↓'} {Math.abs(metric.change)}%
        </span>
      </div>
      <p className="text-2xl font-bold text-electric-blue">{metric.value}</p>
      <p className="text-sm text-foreground/60">{metric.description}</p>
    </div>
  </div>
);

const FeedbackCard = ({ feedback }) => (
  <div className=" p-4 rounded-xl">
    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-electric-blue">{feedback.mentee}</h3>
        <div className="flex items-center">
          <span className="text-yellow-500">{'★'.repeat(feedback.rating)}</span>
          <span className="text-foreground/40">{'★'.repeat(5 - feedback.rating)}</span>
        </div>
      </div>
      <p className="text-sm text-foreground/80">{feedback.comment}</p>
      <p className="text-xs text-neon-cyan">{feedback.date}</p>
    </div>
  </div>
);

export default function PerformanceMetrics() {
  const metrics = [
    {
      title: "Average Session Rating",
      value: "4.8/5",
      change: 5,
      trend: 'up',
      description: "Based on last 30 sessions",
    },
    {
      title: "Session Completion Rate",
      value: "95%",
      change: 2,
      trend: 'up',
      description: "Percentage of completed sessions",
    },
    {
      title: "Monthly Earnings",
      value: "$2,400",
      change: 15,
      trend: 'up',
      description: "Compared to last month",
    },
    {
      title: "Active Mentees",
      value: 12,
      change: 20,
      trend: 'up',
      description: "Current active mentees",
    },
  ];

  const feedback = [
    {
      id: '1',
      mentee: "Alex Johnson",
      rating: 5,
      comment: "Excellent mentor! Really helped me understand complex concepts.",
      date: "2024-02-15",
    },
    {
      id: '2',
      mentee: "Sarah Williams",
      rating: 4,
      comment: "Very knowledgeable and patient. Great at explaining things.",
      date: "2024-02-14",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-electric-blue mb-4">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <MetricCard metric={metric} />
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-electric-blue mb-4">Recent Feedback</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feedback.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <FeedbackCard feedback={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 