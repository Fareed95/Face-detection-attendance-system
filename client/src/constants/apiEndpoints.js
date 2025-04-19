const BASE_URL = 'http://localhost:8000/api';
const MAIN_URL = 'http://localhost:8000';

export const API_ENDPOINTS = {
  // User Details
  USER_DETAILS: (email) => `${BASE_URL}/userdetails/${email}/`,
  
  // Tools
  TOOL_NAMES: `${BASE_URL}/toolnames/`,
  TOOLS: `${BASE_URL}/tools/`,
  TOOL_COMPONENTS: `${BASE_URL}/toolcomponents/`,
  
  // Education
  EDUCATION: `${BASE_URL}/education/`,
  
  // Certificates
  CERTIFICATES: `${BASE_URL}/certificates/`,
  
  // Projects
  PROJECTS: `${BASE_URL}/projects/`,
  
  // Links
  LINKS: `${BASE_URL}/links/`,
};

export const fetchWithAuth = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}; 