import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Users, Clock, Award, Star } from "lucide-react";

export default function OrgAnalytics() {
  const metrics = [
    { 
      label: "Total Learning Hours", 
      value: "2,500+", 
      change: "+15%",
      icon: Clock,
      color: "from-emerald-500/20 to-teal-500/20"
    },
    { 
      label: "Average Completion Rate", 
      value: "85%", 
      change: "+5%",
      icon: Award,
      color: "from-blue-500/20 to-indigo-500/20"
    },
    { 
      label: "Active Users", 
      value: "180", 
      change: "+12%",
      icon: Users,
      color: "from-purple-500/20 to-pink-500/20"
    },
    { 
      label: "Course Satisfaction", 
      value: "4.8/5", 
      change: "+0.3",
      icon: Star,
      color: "from-amber-500/20 to-orange-500/20"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Analytics Overview</h2>
          <p className="text-sm text-neutral-400 mt-1">Track your organization's performance metrics</p>
        </div>
        <select className="w-full sm:w-auto bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-sm text-neutral-200">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 3 months</option>
          <option>Last year</option>
        </select>
      </div> */}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${metric.color} rounded-lg blur-xl opacity-25 group-hover:opacity-50 transition-opacity duration-300`} />
              <div className="relative bg-neutral-900/90 border border-neutral-800 p-4 rounded-lg backdrop-blur-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-neutral-800/50 rounded-lg">
                    <Icon className="w-4 h-4 text-neutral-300" />
                  </div>
                  <div className="flex items-center space-x-1 bg-neutral-800/50 px-2 py-1 rounded-full">
                    {parseFloat(metric.change) >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-400" />
                    )}
                    <span className={`text-xs font-medium ${
                      parseFloat(metric.change) >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
                <p className="text-xs text-neutral-400">{metric.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-900/90 border border-neutral-800 p-4 rounded-lg backdrop-blur-sm"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Learning Progress</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Daily progress tracking</p>
            </div>
            <button className="text-neutral-400 hover:text-white transition-colors">
              <span className="sr-only">More options</span>
              •••
            </button>
          </div>
          <div className="h-48 sm:h-64 flex items-center justify-center border border-dashed border-neutral-800 rounded-lg">
            <p className="text-sm text-neutral-400">Chart Placeholder</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-neutral-900/90 border border-neutral-800 p-4 rounded-lg backdrop-blur-sm"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Course Engagement</h3>
              <p className="text-xs text-neutral-400 mt-0.5">User interaction metrics</p>
            </div>
            <button className="text-neutral-400 hover:text-white transition-colors">
              <span className="sr-only">More options</span>
              •••
            </button>
          </div>
          <div className="h-48 sm:h-64 flex items-center justify-center border border-dashed border-neutral-800 rounded-lg">
            <p className="text-sm text-neutral-400">Chart Placeholder</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-neutral-900/90 border border-neutral-800 p-4 rounded-lg backdrop-blur-sm"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Monthly Activity Overview</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Comprehensive activity analysis</p>
            </div>
            <button className="text-neutral-400 hover:text-white transition-colors">
              <span className="sr-only">More options</span>
              •••
            </button>
          </div>
          <div className="h-48 sm:h-64 flex items-center justify-center border border-dashed border-neutral-800 rounded-lg">
            <p className="text-sm text-neutral-400">Chart Placeholder</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 