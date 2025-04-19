"use client";

import { motion } from "framer-motion";

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  description: string;
  icon?: string;
}

interface ChartCard {
  title: string;
  value: string | number;
  data: number[];
  labels: string[];
  trend: 'up' | 'down';
  change: number;
}

const StatCard = ({ stat }: { stat: StatCard }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="glass p-6 rounded-xl hover-glow relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-electric-blue/5 rounded-full -mr-16 -mt-16" />
    <div className="relative space-y-2">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-neon-cyan">{stat.title}</h3>
        <motion.span 
          className={`flex items-center text-sm px-2 py-1 rounded-full ${
            stat.trend === 'up' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
          }`}
          whileHover={{ scale: 1.1 }}
        >
          {stat.trend === 'up' ? '↑' : '↓'} {Math.abs(stat.change)}%
        </motion.span>
      </div>
      <div className="flex items-baseline space-x-2">
        <p className="text-3xl font-bold text-electric-blue">{stat.value}</p>
        {stat.icon && <span className="text-2xl">{stat.icon}</span>}
      </div>
      <p className="text-sm text-foreground/60">{stat.description}</p>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-soft-purple/5 rounded-full -mr-8 -mb-8" />
    </div>
  </motion.div>
);

const ChartCard = ({ chart }: { chart: ChartCard }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="glass p-6 rounded-xl hover-glow col-span-2 relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-48 h-48 bg-electric-blue/5 rounded-full -mr-24 -mt-24" />
    <div className="relative space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-neon-cyan">{chart.title}</h3>
          <p className="text-2xl font-bold text-electric-blue mt-1">{chart.value}</p>
        </div>
        <motion.span 
          className={`flex items-center text-sm px-2 py-1 rounded-full ${
            chart.trend === 'up' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
          }`}
          whileHover={{ scale: 1.1 }}
        >
          {chart.trend === 'up' ? '↑' : '↓'} {Math.abs(chart.change)}%
        </motion.span>
      </div>

      <div className="h-40 flex items-end space-x-2">
        {chart.data.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <motion.div 
              className="w-full bg-electric-blue/20 rounded-t hover:bg-electric-blue/30 transition-colors"
              style={{ height: `${value}%` }}
              whileHover={{ scale: 1.1 }}
              initial={{ height: 0 }}
              animate={{ height: `${value}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            />
            <span className="text-xs text-foreground/60 mt-2">{chart.labels[index]}</span>
          </div>
        ))}
      </div>
    </div>
    
    {/* Decorative elements */}
    <div className="absolute bottom-0 right-0 w-24 h-24 bg-soft-purple/5 rounded-full -mr-12 -mb-12" />
  </motion.div>
);

export default function OrgStats() {
  const stats: StatCard[] = [
    {
      title: "Total Mentors",
      value: 48,
      change: 12,
      trend: 'up',
      description: "Active mentors this month",
      icon: "👨‍🏫",
    },
    {
      title: "Total Mentees",
      value: 245,
      change: 18,
      trend: 'up',
      description: "Active mentees this month",
      icon: "👨‍🎓",
    },
    {
      title: "Session Completion",
      value: "92%",
      change: 5,
      trend: 'up',
      description: "Average completion rate",
      icon: "✅",
    },
    {
      title: "Revenue",
      value: "$12,450",
      change: 8,
      trend: 'up',
      description: "Monthly revenue",
      icon: "💰",
    },
  ];

  const charts: ChartCard[] = [
    {
      title: "Monthly Sessions",
      value: "1,245 sessions",
      data: [30, 45, 60, 75, 65, 85],
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      trend: 'up',
      change: 15,
    },
    {
      title: "Mentor Growth",
      value: "48 mentors",
      data: [20, 35, 45, 40, 50, 48],
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      trend: 'up',
      change: 12,
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h2 className="text-2xl font-bold text-electric-blue">Organization Overview</h2>
          <p className="text-neon-cyan mt-1">Real-time metrics and analytics</p>
        </div>
        <div className="flex space-x-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass px-4 py-2 rounded-lg hover:bg-deep-indigo/20"
          >
            <span className="flex items-center space-x-2">
              <span>📅</span>
              <span>This Month</span>
            </span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="neon-btn"
          >
            <span className="flex items-center space-x-2">
              <span>📊</span>
              <span>Generate Report</span>
            </span>
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <StatCard stat={stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {charts.map((chart, index) => (
          <motion.div
            key={chart.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
          >
            <ChartCard chart={chart} />
          </motion.div>
        ))}
      </div>
    </div>
  );
} 