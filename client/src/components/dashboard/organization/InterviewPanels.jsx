'use client'
import { useEffect, useState } from 'react';
import { useUserContext } from '@/app/context/Userinfo';
import { motion } from 'framer-motion';
import InternshipForm from '@/components/dashboard/organization/InternshipForm'
import { Briefcase } from 'lucide-react';

export default function StudentDashboard() {
  const [internships, setInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { contextorganisation } = useUserContext();

  const handleSelectForInterview = async (studentId) => {
    console.log('Selected student ID:', studentId);
    try {
      const response = await fetch(`http://localhost:8000/api/internships/${studentId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_selected: true })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const updatedStudent = await response.json();

      setInternships(prevInternships =>
        prevInternships.map(internship => ({
          ...internship,
          students_under_review: internship.students_under_review.filter(student => student.id !== studentId),
          students_for_interview: [...internship.students_for_interview, updatedStudent]
        }))
      );

      alert('Student selected for interview successfully!');
    } catch (error) {
      console.error('Error updating student status:', error);
      alert('Failed to update student status. Please try again.');
    }
  };

  useEffect(() => {
    if (contextorganisation && contextorganisation.length > 0) {
      const allInternships = contextorganisation.flatMap(company => company.internships);
      setInternships(allInternships);
      setIsLoading(false);
    }
  }, [contextorganisation]);

  useEffect(() => {
    console.log('Internships data:', internships);
  }, [internships]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
        {/* Header with Form Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            {/* <Briefcase className="w-5 h-5" /> */}
            Internship Applications</h2>
          <InternshipForm />
        </div>

        {/* Internship Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {internships.map((internship) => (
            <motion.div
              key={internship.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-2xl overflow-hidden shadow-xl"
            >
              {/* Internship Header */}
              <div className="p-6 border-b border-neutral-800 bg-gradient-to-r from-neutral-900 to-neutral-800">
                <h2 className="text-xl font-bold text-white mb-3">{internship.title}</h2>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                    💰 ₹{internship.stipend}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    ⏳ {internship.duration}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    📍 {internship.location}
                  </span>
                </div>
              </div>

              {/* Students for Interview */}
              <div className="p-6 border-b border-neutral-800">
                <h3 className="flex items-center space-x-2 text-base font-semibold text-blue-400 mb-4">
                  <span>Selected for Interview</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/10 border border-blue-500/20">
                    {internship.students_for_interview?.length || 0}
                  </span>
                </h3>
                <div className="space-y-3">
                  {internship.students_for_interview?.map((student) => (
                    <motion.div
                      key={student.id}
                      className="group bg-neutral-800/50 hover:bg-neutral-800 rounded-xl p-4 transition-all duration-200"
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{student.user_name}</h4>
                          <p className="text-xs text-neutral-400 mt-2">Interview: {formatDate(student.interviw_time)}</p>
                          <p className="text-xs text-neutral-500">Registered: {formatDate(student.registered_at)}</p>
                        </div>
                        <span className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                          Selected
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  {internship.students_for_interview?.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-neutral-500">No students selected for interview yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Students Under Review */}
              <div className="p-6">
                <h3 className="flex items-center space-x-2 text-base font-semibold text-orange-400 mb-4">
                  <span>Under Review</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-orange-500/10 border border-orange-500/20">
                    {internship.students_under_review?.length || 0}
                  </span>
                </h3>
                <div className="space-y-3">
                  {internship.students_under_review?.map((student) => (
                    <motion.div
                      key={student.id}
                      className="group bg-neutral-800/50 hover:bg-neutral-800 rounded-xl p-4 transition-all duration-200"
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors">{student.user_name}</h4>
                          <p className="text-xs text-neutral-500 mt-2">Registered: {formatDate(student.registered_at)}</p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <span className="px-3 py-1 text-xs rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                            Under Review
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm px-4 py-2 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/20"
                            onClick={() => handleSelectForInterview(internship.id)}
                          >
                            Select for Interview
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {internship.students_under_review?.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-neutral-500">No students under review</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
