'use client'
import { CheckCircle, MapPin, Building, DollarSign } from 'lucide-react';

export default function JobCard({ job, isSelected, onSelect }) {
  return (
    <div
      className={`
        glass-card p-6 rounded-xl cursor-pointer transition-all
        ${isSelected ? 'ring-2 ring-indigo-500' : 'hover:bg-white/10'}
      `}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">{job.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Building className="w-4 h-4" />
              {job.company}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-sm">
          <CheckCircle className="w-4 h-4" />
          {job.matchScore}% Match
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-sm"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-gray-400">
          <DollarSign className="w-4 h-4" />
          <span>{job.salary}</span>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
          Apply Now
        </button>
      </div>
    </div>
  );
} 