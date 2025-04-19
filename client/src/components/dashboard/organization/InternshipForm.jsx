"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Calendar, MapPin, DollarSign, Users, Clock, FileText, X } from 'lucide-react';

const FormField = ({ label, name, value, onChange, type = "text", icon: Icon, required = true, placeholder, className = "" }) => (
  <div className={`space-y-1 ${className}`}>
    <label className="flex items-center space-x-2 text-xs text-neutral-400">
      <Icon className="w-3.5 h-3.5 text-neutral-500" />
      <span>{label}</span>
    </label>
    {type === "textarea" ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-neutral-800/50 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500/20 transition-all duration-200"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full bg-neutral-800/50 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500/20 transition-all duration-200"
      />
    )}
  </div>
);

const Forms = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stipend: '',
    duration: '',
    location: 'remote',
    skills_required: '',
    openings: '',
    application_deadline: '',
    posted_at: new Date().toISOString()
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // First fetch the user data to get the company ID
      const response = await fetch('http://localhost:8000/api/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userData = await response.json();
      console.log('User data received:', userData);

      // Get the company ID from the first company in the array
      const companyId = userData.companies[0]?.id;
      if (!companyId) {
        throw new Error('No company found for this user');
      }
      console.log('Company ID:', companyId);

      // Prepare the internship data
      const internshipData = {
        company: companyId,
        title: formData.title,
        description: formData.description,
        stipend: formData.stipend,
        duration: formData.duration,
        location: formData.location,
        skills_required: formData.skills_required,
        openings: parseInt(formData.openings),
        application_deadline: formData.application_deadline,
        posted_at: new Date().toISOString()
      };

      console.log('Sending internship data:', internshipData);

      // Post the internship data
      const postResponse = await fetch('http://localhost:8000/api/internships/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        credentials: 'include',
        body: JSON.stringify(internshipData),
      });

      if (!postResponse.ok) {
        throw new Error(`HTTP error! status: ${postResponse.status}`);
      }

      const result = await postResponse.json();
      console.log('API Response:', result);

      // Reset form and close modal on success
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        stipend: '',
        duration: '',
        location: 'remote',
        skills_required: '',
        openings: '',
        application_deadline: '',
        posted_at: new Date().toISOString()
      });

      alert('Internship posted successfully!');

    } catch (error) {
      console.error('Error posting internship:', error);
      alert(error.message || 'Failed to post internship. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    console.log('Form field updated:', name, value);
  };

  return (
    <div className="flex justify-center items-center">
      <motion.button
        onClick={() => setShowModal(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Briefcase className="w-4 h-4" />
        <span>Post New Internship</span>
      </motion.button>

      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-[70] mt-16"
            >
              <div className="w-full max-w-2xl max-h-[calc(100vh-4rem)] overflow-y-auto bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl">
                {/* Modal Header */}
                <div className="sticky top-0 bg-neutral-900/95 backdrop-blur-xl border-b border-neutral-800 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">Post New Internship</h2>
                      <p className="text-sm text-neutral-400">Fill in the details to create a new internship posting</p>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-2 hover:bg-neutral-800 rounded-lg transition-colors group"
                    >
                      <X className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-6 space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Details */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          label="Position Title"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          icon={Briefcase}
                          placeholder="e.g. Software Engineering Intern"
                        />
                        <FormField
                          label="Monthly Stipend"
                          name="stipend"
                          value={formData.stipend}
                          onChange={handleChange}
                          type="number"
                          icon={DollarSign}
                          placeholder="Enter amount"
                        />
                        <FormField
                          label="Duration (months)"
                          name="duration"
                          value={formData.duration}
                          onChange={handleChange}
                          type="text"
                          icon={Clock}
                          placeholder="e.g. 3 months"
                        />
                        <FormField
                          label="Number of Openings"
                          name="openings"
                          value={formData.openings}
                          onChange={handleChange}
                          type="number"
                          icon={Users}
                          placeholder="e.g. 5"
                        />
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="flex items-center space-x-2 text-xs text-neutral-400">
                            <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                            <span>Location Type</span>
                          </label>
                          <select
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full bg-neutral-800/50 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500/20 transition-all duration-200"
                          >
                            {['remote', 'hybrid', 'onsite'].map(option => (
                              <option key={option} value={option} className="bg-neutral-800 capitalize">
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                        <FormField
                          label="Application Deadline"
                          name="application_deadline"
                          value={formData.application_deadline}
                          onChange={handleChange}
                          type="date"
                          icon={Calendar}
                          placeholder="dd-mm-yyyy"
                        />
                      </div>
                    </div>

                    {/* Description and Skills */}
                    <div className="space-y-4">
                      <FormField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        type="textarea"
                        icon={FileText}
                        placeholder="Enter detailed description of the internship role..."
                      />
                      <FormField
                        label="Required Skills"
                        name="skills_required"
                        value={formData.skills_required}
                        onChange={handleChange}
                        icon={Briefcase}
                        placeholder="e.g. React, Node.js, Python"
                      />
                    </div>

                    {/* Form Actions */}
                    <div className="sticky bottom-0 bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-800 -mx-6 -mb-6 p-4 flex justify-end space-x-3">
                      <motion.button
                        type="button"
                        onClick={() => setShowModal(false)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 text-sm rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700/80 transition-all duration-200"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-200 shadow-lg shadow-blue-500/25"
                      >
                        Post Internship
                      </motion.button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Forms;