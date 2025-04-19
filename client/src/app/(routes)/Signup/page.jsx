"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserContext } from '@/app/context/Userinfo';
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";

function SignUp() {
  const { contextsetEmail, contextsetPassword, contextsetName } = useUserContext();
  const { data: session } = useSession();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  useEffect(() => {
    setName(`${firstname} ${lastname}`);
  }, [firstname, lastname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirm_password) {
      toast({
        title: "Passwords don't match",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirm_password,
          is_company: false // Regular user account
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register');
      }

      const result = await response.json();

      contextsetEmail(email);
      contextsetPassword(password);
      
      toast({
        title: "Registration successful",
        description: "Please verify your email"
      });
      
      router.push('/OTP');

    } catch (error) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  async function loginWithGoogle() {
    setLoading(true);
    try {
      await signIn('google');
    } catch (error) {
      toast({
        title: "Google login failed",
        description: error.message,
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
        title: "GitHub login failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (session) {
      contextsetEmail(session.user.email);
      contextsetName(session.user.name);
      router.push('/');
    }
  }, [session]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 to-black p-4 sm:p-6 md:p-8">
      {/* Animated background elements */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 overflow-hidden z-0"
      >
        {/* Gradient orbs - updated to match organization signup */}
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
                Create Account
              </h1>
              
            </motion.div>

            {/* Organization Button - updated colors to match organization signup */}
            <motion.div variants={itemVariants}>
              <Link href="/OrganizationSignup">
                <button className="w-full py-2 sm:py-2.5 px-3 sm:px-4 mb-5 sm:mb-6 bg-gradient-to-r from-ai-blue-600/60 to-ai-teal-700/60 hover:from-ai-blue-600 hover:to-ai-teal-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-ai-blue-600/10 relative overflow-hidden group">
                  <span className="relative z-10">Continue as Organization</span>
                  {/* Button shine effect */}
                  <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine" />
                </button>
              </Link>
            </motion.div>

            {/* Sign Up Form - enhanced responsive spacing */}
            <motion.form 
              variants={itemVariants}
              className="space-y-3 sm:space-y-4"
              onSubmit={handleSubmit}
            >
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <LabelInputContainer className="space-y-1 sm:space-y-1.5">
                  <Label htmlFor="firstname" className="text-neutral-300 text-xs sm:text-sm">First Name</Label>
                  <Input
                    id="firstname"
                    placeholder="John"
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-neutral-800/50 border border-neutral-700/50 focus:border-ai-teal-500/50 rounded-lg text-neutral-200 placeholder-neutral-500 focus:ring-2 focus:ring-ai-teal-500/20 transition-all duration-300 text-xs sm:text-sm"
                    required
                  />
                </LabelInputContainer>

                <LabelInputContainer className="space-y-1 sm:space-y-1.5">
                  <Label htmlFor="lastname" className="text-neutral-300 text-xs sm:text-sm">Last Name</Label>
                  <Input
                    id="lastname"
                    placeholder="Doe"
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-neutral-800/50 border border-neutral-700/50 focus:border-ai-teal-500/50 rounded-lg text-neutral-200 placeholder-neutral-500 focus:ring-2 focus:ring-ai-teal-500/20 transition-all duration-300 text-xs sm:text-sm"
                    required
                  />
                </LabelInputContainer>
              </div>

              {/* Email Field */}
              <LabelInputContainer className="space-y-1 sm:space-y-1.5">
                <Label htmlFor="email" className="text-neutral-300 text-xs sm:text-sm">Email Address</Label>
                <Input
                  id="email"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-neutral-800/50 border border-neutral-700/50 focus:border-ai-teal-500/50 rounded-lg text-neutral-200 placeholder-neutral-500 focus:ring-2 focus:ring-ai-teal-500/20 transition-all duration-300 text-xs sm:text-sm"
                  required
                />
              </LabelInputContainer>

              {/* Password Fields */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <LabelInputContainer className="space-y-1 sm:space-y-1.5">
                  <Label htmlFor="password" className="text-neutral-300 text-xs sm:text-sm">Password</Label>
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-neutral-800/50 border border-neutral-700/50 focus:border-ai-teal-500/50 rounded-lg text-neutral-200 placeholder-neutral-500 focus:ring-2 focus:ring-ai-teal-500/20 transition-all duration-300 text-xs sm:text-sm"
                    required
                  />
                </LabelInputContainer>

                <LabelInputContainer className="space-y-1 sm:space-y-1.5">
                  <Label htmlFor="confirm_password" className="text-neutral-300 text-xs sm:text-sm">Confirm</Label>
                  <Input
                    id="confirm_password"
                    placeholder="••••••••"
                    type="password"
                    value={confirm_password}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-neutral-800/50 border border-neutral-700/50 focus:border-ai-teal-500/50 rounded-lg text-neutral-200 placeholder-neutral-500 focus:ring-2 focus:ring-ai-teal-500/20 transition-all duration-300 text-xs sm:text-sm"
                    required
                  />
                </LabelInputContainer>
              </div>

              {/* Submit Button - updated colors to match organization signup */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-ai-blue-600 to-ai-teal-600 hover:from-ai-blue-500 hover:to-ai-teal-500 text-white rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 shadow-lg shadow-ai-blue-600/20 mt-1 sm:mt-2 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                    <span className="text-xs sm:text-sm">Creating account...</span>
                  </div>
                ) : (
                  <span className="relative z-10">Create Account</span>
                )}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine" />
                <BottomGradient />
              </motion.button>

              {/* Login Link - updated colors to match organization signup */}
              <div className="text-center text-[10px] sm:text-sm pt-1 sm:pt-2">
                <p className="text-neutral-500">Already have an account?{' '}
                  <Link href="/Login">
                    <motion.span 
                      whileHover={{ color: "#5EEAD4" }}
                      className="text-ai-teal-400 hover:text-teal-300 transition-colors"
                    >
                      Sign In
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
                  <span className="px-2 bg-neutral-900/80 text-neutral-500">Or continue with</span>
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

const BottomGradient = () => (
  <>
    <span className="group-hover:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-ai-teal-500 to-transparent" />
    <span className="group-hover:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-ai-blue-500 to-transparent" />
  </>
);

const LabelInputContainer = ({ children, className }) => (
  <div className={`flex flex-col space-y-2 w-full ${className}`}>
    {children}
  </div>
);

export default SignUp;
