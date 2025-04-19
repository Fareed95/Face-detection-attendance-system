"use client";

import { motion } from "framer-motion";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  status: 'completed' | 'pending' | 'failed';
}

interface RevenueMetric {
  title: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
  period: string;
}

const MetricCard = ({ metric }: { metric: RevenueMetric }) => (
  <div className="glass p-6 rounded-xl hover-glow">
    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-neon-cyan">{metric.title}</h3>
        <span className={`flex items-center text-sm ${
          metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
        }`}>
          {metric.trend === 'up' ? '↑' : '↓'} {Math.abs(metric.change)}%
        </span>
      </div>
      <p className="text-2xl font-bold text-electric-blue">
        ${metric.value.toLocaleString()}
      </p>
      <p className="text-sm text-foreground/60">vs. last {metric.period}</p>
    </div>
  </div>
);

const TransactionCard = ({ transaction }: { transaction: Transaction }) => (
  <div className="glass p-4 rounded-xl hover-glow">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          transaction.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'
        }`}>
          <span className={transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}>
            {transaction.type === 'income' ? '↓' : '↑'}
          </span>
        </div>
        <div>
          <h3 className="text-sm font-medium text-electric-blue">{transaction.description}</h3>
          <p className="text-xs text-neon-cyan">{transaction.category}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-medium ${
          transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
        }`}>
          {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
        </p>
        <p className="text-xs text-foreground/60">{transaction.date}</p>
      </div>
    </div>
  </div>
);

export default function FinanceOverview() {
  const metrics: RevenueMetric[] = [
    {
      title: "Total Revenue",
      value: 45750,
      change: 12,
      trend: 'up',
      period: 'month',
    },
    {
      title: "Average Session Rate",
      value: 85,
      change: 5,
      trend: 'up',
      period: 'month',
    },
    {
      title: "Operating Expenses",
      value: 12450,
      change: 8,
      trend: 'down',
      period: 'month',
    },
    {
      title: "Net Profit",
      value: 33300,
      change: 15,
      trend: 'up',
      period: 'month',
    },
  ];

  const transactions: Transaction[] = [
    {
      id: '1',
      date: '2024-02-29',
      description: 'Premium Mentorship Package',
      amount: 1200,
      type: 'income',
      category: 'Subscription',
      status: 'completed',
    },
    {
      id: '2',
      date: '2024-02-28',
      description: 'Platform Maintenance',
      amount: 450,
      type: 'expense',
      category: 'Operations',
      status: 'completed',
    },
    {
      id: '3',
      date: '2024-02-28',
      description: 'Group Session Revenue',
      amount: 850,
      type: 'income',
      category: 'Sessions',
      status: 'completed',
    },
    {
      id: '4',
      date: '2024-02-27',
      description: 'Marketing Campaign',
      amount: 600,
      type: 'expense',
      category: 'Marketing',
      status: 'pending',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-electric-blue">Finance Overview</h2>
          <p className="text-neon-cyan mt-1">Track revenue and expenses</p>
        </div>
        <div className="flex space-x-4">
          <button className="glass px-4 py-2 rounded-lg hover:bg-deep-indigo/20">
            Filter
          </button>
          <button className="neon-btn">
            Export Report
          </button>
        </div>
      </div>

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

      <div className="glass p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-electric-blue">Recent Transactions</h3>
          <button className="text-sm text-neon-cyan hover:text-electric-blue transition-colors">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <TransactionCard transaction={transaction} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 