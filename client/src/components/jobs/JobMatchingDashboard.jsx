'use client'
import { useState } from 'react';
import JobCard from './JobCard';
import ResumeBuilder from './ResumeBuilder';
import { Briefcase, TrendingUp, Users } from 'lucide-react';

export default function JobMatchingDashboard() {
  const [selectedJob, setSelectedJob] = useState(null);

  const mockJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "Remote",
      salary: "$120k - $150k",
      matchScore: 95,
      skills: ["React", "TypeScript", "Node.js"],
      description: "Looking for an experienced frontend developer to join our team...",
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      company: "StartupX",
      location: "New York, NY",
      salary: "$130k - $160k",
      matchScore: 88,
      skills: ["React", "Python", "AWS"],
      description: "Join our fast-growing startup as a full stack engineer...",
    },
    {
      id: 3,
      title: "UI/UX Developer",
      company: "DesignLabs",
      location: "San Francisco, CA",
      salary: "$110k - $140k",
      matchScore: 85,
      skills: ["React", "Figma", "CSS"],
      description: "Create beautiful and functional user interfaces...",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI Job Matching</h1>
          <p className="text-gray-400">Personalized job recommendations based on your skills</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Job Recommendations */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recommended Jobs</h2>
              <div className="flex gap-4">
                <span className="text-sm text-gray-400">Match Score</span>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>

            <div className="space-y-4">
              {mockJobs.map((job) => (
                <JobCard 
                  key={job.id}
                  job={job}
                  isSelected={selectedJob?.id === job.id}
                  onSelect={() => setSelectedJob(job)}
                />
              ))}
            </div>

            {/* Job Market Insights */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="glass-card p-4 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-2">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">2.5k</div>
                <div className="text-sm text-gray-400">Available Jobs</div>
              </div>
              <div className="glass-card p-4 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white">89%</div>
                <div className="text-sm text-gray-400">Match Rate</div>
              </div>
              <div className="glass-card p-4 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white">150+</div>
                <div className="text-sm text-gray-400">Companies</div>
              </div>
            </div>
          </div>

          {/* Resume Builder */}
          <ResumeBuilder selectedJob={selectedJob} />
        </div>
      </div>
    </div>
  );
} 