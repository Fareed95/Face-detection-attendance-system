'use client'
import { useState } from 'react';
import { Edit2, Download, Share2 } from 'lucide-react';

export default function ResumeBuilder({ selectedJob }) {
  const [resumeData, setResumeData] = useState({
    name: "Alex Johnson",
    title: "Senior Frontend Developer",
    skills: [
      "React", "TypeScript", "Node.js", "AWS",
      "GraphQL", "Next.js", "TailwindCSS"
    ],
    experience: [
      {
        company: "TechCorp",
        position: "Frontend Developer",
        duration: "2020 - Present",
        description: "Led frontend development team..."
      }
    ],
    education: [
      {
        school: "University of Technology",
        degree: "B.S. Computer Science",
        year: "2016 - 2020"
      }
    ]
  });

  const [editingSection, setEditingSection] = useState(null);

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">AI Resume Builder</h2>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center pb-6 border-b border-gray-800">
          <h3 className="text-2xl font-bold text-white mb-2">{resumeData.name}</h3>
          <p className="text-gray-400">{resumeData.title}</p>
        </div>

        {/* Skills Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-white">Skills</h4>
            <button 
              onClick={() => setEditingSection('skills')}
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-400"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-white">Experience</h4>
            <button 
              onClick={() => setEditingSection('experience')}
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-400"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between">
                <h5 className="text-white font-medium">{exp.position}</h5>
                <span className="text-gray-400 text-sm">{exp.duration}</span>
              </div>
              <p className="text-gray-400">{exp.company}</p>
              <p className="text-sm text-gray-500">{exp.description}</p>
            </div>
          ))}
        </div>

        {/* Education Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-white">Education</h4>
            <button 
              onClick={() => setEditingSection('education')}
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-400"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          {resumeData.education.map((edu, index) => (
            <div key={index} className="space-y-1">
              <h5 className="text-white font-medium">{edu.school}</h5>
              <p className="text-gray-400">{edu.degree}</p>
              <p className="text-sm text-gray-500">{edu.year}</p>
            </div>
          ))}
        </div>

        {/* AI Enhancement Button */}
        <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity">
          Enhance with AI
        </button>
      </div>
    </div>
  );
} 