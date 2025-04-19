"use client";

import { motion, useAnimation } from 'framer-motion';
import { Send, Bot, User, Sparkles, ChevronRight, Dot } from 'lucide-react';
import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useUserContext } from "@/app/context/Userinfo";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';

const SearchAssistant = forwardRef((props, ref) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [suggestedPrompt, setSuggestedPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const controls = useAnimation();
  const { contextemail } = useUserContext();
  const { toast } = useToast();

  const handlePsychologicalConversation = async (query) => {
    try {
      const response = await fetch('http://localhost:8010/api/psychology_chat_bot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: contextemail,
          user_input: query,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch psychological conversation');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Failed to process request. Please try again.",
      });
      return null;
    }
  };

  const handleMakePrompt = async () => {
    try {
      const response = await fetch('http://localhost:8010/api/make_prompt/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: contextemail,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggested prompt');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Failed to generate prompt. Please try again.",
      });
      return null;
    }
  };

  const handleDeleteConversation = async () => {
    try {
      const response = await fetch('http://localhost:8010/api/delete_conversation/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: contextemail,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete conversation');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Failed to delete conversation. Please try again.",
      });
      return null;
    }
  };

  const simulateBotResponse = async (query) => {
    setIsLoading(true);

    const responseData = await handlePsychologicalConversation(query);

    if (responseData && responseData.bot_response) {
      setMessages((prev) => [
        ...prev,
        {
          content: responseData.bot_response,
          isBot: true,
          timestamp: new Date(),
        },
      ]);
    } else {
      console.error("No response data or invalid response format:", responseData);
    }

    setIsLoading(false);
  };

  const openChat = async (message) => {
    if (message) {
      setMessages((prev) => [
        ...prev,
        { content: message, isBot: false, timestamp: new Date() },
      ]);
      simulateBotResponse(message);
    }
    setIsVisible(true);
    controls.start({ 
      opacity: 1, 
      y: 0, 
      height: "auto", 
      marginTop: "1.5rem",
      marginBottom: "1.5rem",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    });
  };

  const closeChat = async () => {
    setIsVisible(false);
    controls.start({ 
      opacity: 0, 
      y: -10, 
      height: 0, 
      marginTop: 0,
      marginBottom: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    });
  };

  const handlePromptSelection = async (accept) => {
    if (accept) {
      console.log("Prompt accepted:", suggestedPrompt);
      if (ref.current && ref.current.onPromptAccept) {
        console.log("Using ref.current.onPromptAccept");
        await handleDeleteConversation();
        ref.current.onPromptAccept(suggestedPrompt);
        closeChat();
      } else if (props.onPromptAccept) {
        // Fallback to props if ref method isn't set
        console.log("Using props.onPromptAccept");
        await handleDeleteConversation();
        props.onPromptAccept(suggestedPrompt);
        closeChat();
      } else {
        console.error("No prompt accept handler found");
      }
    } else {
      console.log("Prompt declined");
    }
    setSuggestedPrompt(null);
  };

  useImperativeHandle(ref, () => ({
    openChat,
    closeChat,
    onPromptAccept: null
  }));

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
  
    setMessages((prev) => [
      ...prev,
      { content: searchQuery, isBot: false, timestamp: new Date() },
    ]);
  
    setIsLoading(true);
    setSearchQuery('');
  
    await simulateBotResponse(searchQuery);
  
    // Check if the number of user messages (excluding bot responses) is a multiple of 2
    const userMessageCount = messages.filter((msg) => !msg.isBot).length + 1; // +1 for the current message
    
    // Only proceed with prompt suggestion if:
    // 1. User has sent at least 2 messages
    // 2. The count is even (every 2nd message)
    // 3. The current search query is NOT similar to the last suggested prompt
    if (userMessageCount >= 2 && userMessageCount % 2 === 0) {
      const isSimilarToPrompt = suggestedPrompt && 
        searchQuery.toLowerCase().includes(suggestedPrompt.toLowerCase());
      
      if (!isSimilarToPrompt) {
        const promptData = await handleMakePrompt();
        if (promptData && promptData.prompt !== "No") {
          setSuggestedPrompt(promptData.prompt);
        }
      }
    }
  
    setIsLoading(false);
  };

  return (
    <motion.div
      id="search-assistant"
      initial={{ opacity: 0, y: -10, height: 0, marginTop: 0, marginBottom: 0 }}
      animate={controls}
      exit={{ opacity: 0, y: -10, height: 0, marginTop: 0, marginBottom: 0 }}
      className="max-w-4xl mx-auto w-full bg-[#141419]/90 border border-[#2a2a33]/60 rounded-2xl p-6 backdrop-blur-sm shadow-lg overflow-hidden"
      style={{ display: 'block' }}
    >
      {/* Header */}
      <div className="flex items-center space-x-4 pb-4 border-b border-[#2a2a33]/40 mb-4">
        <div className="relative">
          <div className="p-3 bg-[#1a1a20]/80 rounded-xl border border-[#2a2a33]/50">
            <Bot className="w-6 h-6 text-gray-300" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-neutral-500 rounded-full border-2 border-[#141419]" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-white tracking-tight">AI Learning Assistant</h3>
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-pulse" />
            Ready to assist you
          </p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="h-[300px] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-[#2a2a33]/50 scrollbar-track-transparent">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: message.isBot ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${message.isBot ? '' : 'justify-end'} space-x-3`}
          >
            <div className={`max-w-[85%] p-4 ${
              message.isBot
                ? 'bg-neutral-900 border border-[#2a2a33]/40 rounded-2xl rounded-bl-none'
                : 'bg-neutral-900 border border-[#3d1f3e]/40 rounded-2xl rounded-br-none'
            }`}>
              <div className={`flex items-center space-x-2 ${message.isBot ? 'text-gray-400' : 'text-gray-300'} mb-2`}>
                {message.isBot ? (
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    <span className="text-xs font-medium bg-neutral-500 px-2 py-0.5 rounded-full border border-[#2a2a33]/40">Assistant</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="text-xs font-medium bg-neutral-500 px-2 py-0.5 rounded-full border border-[#3d1f3e]/40">You</span>
                  </div>
                )}
                <span className={`text-xs ${message.isBot ? 'text-gray-500' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="text-white leading-relaxed">
                <ReactMarkdown>
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-1 px-4 py-2 bg-[#1a1a20]/70 rounded-full w-max ml-2"
          >
            <Dot className="w-5 h-5 text-gray-400 animate-bounce" />
            <Dot className="w-5 h-5 text-gray-500 animate-bounce delay-100" />
            <Dot className="w-5 h-5 text-gray-600 animate-bounce delay-200" />
          </motion.div>
        )}
      </div>

      {/* Suggested Prompt */}
      {suggestedPrompt && suggestedPrompt !== "No" && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-[#1a1a20]/70 border border-[#2a2a33]/40 rounded-xl"
        >
          <p className="text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#9b4e9f]" />
            <span className="text-sm">Suggested Learning Path:</span>
          </p>
          <p className="text-gray-300 text-sm mb-3 pl-6">{suggestedPrompt}</p>
          <div className="flex space-x-2 pl-6">
            <button
              onClick={() => handlePromptSelection(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#4c0d52] to-[#5c1262] hover:bg-neutral-600 border border-[#6c2972]/30 rounded-xl transition-all duration-200 text-sm font-medium text-white"
            >
              Accept Path
            </button>
            <button
              onClick={() => handlePromptSelection(false)}
              className="px-4 py-2 bg-[#1a1a20]/70 hover:bg-[#1a1a20] border border-[#2a2a33]/40 rounded-xl transition-all duration-200 text-sm font-medium text-gray-300"
            >
              Decline
            </button>
          </div>
        </motion.div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSearch} className="mt-4 relative">
        <div className="flex space-x-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ask me anything about your learning journey..."
            className="w-full px-4 py-3 bg-[#0f0f13]/90 border border-[#2a2a33]/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#3a3a45] text-white placeholder-gray-400 disabled:opacity-50 transition-all duration-200"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 bg-[#4c0d52] hover:bg-[#5c1262] border border-[#6c2972]/30 rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 group"
            disabled={isLoading || !searchQuery.trim()}
          >
            <Send className="w-5 h-5 text-white group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </form>
    </motion.div>
  );
});

SearchAssistant.displayName = 'SearchAssistant';
export default SearchAssistant;