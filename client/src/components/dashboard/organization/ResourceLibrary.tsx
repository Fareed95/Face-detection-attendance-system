"use client";

import { motion } from "framer-motion";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'course' | 'template';
  category: string;
  author: string;
  dateAdded: string;
  downloads: number;
  rating: number;
}

const ResourceCard = ({ resource }: { resource: Resource }) => {
  const typeIcons = {
    video: '🎥',
    document: '📄',
    course: '📚',
    template: '📋'
  };

  return (
    <div className="glass p-6 rounded-xl hover-glow">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <span className="text-2xl" role="img" aria-label={resource.type}>
              {typeIcons[resource.type]}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-electric-blue">{resource.title}</h3>
              <p className="text-sm text-neon-cyan">{resource.category}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm font-medium text-electric-blue">{resource.rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-sm text-foreground/60 line-clamp-2">{resource.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-neon-cyan">Author</p>
            <p className="text-electric-blue">{resource.author}</p>
          </div>
          <div>
            <p className="text-neon-cyan">Added</p>
            <p className="text-electric-blue">{resource.dateAdded}</p>
          </div>
          <div>
            <p className="text-neon-cyan">Downloads</p>
            <p className="text-electric-blue">{resource.downloads}</p>
          </div>
          <div>
            <p className="text-neon-cyan">Type</p>
            <p className="text-electric-blue capitalize">{resource.type}</p>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button className="glass px-3 py-1 rounded-lg hover:bg-deep-indigo/20 text-sm">
            Preview
          </button>
          <button className="neon-btn text-sm">
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ResourceLibrary() {
  // Mock data - replace with actual data fetching
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Effective Mentoring Techniques',
      description: 'A comprehensive guide to modern mentoring approaches and best practices for building strong mentor-mentee relationships.',
      type: 'course',
      category: 'Mentoring Skills',
      author: 'Dr. Emily Watson',
      dateAdded: '2024-02-15',
      downloads: 128,
      rating: 4.8,
    },
    {
      id: '2',
      title: 'Feedback Template Pack',
      description: 'Collection of customizable templates for providing structured feedback to mentees at different stages of their journey.',
      type: 'template',
      category: 'Resources',
      author: 'Mentoring Team',
      dateAdded: '2024-02-10',
      downloads: 89,
      rating: 4.6,
    },
    {
      id: '3',
      title: 'Goal Setting Workshop',
      description: 'Video workshop on setting SMART goals and creating effective development plans for mentees.',
      type: 'video',
      category: 'Professional Development',
      author: 'Sarah Chen',
      dateAdded: '2024-02-05',
      downloads: 245,
      rating: 4.9,
    },
    {
      id: '4',
      title: 'Progress Tracking Guide',
      description: "Comprehensive documentation on using the platform's progress tracking tools and features effectively.",
      type: 'document',
      category: 'Platform Guide',
      author: 'Technical Team',
      dateAdded: '2024-02-01',
      downloads: 167,
      rating: 4.7,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-electric-blue">Resource Library</h2>
          <p className="text-neon-cyan mt-1">Manage and share educational resources</p>
        </div>
        <div className="flex space-x-4">
          <button className="glass px-4 py-2 rounded-lg hover:bg-deep-indigo/20">
            Filter
          </button>
          <button className="neon-btn">
            Upload Resource
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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