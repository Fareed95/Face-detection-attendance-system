"use client";
import React, { createContext, useState, useContext } from 'react';


// Create the UserContext without TypeScript types
const UserContext = createContext({
  contextemail: '',
  contextRoadmap: '',
  contextId: '',
  contextinput: '',
  contextname: '',
  contextpassword: '',
  contextInterviewdeets: '',
  contextorganisation: '',
  contextisLoggedIn: false,
  contextQRInfo: '',
  isSpeaking: false,
  contextSpeaking: '',
  contextSelectedPerson: '',
  contextInterview: '',
  contextFirstRoadmap: '',
  contextimg: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',

  contextsetEmail: () => {},
  contextsetRoadmap: () => {},
  setIsSpeaking: () => {},
  contextsetId: () => {},
  contextsetinput: () => {},
  contextsetName: () => {},
  contextsetPassword: () => {},
  contextsetIsLoggedIn: () => {},
  contextsetorganisation: () => {},
  contextsetQRInfo: () => {},
  contextsetimg: () => {},
  contextSetSelectedPerson: () => {},
  setcontextInterview: () => {},
  setcontextInterviewdeets: () => {},
  contextsetSpeaking: () => {},
  contextsetFirstRoadmap: () => {},

});

export const UserProvider = ({ children }) => {
  const [contextemail, contextsetEmail] = useState('');
  const [contextFirstRoadmap, contextsetFirstRoadmap] = useState('');
  const [contextRoadmap, contextsetRoadmap] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [contextId, contextsetId] = useState('');
  const [contextinput, contextsetinput] = useState('');
  const [contextname, contextsetName] = useState('');
  const [contextSpeaking, contextsetSpeaking] = useState('');
  const [contextpassword, contextsetPassword] = useState('');
  const [contextQRInfo, contextsetQRInfo] = useState('');
  const [contextInterview, setcontextInterview] = useState('');
  const [contextInterviewdeets, setcontextInterviewdeets] = useState('');
  const [contextorganisation, contextsetorganisation] = useState([]);
  const [contextSelectedPerson, contextSetSelectedPerson] = useState('');
  const [contextisLoggedIn, contextsetIsLoggedIn] = useState(false);
  const [contextimg, contextsetimg] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');
  
  const value = {
    contextInterview,
    contextFirstRoadmap,
    contextsetFirstRoadmap,
    contextRoadmap,
    contextsetRoadmap,
    contextSpeaking,
    isSpeaking,
    setIsSpeaking,
    contextsetSpeaking ,
    contextInterviewdeets,
    setcontextInterviewdeets,
    setcontextInterview,
    contextemail,
    contextId,
    contextsetId,
    contextinput,
    contextorganisation,
    contextsetorganisation,
    contextname,
    contextpassword,
    contextisLoggedIn,
    contextimg,
    contextsetEmail,
    contextsetName,
    contextsetPassword,
    contextsetIsLoggedIn,
    contextsetimg,
    contextQRInfo,
    contextsetQRInfo,
    contextSelectedPerson,
    contextSetSelectedPerson,
    contextsetinput
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};