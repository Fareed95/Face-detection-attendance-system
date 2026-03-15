'use client'
import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Layout, Copy, Check } from 'lucide-react';

const defaultCode = `// Try your code here
function example() {
  console.log("Hello, World!");
}

example();`;

export default function CodePlayground() {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('');
  const [theme, setTheme] = useState('vs-dark');
  const [copied, setCopied] = useState(false);

  const fallbackCopyToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();

    try {
      return document.execCommand('copy');
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const handleRunCode = () => {
    try {
      // Create a new function from the code string
      const result = [];
      const consoleLog = (...args) => result.push(...args);
      
      // Create a safe environment for code execution
      const runCode = new Function('console', code);
      runCode({ log: consoleLog });
      
      setOutput(result.join('\n'));
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const handleCopyCode = async () => {
    try {
      if (navigator?.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else if (!fallbackCopyToClipboard(code)) {
        throw new Error('Clipboard API unavailable');
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      setOutput('Copy to clipboard is not supported in this browser.');
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden">
      <div className="border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-white">Code Playground</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}
              className="p-2 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            >
              <Layout className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyCode}
              className="p-2 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <button
          onClick={handleRunCode}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center gap-2 transition-colors"
        >
          <Play className="w-4 h-4" />
          Run Code
        </button>
      </div>
      
      <div className="grid grid-cols-2 h-[400px]">
        <div className="border-r border-gray-700">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme={theme}
            value={code}
            onChange={setCode}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 16 },
              scrollBeyondLastLine: false,
            }}
          />
        </div>
        <div className="bg-gray-900 p-4 font-mono text-sm overflow-auto">
          <div className="text-gray-400 mb-2">// Output</div>
          <pre className="text-white">{output}</pre>
        </div>
      </div>
    </div>
  );
} 