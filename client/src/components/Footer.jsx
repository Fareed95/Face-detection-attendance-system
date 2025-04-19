import React from 'react';
import Image from 'next/image';
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { LinkPreview } from "@/components/ui/link-preview";
import FareedImage from "../../public/Fareed.jpg";
import { Github, Linkedin, Twitter, Mail, MapPin, ChevronRight, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

function Footer() {
  const people = [
    {
      id: 1,
      name: "Nitin Gupta",
      designation: "UI/UX Designer & Frontend Developer",
      image: "https://avatars.githubusercontent.com/u/140688515?s=400&u=2c964b96bb84104da1515a863e6425e70063d854&v=4",
      github: "https://github.com/nitin14gupta",
    },
    {
      id: 2,
      name: "Fareed Sayyed",
      designation: "ML and Backend Developer",
      image: FareedImage,
      github: "https://github.com/Fareed95",
    },
    {
      id: 3,
      name: "Rehbar Khan",
      designation: "Frontend Developer",
      image: "https://avatars.githubusercontent.com/u/136853370?v=4",
      github: "https://github.com/thisisarsh1",
    }
  ];

  const services = [
    { name: "Learning Paths", href: "/" },
    { name: "AI Interview", href: "/" },
    { name: "Portfolio Builder", href: "/" },
    { name: "Career Guidance", href: "/" },
    { name: "Skill Assessment", href: "/" },
  ];

  const resources = [
    { name: "Documentation", href: "/" },
    { name: "Blog", href: "/" },
    { name: "Case Studies", href: "/" },
    { name: "Help Center", href: "/" },
    { name: "API Reference", href: "/" },
  ];

  const company = [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/" },
    { name: "Press Kit", href: "/" },
    { name: "Contact", href: "/" },
  ];

  const legal = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/" },
    { name: "GDPR", href: "/" },
  ];

  const footerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <footer className="relative overflow-hidden z-100">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-ai-blue-900/5 to-black -z-10" />
      <div className="absolute inset-0 bg-grid-small-white/[0.05] -z-10" />
      <div className="absolute inset-0 bg-dot-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] -z-10" />
      
      {/* Animated gradient blobs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1],
          rotate: [0, 10, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[400px] lg:w-[500px] h-[300px] md:h-[400px] lg:h-[500px] rounded-full bg-ai-blue-500/5 blur-[120px] -z-5"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.1, 0.15, 0.1],
          scale: [1, 1.1, 1],
          rotate: [0, -10, 0]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute bottom-0 right-1/4 transform translate-x-1/2 w-[250px] md:w-[300px] lg:w-[400px] h-[250px] md:h-[300px] lg:h-[400px] rounded-full bg-ai-teal-500/5 blur-[100px] -z-5"
      />
      
      {/* Main content */}
      <div className="border-t border-white/5">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={footerVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16 pb-4 sm:pb-6 lg:pb-8"
        >
          {/* Upper section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-8 sm:pb-12 lg:pb-16">
            {/* Company Info */}
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-2 space-y-6 sm:space-y-8"
            >
              <div className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-ai-blue-500/50 to-ai-teal-500/50 rounded-full opacity-0 group-hover:opacity-70 blur transition-all duration-500"></div>
                  <div className="relative">
                    <Image
                      src="/logo.png"
                      alt="Ape Logo"
                      width={36}
                      height={36}
                      className="sm:w-[42px] sm:h-[42px] lg:w-[48px] lg:h-[48px] relative transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    />
                  </div>
                </div>
                <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400 transition-all duration-300 group-hover:from-ai-blue-400 group-hover:to-ai-teal-400 font-heading">
                  Ape
                </span>
              </div>
              
              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-md font-sans">
                Empowering learners worldwide through innovative AI-driven education solutions. Transform your learning journey with personalized paths and expert guidance.
              </p>
              
              <div className="flex items-center gap-4 sm:gap-5">
                <a href="#" className="transform transition-all duration-300 hover:scale-110">
                  <motion.div 
                    whileHover={{ scale: 1.1, y: -3 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-ai-blue-500/50 to-ai-teal-500/50 rounded-full opacity-0 group-hover:opacity-70 blur-sm transition-opacity duration-300"></div>
                    <Github className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-300 group-hover:text-white relative z-10" />
                  </motion.div>
                </a>
                <a href="#" className="transform transition-all duration-300 hover:scale-110">
                  <motion.div 
                    whileHover={{ scale: 1.1, y: -3 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-ai-blue-500/50 to-ai-teal-500/50 rounded-full opacity-0 group-hover:opacity-70 blur-sm transition-opacity duration-300"></div>
                    <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-300 group-hover:text-white relative z-10" />
                  </motion.div>
                </a>
                <a href="#" className="transform transition-all duration-300 hover:scale-110">
                  <motion.div 
                    whileHover={{ scale: 1.1, y: -3 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-ai-blue-500/50 to-ai-teal-500/50 rounded-full opacity-0 group-hover:opacity-70 blur-sm transition-opacity duration-300"></div>
                    <Twitter className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-300 group-hover:text-white relative z-10" />
                  </motion.div>
                </a>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <motion.div 
                  whileHover={{ x: 3 }}
                  className="flex items-center gap-3 group"
                >
                  <div className="p-1.5 sm:p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-ai-teal-400" />
                  </div>
                  <a href="mailto:contact@Ape.ai" className="text-sm sm:text-base text-neutral-400 group-hover:text-white transition-colors font-sans">
                    contact@Ape.ai
                  </a>
                </motion.div>
                
                <motion.div 
                  whileHover={{ x: 3 }}
                  className="flex items-center gap-3 group"
                >
                  <div className="p-1.5 sm:p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-ai-teal-400" />
                  </div>
                  <span className="text-sm sm:text-base text-neutral-400 group-hover:text-white transition-colors font-sans">
                    Mumbai, India
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Quick links sections */}
            <motion.div 
              variants={itemVariants}
              className="space-y-4 sm:space-y-6"
            >
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-ai-blue-500 to-ai-teal-500 font-heading">
                Services
              </h3>
              <ul className="space-y-2 sm:space-y-4">
                {services.map((item, index) => (
                  <motion.li 
                    key={item.name}
                    variants={listItemVariants}
                    custom={index}
                  >
                    <Link href={item.href} className="group flex items-center">
                      <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-ai-blue-500 opacity-0 -ml-4 mr-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      <span className="text-xs sm:text-sm text-neutral-400 hover:text-white transition-all duration-300 font-sans">
                        {item.name}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="space-y-4 sm:space-y-6"
            >
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-ai-blue-500 to-ai-teal-500 font-heading">
                Resources
              </h3>
              <ul className="space-y-2 sm:space-y-4">
                {resources.map((item, index) => (
                  <motion.li 
                    key={item.name}
                    variants={listItemVariants}
                    custom={index}
                  >
                    <Link href={item.href} className="group flex items-center">
                      <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-ai-blue-500 opacity-0 -ml-4 mr-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      <span className="text-xs sm:text-sm text-neutral-400 hover:text-white transition-all duration-300 font-sans">
                        {item.name}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="space-y-4 sm:space-y-6"
            >
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-ai-blue-500 to-ai-teal-500 font-heading">
                Company
              </h3>
              <ul className="space-y-2 sm:space-y-4">
                {company.map((item, index) => (
                  <motion.li 
                    key={item.name}
                    variants={listItemVariants}
                    custom={index}
                  >
                    <Link href={item.href} className="group flex items-center">
                      <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-ai-blue-500 opacity-0 -ml-4 mr-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      <span className="text-xs sm:text-sm text-neutral-400 hover:text-white transition-all duration-300 font-sans">
                        {item.name}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="space-y-4 sm:space-y-6"
            >
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-ai-blue-500 to-ai-teal-500 font-heading">
                Legal
              </h3>
              <ul className="space-y-2 sm:space-y-4">
                {legal.map((item, index) => (
                  <motion.li 
                    key={item.name}
                    variants={listItemVariants}
                    custom={index}
                  >
                    <Link href={item.href} className="group flex items-center">
                      <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-ai-blue-500 opacity-0 -ml-4 mr-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      <span className="text-xs sm:text-sm text-neutral-400 hover:text-white transition-all duration-300 font-sans">
                        {item.name}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
          
          {/* Team section */}
          <motion.div 
            variants={itemVariants}
            className="border-t border-white/5 pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8"
          >
            <h3 className="text-center text-xs sm:text-sm font-semibold uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-ai-blue-500 to-ai-teal-500 mb-4 sm:mb-6">
              Our Team
            </h3>
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
              {people.map((person) => (
                <motion.div
                  key={person.id}
                  whileHover={{ y: -5 }}
                  className="text-center group"
                >
                  <div className="relative inline-block">
                    <div className="absolute -inset-1 bg-gradient-to-r from-ai-blue-500/30 to-ai-teal-500/30 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500"></div>
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-ai-blue-500/50 transition-all duration-300">
                      <Image
                        src={person.image}
                        alt={person.name}
                        fill
                        sizes="(max-width: 768px) 56px, 64px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-3">
                    <h4 className="text-xs sm:text-sm font-medium text-white">{person.name}</h4>
                    <p className="text-[10px] sm:text-xs text-neutral-400 mt-0.5 sm:mt-1">{person.designation}</p>
                    <a 
                      href={person.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-ai-blue-400 hover:text-ai-blue-300 transition-colors"
                    >
                      <Github className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" /> GitHub
                      <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-1" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Bottom bar */}
          <motion.div 
            variants={itemVariants}
            className="border-t border-white/5 pt-4 sm:pt-6 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4"
          >
            <div className="text-neutral-500 text-[10px] sm:text-xs">
              &copy; {new Date().getFullYear()} Ape AI Education. All rights reserved.
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.button 
                whileHover={{ y: -2 }}
                className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              >
                Cookie Settings
              </motion.button>
              
              <motion.button 
                whileHover={{ y: -2 }}
                className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              >
                Do Not Sell My Info
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;