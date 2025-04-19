"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Message {
  id: string;
  title: string;
  content: string;
  sender: string;
  recipients: string[];
  status: 'draft' | 'sent' | 'scheduled';
  date: string;
  type: 'announcement' | 'newsletter' | 'reminder';
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  date: string;
  views: number;
}

const MessageCard = ({ message }: { message: Message }) => {
  const typeColors = {
    announcement: 'text-purple-500',
    newsletter: 'text-blue-500',
    reminder: 'text-yellow-500'
  };

  const statusColors = {
    draft: 'bg-gray-500/20 text-gray-500',
    sent: 'bg-green-500/20 text-green-500',
    scheduled: 'bg-blue-500/20 text-blue-500'
  };

  return (
    <div className="glass p-6 rounded-xl hover-glow">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-electric-blue">{message.title}</h3>
            <p className={`text-sm ${typeColors[message.type]} capitalize`}>{message.type}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs ${statusColors[message.status]}`}>
            {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
          </span>
        </div>

        <p className="text-sm text-foreground/60 line-clamp-2">{message.content}</p>

        <div className="flex justify-between items-center text-sm">
          <div>
            <p className="text-neon-cyan">From</p>
            <p className="text-electric-blue">{message.sender}</p>
          </div>
          <div className="text-right">
            <p className="text-neon-cyan">Date</p>
            <p className="text-electric-blue">{message.date}</p>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button className="glass px-3 py-1 rounded-lg hover:bg-deep-indigo/20 text-sm">
            View
          </button>
          <button className="neon-btn text-sm">
            {message.status === 'draft' ? 'Edit' : 'Resend'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AnnouncementCard = ({ announcement }: { announcement: Announcement }) => {
  const priorityColors = {
    low: 'bg-blue-500/20 text-blue-500',
    medium: 'bg-yellow-500/20 text-yellow-500',
    high: 'bg-red-500/20 text-red-500'
  };

  return (
    <div className="glass p-6 rounded-xl hover-glow">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-electric-blue">{announcement.title}</h3>
          <span className={`px-3 py-1 rounded-full text-xs ${priorityColors[announcement.priority]}`}>
            {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
          </span>
        </div>

        <p className="text-sm text-foreground/60">{announcement.content}</p>

        <div className="flex justify-between items-center text-sm">
          <div>
            <p className="text-neon-cyan">Views</p>
            <p className="text-electric-blue">{announcement.views}</p>
          </div>
          <div className="text-right">
            <p className="text-neon-cyan">Posted</p>
            <p className="text-electric-blue">{announcement.date}</p>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button className="glass px-3 py-1 rounded-lg hover:bg-deep-indigo/20 text-sm">
            Edit
          </button>
          <button className="neon-btn text-sm">
            Pin
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Communications() {
  const [activeTab, setActiveTab] = useState<'messages' | 'announcements'>('messages');

  const messages: Message[] = [
    {
      id: '1',
      title: 'Monthly Newsletter - March 2024',
      content: 'Updates on platform features, success stories, and upcoming events for our mentoring community.',
      sender: 'Communications Team',
      recipients: ['All Mentors', 'All Mentees'],
      status: 'scheduled',
      date: '2024-03-01',
      type: 'newsletter',
    },
    {
      id: '2',
      title: 'New Resource Alert',
      content: 'We have just added new mentoring resources to the library. Check them out!',
      sender: 'Resource Team',
      recipients: ['All Mentors'],
      status: 'sent',
      date: '2024-02-28',
      type: 'announcement',
    },
    {
      id: '3',
      title: 'Session Reminder',
      content: 'Reminder to complete your monthly progress reports by the end of this week.',
      sender: 'System',
      recipients: ['Active Mentors'],
      status: 'draft',
      date: '2024-02-27',
      type: 'reminder',
    },
  ];

  const announcements: Announcement[] = [
    {
      id: '1',
      title: 'Platform Maintenance',
      content: 'Scheduled maintenance this weekend. The platform will be unavailable for 2 hours.',
      priority: 'high',
      date: '2024-02-29',
      views: 245,
    },
    {
      id: '2',
      title: 'New Feature Release',
      content: 'We have added new analytics tools for tracking mentee progress.',
      priority: 'medium',
      date: '2024-02-28',
      views: 189,
    },
    {
      id: '3',
      title: 'Community Milestone',
      content: 'We have reached 1000 active mentoring relationships!',
      priority: 'low',
      date: '2024-02-27',
      views: 312,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-electric-blue">Communications</h2>
          <p className="text-neon-cyan mt-1">Manage messages and announcements</p>
        </div>
        <div className="flex space-x-4">
          <button className="glass px-4 py-2 rounded-lg hover:bg-deep-indigo/20">
            Filter
          </button>
          <button className="neon-btn">
            New Message
          </button>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'messages'
              ? 'bg-electric-blue text-white'
              : 'glass hover:bg-deep-indigo/20'
          }`}
          onClick={() => setActiveTab('messages')}
        >
          Messages
        </button>
        <button
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'announcements'
              ? 'bg-electric-blue text-white'
              : 'glass hover:bg-deep-indigo/20'
          }`}
          onClick={() => setActiveTab('announcements')}
        >
          Announcements
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeTab === 'messages' ? (
          messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <MessageCard message={message} />
            </motion.div>
          ))
        ) : (
          announcements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <AnnouncementCard announcement={announcement} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
} 