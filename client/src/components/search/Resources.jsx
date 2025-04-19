'use client'
import React from 'react'
import { FileText, Book, Code } from 'lucide-react';

const resources = {
  articles: [
    {
      id: 1,
      title: 'Understanding HTML',
      type: 'Article',
      source: 'MDN Web Docs',
      readTime: '5 min read',
    },
    {
      id: 2,
      title: 'HTML Documentation',
      type: 'Documentation',
      source: 'W3Schools',
      readTime: '10 min read',
    },
    {
      id: 3,
      title: 'JavaScript Code Example',
      type: 'Code Example',
      source: 'GitHub',
      readTime: '15 min read',
    },
  ],
};

function Resources() {
  return (
    <div>
          <h2 className="text-2xl font-bold mb-8 text-white before">AI-Curated Resources</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Articles */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">Reading Materials</h3>
              <div className="space-y-4">
                {resources.articles.map(article => (
                  <div 
                    key={article.id}
                    className="p-6 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer text-white"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-indigo-600/20">
                        {article.type === 'Article' ? (
                          <FileText className="w-6 h-6 text-indigo-400" />
                        ) : article.type === 'Documentation' ? (
                          <Book className="w-6 h-6 text-indigo-400" />
                        ) : (
                          <Code className="w-6 h-6 text-indigo-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">{article.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span>{article.source}</span>
                          <span>•</span>
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
    </div>
  )
}

export default Resources
