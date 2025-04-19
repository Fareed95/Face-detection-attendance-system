// app/context/RoadmapContext.js
"use client";

import React, { createContext, useContext, useState } from 'react';

// Create a context for the roadmap
const RoadmapContext = createContext();


export const RoadmapProvider = ({ children }) => {
  const [roadmap, setRoadmap] = useState({
    roadmap_id: null,
    total_components: null,
    first_component: null,
  });
// export const RoadmapProvider = ({ children }) => {
//   const [roadmap, setRoadmap] = useState({
//     roadmap_id: 43,
//     total_components: 3,
//     first_component: {
//       "description": "Learn the fundamentals of Python programming, including data types, variables, control structures, functions, and modules.",
//       "document": "https://docs.python.org/3/tutorial/index.html",
//       "name": "Python Basics",
//       "videos": [
//           "https://www.youtube.com/embed/kqtD5dpn9C8",
//           "https://www.youtube.com/embed/fr1f84rg4Nw",
//           "https://www.youtube.com/embed/vLqTf2b6GZw",
//           "https://www.youtube.com/embed/fWjsdhR3z3c",
//           "https://www.youtube.com/embed/DInMru2Eq6E"
//       ]
//   },
//   });

  return (
    <RoadmapContext.Provider value={{ roadmap, setRoadmap }}>
      {children}
    </RoadmapContext.Provider>
  );
};

// Custom hook to use the Roadmap context
export const useRoadmap = () => {
  return useContext(RoadmapContext);
};
