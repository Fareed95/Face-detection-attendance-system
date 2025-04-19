"use client"
import { useUserContext } from '@/app/context/Userinfo';
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast"
import { useEffect } from 'react';

import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import Link from "next/link";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

import { useRouter } from "next/navigation"
import { useSession, signIn } from 'next-auth/react';

function Login() {
  const { data: session } = useSession()

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const { contextsetIsLoggedIn, contextsetEmail, contextsetName } = useUserContext();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const Getuserinfo = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      toast({
        title: "No authentication token found",
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/user', {
        method: 'GET',
        headers: {
          "Authorization": token,
          'Content-Type': "application/json",
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP Error: ${response.statusText}`);
      }

      const result = await response.json();

      // Update context with user information
      contextsetIsLoggedIn(true);
      contextsetEmail(result.email);
      contextsetName(result.name);

      toast({
        title: "You are Successfully Logged In",
      });

      // Redirect to the home page
      router.push("/");

    } catch (error) {
      toast({
        title: "Server Error ",
        description: error.message,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Wrong Password",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Failed to login",
            description: `Error ${response.status}: ${response.statusText}`,
            variant: "destructive"
          });
        }
        setLoading(false);
        return;
      }

      const result = await response.json();

      // Store the JWT token in local storage
      localStorage.setItem('authToken', result.jwt);

      // Fetch user information
      await Getuserinfo();
      setLoading(false);

    } catch (error) {
      toast({
        title: "Server Error",
        description: error.message,
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  async function loginWithGoogle() {
    setLoading(true);
    try {
      await signIn('google');
      OAuth();
    } catch (error) {
      toast({
        title: "Something went wrong with your login",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }
  
  async function loginWithGithub() {
    setLoading(true);
    try {
      await signIn('github');
    } catch (error) {
      toast({
        title: "Something went wrong with your login",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    if (session) {
      contextsetIsLoggedIn(true);
      contextsetEmail(session.user.email);
      contextsetName(session.user.name);
      setName(session.user.name);
      setEmail(session.user.email);
    }
  }, [session]);

  const OAuth = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/oauth2/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const result = await response.json();

      // Store the JWT token in local storage
      localStorage.setItem('authToken', result.jwt);

      // Redirect to the home page and show a success message
      router.push('/');
      toast({
        title: "You are Successfully Logged In",
      });

      // Fetch user information
      await Getuserinfo();
    } catch (error) {
      toast({
        title: "There was an error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (session && name && email) {
      OAuth();
    }
  }, [name, email, session]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 to-black p-4 sm:p-6 md:p-8">
      {/* Animated background elements */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 overflow-hidden z-0"
      >
        {/* Gradient orbs - updated to match organization signup colors */}
        <div className="absolute top-0 right-0 w-[250px] sm:w-[300px] h-[250px] sm:h-[300px] bg-ai-blue-500/20 rounded-full blur-[100px] sm:blur-[120px] animate-pulse-subtle" />
        <div className="absolute bottom-0 left-0 w-[250px] sm:w-[300px] h-[250px] sm:h-[300px] bg-ai-teal-500/20 rounded-full blur-[100px] sm:blur-[120px] animate-pulse-subtle" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-small-white/[0.02] z-0" />
        
        {/* Particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-ai-teal-500/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0.5, 1, 0.5],
              opacity: [0.3, 0.8, 0.3],
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
      
      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative"
        >
          {/* Card backdrop blur and glow effects - updated to match organization signup */}
          <div className="absolute -inset-1 bg-gradient-to-r from-ai-blue-500/10 via-ai-teal-500/10 to-ai-blue-500/10 rounded-2xl blur-xl" />
          
          <div className="bg-neutral-900/80 backdrop-blur-xl rounded-2xl border border-neutral-800/60 shadow-2xl p-5 sm:p-6 md:p-8 relative overflow-hidden">
            {/* Decorative accent lines - updated to match organization signup */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-ai-blue-500/30 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-ai-teal-500/30 to-transparent" />
            <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-ai-blue-500/30 to-transparent" />
            <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-ai-teal-500/30 to-transparent" />
            
            {/* Header - updated colors to match organization signup */}
            <motion.div variants={itemVariants} className="text-center mb-5 sm:mb-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-ai-blue-400 via-ai-teal-400 to-ai-blue-400 bg-clip-text text-transparent">
                Welcome Back
              </h1>
            
            </motion.div>

            {/* Organization Button - updated colors to match organization signup */}
            <motion.div variants={itemVariants}>
              <Link href="/OrganizationLogin">
                <button className="w-full py-2 sm:py-2.5 px-3 sm:px-4 mb-5 sm:mb-6 bg-gradient-to-r from-ai-blue-600/60 to-ai-teal-700/60 hover:from-ai-blue-600 hover:to-ai-teal-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-ai-blue-600/10 relative overflow-hidden group">
                  <span className="relative z-10">Continue as Organization</span>
                  {/* Button shine effect */}
                  <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine" />
                </button>
              </Link>
            </motion.div>

            {/* Login Form - enhanced responsive spacing */}
            <motion.form 
              variants={itemVariants}
              className="space-y-3 sm:space-y-4"
              onSubmit={handleSubmit}
            >
              <LabelInputContainer className="space-y-1 sm:space-y-1.5">
                <Label htmlFor="email" className="text-neutral-300 text-xs sm:text-sm">Email Address</Label>
                <div className="relative">
                  <Input 
                    id="email" 
                    placeholder="you@example.com" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-neutral-800/50 border border-neutral-700/50 focus:border-ai-teal-500/50 rounded-lg text-neutral-200 placeholder-neutral-500 text-xs sm:text-sm focus:ring-2 focus:ring-ai-teal-500/20 transition-all duration-300"
                    required
                  />
                </div>
              </LabelInputContainer>

              <LabelInputContainer className="space-y-1 sm:space-y-1.5">
                <Label htmlFor="password" className="text-neutral-300 text-xs sm:text-sm">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    placeholder="••••••••" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-neutral-800/50 border border-neutral-700/50 focus:border-ai-teal-500/50 rounded-lg text-neutral-200 placeholder-neutral-500 text-xs sm:text-sm focus:ring-2 focus:ring-ai-teal-500/20 transition-all duration-300"
                    required
                  />
                </div>
              </LabelInputContainer>

              {/* Login Button & Forgot Password - updated colors */}
              <div className="space-y-2 sm:space-y-3">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-ai-blue-600 to-ai-teal-600 hover:from-ai-blue-500 hover:to-ai-teal-500 text-white rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 shadow-lg shadow-ai-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                      <span className="text-xs sm:text-sm">Signing in...</span>
                    </div>
                  ) : (
                    <span className="relative z-10">Sign In</span>
                  )}
                  <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine" />
                  <BottomGradient />
                </motion.button>

                <div className="flex justify-end">
                  <Link href="/ForgotPassword">
                    <motion.span 
                      whileHover={{ x: 3 }}
                      className="text-[10px] sm:text-xs text-neutral-400 hover:text-ai-teal-400 transition-colors inline-flex items-center"
                    >
                      Forgot Password?
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.span>
                  </Link>
                </div>
              </div>

              {/* Signup Link - updated hover color */}
              <div className="text-center text-[10px] sm:text-sm pt-1 sm:pt-2">
                <p className="text-neutral-500">Don't have an account?{' '}
                  <Link href='/Signup'>
                    <motion.span 
                      whileHover={{ color: "#5EEAD4" }}
                      className="text-ai-teal-400 hover:text-teal-300 transition-colors"
                    >
                      Create Account
                    </motion.span>
                  </Link>
                </p>
              </div>

              {/* Divider */}
              <div className="relative my-4 sm:my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-800"></div>
                </div>
                <div className="relative flex justify-center text-[10px] sm:text-xs">
                  <span className="px-2 bg-neutral-900 text-neutral-500">Or continue with</span>
                </div>
              </div>

              {/* Social Logins - enhanced spacing */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={loginWithGoogle}
                  type="button"
                  disabled={loading}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg transition-all duration-300 group disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden"
                >
                  <div className="flex items-center justify-center space-x-1.5 sm:space-x-2 relative z-10">
                    <IconBrandGoogle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-300 group-hover:text-white transition-colors" />
                    <span className="text-[10px] sm:text-xs md:text-sm text-neutral-300 group-hover:text-white transition-colors">Google</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4285F4]/20 to-[#4285F4]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <BottomGradient />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={loginWithGithub}
                  type="button"
                  disabled={loading}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg transition-all duration-300 group disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden"
                >
                  <div className="flex items-center justify-center space-x-1.5 sm:space-x-2 relative z-10">
                    <IconBrandGithub className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-300 group-hover:text-white transition-colors" />
                    <span className="text-[10px] sm:text-xs md:text-sm text-neutral-300 group-hover:text-white transition-colors">GitHub</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#333]/20 to-[#333]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <BottomGradient />
                </motion.button>
              </div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-ai-teal-500 to-transparent" />
      <span className="group-hover:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-ai-blue-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default Login;