import { motion } from "framer-motion";

export default function CourseLibrary() {
  const courses = [
    {
      id: 1,
      title: "Web Development Fundamentals",
      category: "Development",
      students: 120,
      rating: 4.8,
    },
    {
      id: 2,
      title: "Data Science Essentials",
      category: "Data Science",
      students: 85,
      rating: 4.6,
    },
    {
      id: 3,
      title: "Machine Learning Basics",
      category: "AI/ML",
      students: 95,
      rating: 4.7,
    },
    // Add more courses as needed
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-neutral-text">Course Library</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group px-4 py-2 rounded-lg overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-white/10 to-cyan-500/20 group-hover:opacity-100 opacity-50 transition-opacity" />
          <div className="relative bg-neutral-glass border border-glass-border px-4 py-2 rounded-lg text-neutral-text group-hover:text-white transition-colors">
            Add Course
          </div>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-glass-border rounded-xl p-6 backdrop-blur-sm relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-neutral-text">{course.title}</h3>
                <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-neutral-accent">
                  {course.category}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-neutral-accent">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {course.students} students
                </div>
                <div className="flex items-center text-neutral-accent">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {course.rating}
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-neutral-accent hover:text-white transition-colors"
                >
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-neutral-accent hover:text-white transition-colors"
                >
                  View Details
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 