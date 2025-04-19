"use client";

import { useEffect, useState, useRef } from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { useUserContext } from "@/app/context/Userinfo";
import Timeline_roadmap_function from "./Timeline_roadmap";
import { MultiStepLoader } from "./ui/multi-step-loader";
import { motion, AnimatePresence } from "framer-motion";
import SearchAssistant from "@/components/SearchAssistant";
import { useToast } from "@/hooks/use-toast";
import { Search, Sparkles, Code, BookOpen, Database, Cloud, Shield, ArrowRight, TrendingUp } from "lucide-react";

function MainInput() {
  const [inputValue, setInputValue] = useState("");
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [activeTopics, setActiveTopics] = useState([]);
  const [inputFocused, setInputFocused] = useState(false);

  const { contextemail, contextisLoggedIn, contextsetRoadmap, contextsetFirstRoadmap } = useUserContext();
  const searchAssistantRef = useRef(null);
  const { toast } = useToast();

  const MODEL_API_SERVER = process.env.NEXT_PUBLIC_MODEL_API_SERVER;

  const loadingStates = [
    { text: "Analyzing your learning goals..." },
    { text: "Identifying key concepts and skills..." },
    { text: "Structuring your personalized roadmap..." },
    { text: "Gathering learning resources..." },
    { text: "Finalizing your learning path..." },
  ];

  const popularTopics = [
    { id: 1, name: "Web Development", icon: "🌐" },
    { id: 2, name: "Data Science", icon: "📊" },
    { id: 3, name: "AI/ML", icon: "🤖" },
    { id: 4, name: "Cloud Computing", icon: "☁️" },
    { id: 5, name: "Cybersecurity", icon: "🔒" }
  ];

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleTopicClick = (topic) => {
    setInputValue(topic.name);
    setTriggerSearch(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!contextisLoggedIn) {
      toast({
        variant: "destructive",
        title: "Please Login to use this Feature",
      });
      return;
    }

    if (!inputValue || !contextemail || !MODEL_API_SERVER) return;

    setLoading(true);
    setRoadmapData(null);

    const MAX_RETRIES = 5;
    let attempts = 0;
    let success = false;

    while (attempts < MAX_RETRIES && !success) {
      try {
        const isResponse = await fetch(`${MODEL_API_SERVER}/is-response`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: inputValue,
          }),
        });

        if (!isResponse.ok) {
          throw new Error(`HTTP error! Status: ${isResponse.status}`);
        }

        const isResponseData = await isResponse.json();
        console.log("is-response data:", isResponseData);

        if (isResponseData.response === "yes") {
          const roadmapResponse = await fetch(
            `${MODEL_API_SERVER}/generate-roadmap-first-component`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                input_value: inputValue,
                email: contextemail,
              }),
            }
          );

          if (!roadmapResponse.ok) {
            throw new Error("Failed to generate roadmap");
          }

          const roadmapData = await roadmapResponse.json();
          setRoadmapData(roadmapData);
          contextsetFirstRoadmap(roadmapData);

          console.log("Roadmap data loaded successfully:", roadmapData);
          success = true;
        } else {
          console.log("Response is not yes");
          if (searchAssistantRef.current) {
            searchAssistantRef.current.openChat(inputValue);
          }
          success = true;
        }
      } catch (error) {
        console.error(`Attempt ${attempts + 1} failed:`, error);
        attempts++;
        if (attempts >= MAX_RETRIES) {
          console.error("Max retries reached. Failed to process request.");
          toast({
            variant: "destructive",
            title: "Failed to process request. Please try again.",
          });
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } finally {
        if (success || attempts >= MAX_RETRIES) {
          setLoading(false);
        }
      }
    }
  };

  const handleSuggestedPrompt = (prompt) => {
    console.log("MainInput received prompt:", prompt);
    setInputValue(prompt); // Update the input value
    setTriggerSearch(true); // Trigger the search process
  };

  // Use useEffect to trigger search after inputValue is updated
  useEffect(() => {
    if (triggerSearch) {
      console.log("Triggering search with:", inputValue);
      onSubmit({ preventDefault: () => {} }); // Trigger the search process
      setTriggerSearch(false); // Reset the trigger
    }
  }, [triggerSearch]);

  useEffect(() => {
    if (!roadmapData?.roadmap_id) return;

    let isMounted = true;

    const fetchFullRoadmap = async () => {
      const MAX_RETRIES = 5;
      let attempts = 0;
      let success = false;

      while (attempts < MAX_RETRIES && !success && isMounted) {
        const controller = new AbortController();
        try {
          console.log(
            "Sending request to generate-roadmap-all for roadmap_id:",
            roadmapData.roadmap_id
          );

          const response = await fetch(`${MODEL_API_SERVER}/generate-roadmap-all`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: roadmapData.roadmap_id }),
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Roadmap all generated successfully:", data);
          success = true;

          contextsetRoadmap(data);

        } catch (error) {
          if (error.name === "AbortError") {
            console.warn("Fetch aborted. Component unmounted or request canceled.");
            return;
          }
          console.error(`Attempt ${attempts + 1} failed:`, error);
          attempts++;
          if (attempts >= MAX_RETRIES) {
            console.error("Max retries reached. Failed to generate full roadmap.");
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    };

    fetchFullRoadmap();

    return () => {
      isMounted = false;
    };
  }, [roadmapData]);

  // Attach the onPromptAccept handler to the SearchAssistant ref
  useEffect(() => {
    if (searchAssistantRef.current) {
      searchAssistantRef.current.onPromptAccept = handleSuggestedPrompt;
    }
  }, [searchAssistantRef]);

  return (
    <div className="max-w-4xl mx-auto w-full px-3 sm:px-4">
      <motion.div
        className="relative overflow-hidden backdrop-blur-lg shadow-xl border border-purple-500/10 rounded-xl sm:rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "linear-gradient(to bottom, rgba(26, 26, 36, 0.95), rgba(15, 15, 21, 0.95))"
        }}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-700/10 rounded-full blur-3xl" />
          <div className="absolute top-40 -left-24 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl" />
        </div>

        <div className="p-5 sm:p-6 md:p-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-4 sm:mb-6 text-center"
          >
            <div className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 mb-3 sm:mb-4">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5 sm:mr-2" />
              <span className="text-xs sm:text-sm font-medium">AI-Powered Learning</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300 mb-1.5 sm:mb-2 font-heading">Discover Your Learning Path</h2>
            <p className="text-sm sm:text-base text-gray-400 font-sans">Tell us what you want to learn, and we'll create a personalized roadmap for you</p>
          </motion.div>

          <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-3 sm:gap-4 relative z-10">
            <div className="flex-1 relative group">
              <div className={`absolute inset-0 rounded-lg sm:rounded-xl transition-opacity duration-300 ${inputFocused ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 blur-md"/>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-3 sm:left-4">
                  <Search className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 ${inputFocused ? 'text-purple-400' : 'text-gray-500'}`} />
                </div>
                <input
                  type="text"
                  placeholder="Tell us what you want to learn..."
                  value={inputValue}
                  onChange={handleChange}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="w-full bg-[#0f0f13]/90 text-white placeholder-gray-400 border border-[#2a2a33] focus:border-purple-500/50 rounded-lg sm:rounded-xl text-sm sm:text-base pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all duration-300 font-sans shadow-inner shadow-black/20"
                />
              </div>
            </div>
            
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`bg-gradient-to-r from-[#4c0d52] to-[#3a0d94] hover:from-[#5c1262] hover:to-[#4a1da4] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl border border-[#6c2972]/30 transition-all duration-300 font-medium shadow-lg shadow-purple-900/20 font-sans ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                    <span className="text-sm sm:text-base">Creating...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm sm:text-base">Explore</span>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.div>
                  </>
                )}
              </div>
            </motion.button>
          </form>
          
          <motion.div 
            className="mt-6 sm:mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent"></div>
              <p className="text-xs sm:text-sm text-gray-400 px-2 sm:px-3 font-sans">Popular topics</p>
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent"></div>
            </div>
            
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
              {popularTopics.map(topic => (
                <motion.button
                  key={topic.id}
                  onClick={() => handleTopicClick(topic)}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-2 sm:px-4 sm:py-2.5 bg-[#1a1a24]/70 hover:bg-[#2a2a38]/50 border border-[#2a2a33]/50 hover:border-purple-500/30 rounded-md sm:rounded-lg text-xs sm:text-sm text-gray-300 hover:text-white transition-all duration-200 flex items-center gap-1.5 sm:gap-2 group font-sans backdrop-blur-md"
                >
                  <span className="p-1 sm:p-1.5 rounded-md bg-purple-900/30 text-purple-300 group-hover:scale-110 transition-transform">
                    {topic.icon}
                  </span>
                  {topic.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {loading && (
        <div className="fixed inset-0 z-50">
          <MultiStepLoader
            loadingStates={loadingStates}
            loading={loading}
            duration={1000}
            loop={true}
          />
        </div>
      )}

      {roadmapData && !loading && (
        <motion.div 
          className="mt-8 sm:mt-12 w-full p-4 sm:p-6 rounded-lg sm:rounded-xl bg-black/30 border border-purple-500/10 backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 sm:mb-6 flex items-center">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mr-2" />
            <h3 className="text-lg sm:text-xl font-bold text-white">Your Learning Roadmap</h3>
          </div>
          <Timeline_roadmap_function roadmapData={roadmapData} />
        </motion.div>
      )}

      <SearchAssistant 
        ref={searchAssistantRef} 
        onPromptAccept={handleSuggestedPrompt}
      />
    </div>
  );
}

export default MainInput;