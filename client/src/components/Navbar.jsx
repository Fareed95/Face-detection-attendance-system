"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from 'next-auth/react';
import { useUserContext } from '@/app/context/Userinfo';
import { motion, AnimatePresence } from "framer-motion";
import img from '../../public/logo.png';
import { useRouter } from "next/navigation";
import GetUserInfo from "./GetUserInfo";
import Image from "next/image";

function Navbar() {
  // State and context
  const { data: session } = useSession();
  const { contextisLoggedIn, contextsetIsLoggedIn, contextsetName, contextsetEmail, contextorganisation, contextsetorganisation } = useUserContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const router = useRouter();
  const [isHomePage, setIsHomePage] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const userDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  
  // Client-side only initialization
  useEffect(() => {
    setMounted(true);
    
    // Check if homepage
    const path = window.location.pathname;
    setIsHomePage(path === '/');
    
    // Set up scroll listener
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Session handling
  useEffect(() => {
    if (session) {
      contextsetIsLoggedIn(true);
      contextsetEmail(session.user.email);
      contextsetName(session.user.name);
    }
  }, [session, contextsetIsLoggedIn, contextsetEmail, contextsetName]);

  // Handle clicks outside the user dropdown and mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false);
      setUserDropdownOpen(false);
    };
    
    router.events?.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events?.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  const toggleMobileMenu = (e) => {
    e.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  // Menu items based on auth state
  const authMenuItems = [
    { label: "Home", href: "/Main", icon: "home" },
    { label: "About", href: "/About", icon: "info" },
    { label: "Community", href: "/ChatRoom/django", icon: "users" },
  ];
  
  const nonAuthMenuItems = [
    { label: "Home", href: "/", icon: "home" },
    { label: "About", href: "/About", icon: "info" },
    { label: "Blog", href: "/Blog", icon: "book" },
  ];
  
  const menuItems = contextisLoggedIn ? authMenuItems : nonAuthMenuItems;

  // Navbar background style based on scroll position
  const getNavbarStyle = () => {
    if (scrollPosition > 20) {
      return "bg-black/85 backdrop-blur-lg shadow-lg";
    } else {
      return isHomePage 
        ? "bg-transparent" 
        : "bg-black/30 backdrop-blur-md";
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.setItem('authToken', "-");
    contextsetIsLoggedIn(false);
    contextsetEmail('');
    contextsetName('');
    contextsetorganisation([]);
    router.push('/');
    setUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
    signOut();
  };

  // Icon components
  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'home':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'users':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'book':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  // Don't render during SSR
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Main Navbar */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getNavbarStyle()}`}
      >
        <GetUserInfo />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3"
              >
                <div className="relative flex items-center justify-center w-9 h-9 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg opacity-70" />
                  <div className="absolute inset-0 bg-black/50 rounded-lg" />
                  <img src={img.src} alt="Literacy" className="relative w-5 h-5 object-contain filter brightness-150" />
                </div>
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-blue-100">
                  Literacy
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {menuItems.map((item) => {
                const isActive = 
                  (item.href === '/' && window.location.pathname === '/') || 
                  (item.href !== '/' && window.location.pathname.startsWith(item.href));
                
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                      className={`px-4 py-2 flex items-center space-x-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive 
                          ? 'text-white bg-white/10' 
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="hidden lg:block">{renderIcon(item.icon)}</span>
                      <span>{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            {/* Auth Section */}
            <div className="flex items-center gap-2 sm:gap-4">
              {contextisLoggedIn ? (
                <div className="flex items-center gap-2 sm:gap-4">
                  {/* User Profile Menu */}
                  <div className="relative" ref={userDropdownRef}>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 px-2 py-1.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10"
                    > 
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <Image 
                            src={session?.user?.image || '/default-avatar.png'} 
                            alt={session?.user?.name || "User"}
                            width={35}
                            height={35}
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <svg className={`w-4 h-4 text-white/70 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.button>
                    
                    {/* User Dropdown */}
                    <AnimatePresence>
                      {userDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-64 bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden z-50"
                        >
                          <div className="px-4 py-3 border-b border-gray-700/50">
                            <p className="text-sm font-bold text-white">{session?.user?.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5 truncate">{session?.user?.email}</p>
                          </div>
                          <div className="py-2">
                            <button
                              onClick={() => {
                                setUserDropdownOpen(false);
                                contextorganisation.length !== 0
                                  ? router.push("/organization/dashboard")
                                  : router.push(`/UserInfo/${session?.user?.email}`);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors flex items-center"
                            >
                              <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              View Profile
                            </button>
                            <button
                              onClick={handleLogout}
                              className="w-full px-4 py-2.5 text-left text-sm text-rose-300 hover:text-rose-200 hover:bg-rose-900/20 transition-colors flex items-center"
                            >
                              <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/Signup" className="hidden sm:block">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors"
                    >
                      Sign Up
                    </motion.button>
                  </Link>
                  <Link href="/Login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg shadow-lg shadow-purple-900/20"
                    >
                      Login
                    </motion.button>
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMobileMenu}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu - Side Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={closeMobileMenu}
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-gray-900/95 backdrop-blur-xl z-50 shadow-2xl"
              ref={mobileMenuRef}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-5 border-b border-gray-800/50">
                  <Link href="/" onClick={closeMobileMenu}>
                    <div className="flex items-center gap-3">
                      <div className="relative flex items-center justify-center w-8 h-8 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg opacity-70" />
                        <div className="absolute inset-0 bg-black/50 rounded-lg" />
                        <img src={img.src} alt="Literacy" className="relative w-4 h-4 object-contain filter brightness-150" />
                      </div>
                      <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-blue-100">
                        Literacy
                      </span>
                    </div>
                  </Link>
                  <button 
                    onClick={closeMobileMenu}
                    className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto py-4">
                  <nav className="px-4 space-y-1">
                    {menuItems.map((item) => {
                      const isActive = 
                        (item.href === '/' && window.location.pathname === '/') || 
                        (item.href !== '/' && window.location.pathname.startsWith(item.href));
                      
                      return (
                        <Link key={item.href} href={item.href} onClick={closeMobileMenu}>
                          <motion.div
                            whileHover={{ x: 4 }}
                            className={`flex items-center px-4 py-3 rounded-lg text-sm ${
                              isActive 
                                ? 'bg-white/10 text-white' 
                                : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <span className="mr-3">{renderIcon(item.icon)}</span>
                            <span className="font-medium">{item.label}</span>
                          </motion.div>
                        </Link>
                      );
                    })}
                  </nav>
                </div>
                
                {/* Footer */}
                <div className="p-4 border-t border-gray-800/50">
                  {contextisLoggedIn ? (
                    <div className="space-y-2">
                      {/* User info */}
                      <div className="flex items-center px-4 py-3 rounded-lg bg-white/5">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              src={session?.user?.image || "/default-avatar.png"}
                              alt={session?.user?.name || "User"}
                              className="object-cover"
                              width={35}
                              height={35}
                            />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-white truncate max-w-[160px]">
                            {session?.user?.name}
                          </div>
                          <div className="text-xs text-white/60 truncate max-w-[160px]">
                            {session?.user?.email}
                          </div>
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            closeMobileMenu();
                            contextorganisation.length !== 0
                              ? router.push("/organization/dashboard")
                              : router.push(`/UserInfo/${session?.user?.email}`);
                          }}
                          className="py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-sm font-medium rounded-lg transition-colors flex items-center justify-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Link 
                        href="/Signup" 
                        onClick={closeMobileMenu}
                        className="py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center"
                      >
                        Sign Up
                      </Link>
                      <Link 
                        href="/Login"
                        onClick={closeMobileMenu}
                        className="py-2.5 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-medium rounded-lg shadow-lg flex items-center justify-center"
                      >
                        Login
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;