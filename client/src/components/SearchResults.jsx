import { useEffect, useState, useRef } from 'react';
import { Play, FileText, Book, Code, ChevronRight, Clock, Star } from 'lucide-react';
import RoadmapNode from './search/RoadmapNode';
import FlashCard from './search/FlashCard';
import ChatAssistant from './search/ChatAssistant';
import CodePlayground from './search/CodePlayground';
import Resources from './search/Resources';

export default function SearchResults({ query }) {
  const roadmapData = {
    title: "Frontend Development",
    children: [
      {
        title: "Internet",
        type: "main",
        isCompleted: true,
        children: [
          {
            title: "How does the internet work?",
            isCompleted: true,
            isRecommended: true,
          },
          {
            title: "What is HTTP?",
            isCompleted: true,
          },
          {
            title: "Browsers and how they work?",
            isRecommended: true,
          },
          {
            title: "DNS and how it works?",
          },
          {
            title: "What is Domain Name?",
          },
          {
            title: "What is hosting?",
          }
        ]
      },
      {
        title: "HTML",
        type: "main",
        children: [
          {
            title: "Learn the basics",
            isRecommended: true,
          },
          {
            title: "Writing Semantic HTML",
          },
          {
            title: "Forms and Validations",
          },
          {
            title: "Accessibility",
          },
          {
            title: "SEO Basics",
            type: "optional",
          }
        ]
      },
      {
        title: "CSS",
        type: "main",
        children: [
          {
            title: "Learn the basics",
            isRecommended: true,
          },
          {
            title: "Making Layouts",
            isRecommended: true,
          },
          {
            title: "Responsive Design",
          }
        ]
      }
    ]
  };

  const renderRoadmapNodes = (nodes) => {
    return nodes.map((node, index) => (
      <RoadmapNode
        key={index}
        title={node.title}
        type={node.type}
        isCompleted={node.isCompleted}
        isRecommended={node.isRecommended}
        description={node.description}
      >
        {node.children && renderRoadmapNodes(node.children)}
      </RoadmapNode>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Enhanced Roadmap Section */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Frontend Development Roadmap</h2>
              <p className="text-gray-400">Follow this path to become a frontend developer</p>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                <span className="text-sm text-gray-400">Recommended</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-400">Optional</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <span className="text-sm text-gray-400">Main Topic</span>
              </div>
            </div>
          </div>

          {/* Roadmap Container with enhanced styling */}
          <div className="relative">
            <div className="absolute w-px h-full bg-gradient-to-b from-purple-500 to-transparent left-[40px] top-0"></div>
            <div className="space-y-8 relative">
              {renderRoadmapNodes(roadmapData.children)}
            </div>
          </div>
        </section>

        {/* Code Playground Section */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Code Playground</h2>
              <p className="text-gray-400">Test your code and see the results instantly</p>
            </div>
          </div>
          <CodePlayground />
        </section>

        {/* Video Section with new design */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-8">Recommended Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((video) => (
              <div key={video} className="bg-gray-800 rounded-xl overflow-hidden group">
                <div className="relative aspect-video">
                  <img 
                    src={`https://picsum.photos/600/400?random=${video}`}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-8 h-8 text-white" fill="white" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-sm text-white">
                    12:34
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Complete Frontend Development Course</h3>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>3 hours ago</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Flashcards Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-8">Quick Review</h2>
          <FlashCard cards={[
            {
              question: "What is the main purpose of HTML in web development?",
              answer: "HTML (HyperText Markup Language) is the standard markup language used to create and structure content on the web. It defines the meaning and structure of web content through elements and tags."
            },
            {
              question: "What is the box model in CSS?",
              answer: "The CSS box model is a fundamental concept that describes how elements are structured with content, padding, border, and margin areas."
            },
            {
              question: "What is the difference between == and === in JavaScript?",
              answer: "== performs type coercion before comparison, while === compares both value and type without coercion. === is generally preferred for more predictable comparisons."
            }
          ]} />
        </section>

        <div>
            <Resources />
        </div>

        <ChatAssistant />
      </div>
    </div>
  );
} 