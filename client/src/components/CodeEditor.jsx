import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import Monaco Editor
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
    </div>
  ),
});

const CodeEditor = ({ isOpen, onClose, socket, room, userName, userId }) => {
  const [editorContent, setEditorContent] = useState('');
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const defaultCode = `// Example JavaScript code
// Let's calculate the sum of numbers from 1 to 10
let sum = 0;
for (let i = 1; i <= 10; i++) {
    sum += i;
    console.log(\`After adding \${i}, sum is \${sum}\`);
}
console.log('Final sum:', sum);

// Try array operations
const numbers = [1, 2, 3, 4, 5];
const squares = numbers.map(n => n * n);
console.log('\\nSquares:', squares);

// Try string manipulation
const text = "Hello, JavaScript!";
console.log('\\nOriginal:', text);
console.log('Reversed:', text.split('').reverse().join(''));`;

  // Initialize editor content
  useEffect(() => {
    setEditorContent(defaultCode);
  }, []);

  const executeCode = async () => {
    setIsExecuting(true);
    setOutput(''); // Clear previous output

    try {
      const logs = [];
      const originalConsoleLog = console.log;
      
      // Override console.log to capture output
      console.log = (...args) => {
        logs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      };

      // Execute the code
      new Function(editorContent)();

      // Restore console.log
      console.log = originalConsoleLog;

      const result = logs.join('\\n');
      setOutput(result);

      // Emit the output to other participants
      if (socket) {
        socket.emit('codeOutput', {
          room,
          output: result,
          user: { name: userName, id: userId }
        });
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Handle editor content changes
  const handleEditorChange = (value) => {
    setEditorContent(value);
    
    // Emit the changes to other participants
    if (socket) {
      socket.emit('codeChange', {
        room,
        content: value,
        user: { name: userName, id: userId }
      });
    }
  };

  // Add keyboard shortcut for code execution
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        executeCode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editorContent]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-x-0 top-16 bottom-20 z-50 mx-auto max-w-5xl px-4"
    >
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 shadow-xl overflow-hidden flex flex-col h-full">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">JavaScript Editor</h3>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={executeCode}
              disabled={isExecuting}
              className="px-4 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-500 border border-cyan-500/50 hover:bg-cyan-500/30 transition-colors flex items-center gap-2"
            >
              {isExecuting ? (
                <>
                  <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <span className="text-sm">Run</span>
                  <span className="text-xs opacity-60">⌘R</span>
                </>
              )}
            </motion.button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 min-h-0 flex">
          <div className="w-3/5 border-r border-neutral-800">
            <MonacoEditor
              height="100%"
              language="javascript"
              theme="vs-dark"
              value={editorContent}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                lineNumbers: 'on',
                roundedSelection: false,
                padding: { top: 16, bottom: 16 },
                cursorStyle: 'line',
                tabSize: 2,
                wordWrap: 'on',
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
          </div>
          <div className="w-2/5 bg-neutral-950/50 p-4 font-mono text-sm overflow-auto">
            <div className="text-neutral-400 mb-2">Output:</div>
            <div className="whitespace-pre-wrap font-mono">
              {isExecuting ? (
                <div className="flex items-center gap-2 text-cyan-500">
                  <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Running code...</span>
                </div>
              ) : (
                output || 'Run your code to see the output here...'
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CodeEditor;