"use client";

import { motion } from "framer-motion"; 

const ResourceCard = ({ resource }) => (
  <div className="glass p-4 rounded-xl hover-glow">
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-electric-blue">{resource.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs ${
          resource.type === 'video' ? 'bg-purple-500/20 text-purple-500' :
          resource.type === 'document' ? 'bg-blue-500/20 text-blue-500' :
          resource.type === 'course' ? 'bg-green-500/20 text-green-500' :
          'bg-yellow-500/20 text-yellow-500'
        }`}>
          {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
        </span>
      </div>
      
      <p className="text-sm text-foreground/80">{resource.description}</p>
      
      <div className="flex justify-between items-center text-sm">
        <span className="text-neon-cyan">Added: {resource.dateAdded}</span>
        <div className="flex items-center space-x-4">
          <span className="text-soft-purple">{resource.views} views</span>
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="ml-1 text-foreground/80">{resource.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function ResourceCenter() {
  // Mock data - replace with actual data fetching
  const resources = [
    {
      id: '1',
      title: 'Advanced Backend Development Guide',
      type: 'document',
      description: 'Comprehensive guide covering Node.js, Express, and database optimization techniques.',
      dateAdded: '2024-02-15',
      views: 245,
      rating: 4.8,
    },
    {
      id: '2',
      title: 'System Design Interview Preparation',
      type: 'video',
      description: 'In-depth video course on system design principles and real-world examples.',
      dateAdded: '2024-02-10',
      views: 1203,
      rating: 4.9,
    },
    {
      id: '3',
      title: 'Full Stack Development Bootcamp',
      type: 'course',
      description: 'Complete course covering modern full-stack development with React and Node.js.',
      dateAdded: '2024-02-01',
      views: 3567,
      rating: 4.7,
    },
    {
      id: '4',
      title: 'Microservices Architecture Patterns',
      type: 'article',
      description: 'Best practices and patterns for building scalable microservices architecture.',
      dateAdded: '2024-02-18',
      views: 892,
      rating: 4.6,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-electric-blue">Resource Center</h2>
        <div className="flex space-x-4">
          <button className="neon-btn">Upload Resource</button>
          <button className="glass px-4 py-2 rounded-lg hover:bg-deep-indigo/20">
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {resources.map((resource, index) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ResourceCard resource={resource} />
          </motion.div>
        ))}
      </div>
    </div>
  );
} 