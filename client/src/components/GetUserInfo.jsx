"use client";
import React, { useState, useEffect } from 'react';
import { useUserContext } from '@/app/context/Userinfo';
import { useToast } from "@/hooks/use-toast";
import { useSession, signIn } from 'next-auth/react';

function GetUserInfo() {
  const { toast } = useToast();
  const { contextsetIsLoggedIn, contextsetEmail, contextsetName,contextorganisation,contextname, contextisLoggedIn,contextsetorganisation } = useUserContext();
  const [ID,setId]=useState("Invalid token!")
  const [token,setToken]=useState('-')
  function getToken(){
    const token = localStorage.getItem('authToken');
    console.log('Token:', token); 
    setToken(token)
    return token
  }

  const { data: session } = useSession()

  const getUserInfo = async () => {

    if (!token) {
      console.warn("No authentication token found");
      return; // Early return if no token exists
    }
    console.log('Token:', token); 
    console.log('login:', contextisLoggedIn); 
    try {
      const response = await fetch('http://localhost:8000/api/user', {
        method: 'GET',
        headers: {
          "Authorization": token,
          'Content-Type': "application/json",
        },
        credentials: 'include',
      });

      // Log the response status and status text
      console.log('Response Status:', response.status, response.statusText);

      if (!response.ok) {
        // Check for specific status codes and handle them accordingly
        contextsetorganisation([])
        console.log(contextorganisation)
        if (response.status === 401) {
          toast({
            title: "Unauthorized",
            description: "Your session may have expired. Please log in again.",
          });
        } else {
          toast({
            title: "Failed to fetch user info",
            description: `Error ${response.status}: ${response.statusText}`,
          });
        }
  
      }

      const result = await response.json();
      console.log('ID', result);
      setId(result.detail)
      if(result.is_company==true){
        contextsetorganisation(result.companies)
      }
      if(result.name){
        contextsetIsLoggedIn(true);
        contextsetEmail(result.email);
        contextsetName(result.name);
  
        toast({
          title: "Successfully logged in",
          description: `Welcome back, ${result.name}!`,
        });
      }
    
    } catch (error) {
      // toast({
      //   title: "There was an error",
      //   description: error.message,
      // });
      console.error("Error fetching user info:", error);
    }
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (contextisLoggedIn === true && contextorganisation.length==0&& ID=="Invalid token!") {
        getUserInfo();
        getToken()
        console.log(token);
        console.log(session);
      }
    }, 1000); // Check every second
    // console.log('Token:', token);
  
    // Cleanup interval on component unmount or when dependencies change
    return () => clearInterval(intervalId);
  }, [contextorganisation, contextisLoggedIn, ID]);


    // useEffect(() => {
    //   getUserInfo();
    // }, [contextisLoggedIn]);
  
  return (<div></div>);
}

export default GetUserInfo;

