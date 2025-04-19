"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardShellProps {
  children: React.ReactNode;
  navItems: Array<{ label: string; path: string }>;
  title: string;
  subtitle?: string;
}

export default function DashboardShell({
  children,
  navItems,
  title,
  subtitle,
}: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass p-6 rounded-xl mb-6">
          <h1 className="text-3xl font-bold text-electric-blue">{title}</h1>
          {subtitle && <p className="text-neon-cyan mt-2">{subtitle}</p>}
        </div>

        {/* Navigation */}
        <div className="glass p-4 rounded-xl mb-6">
          <nav className="flex flex-wrap gap-4">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? "neon-btn"
                      : "hover:bg-deep-indigo/20"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass p-6 rounded-xl"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
} 