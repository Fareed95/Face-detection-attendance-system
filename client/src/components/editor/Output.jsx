"use client"
import { useState } from "react";
import { executeCode } from "@/app/api/editor/api";
import { useRouter, usePathname } from "next/navigation";
import { Play, Send, Loader2, Terminal, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Output = ({ editorRef, language, hideSubmit = false, onRun, className = '' }) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isVideoCallPage = pathname.startsWith('/VideoCall/');

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    
    try {
      setIsLoading(true);
      setIsSuccess(false);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      
      if (result.stderr) {
        setIsError(true);
        setIsSuccess(false);
      } else {
        setIsError(false);
        setIsSuccess(true);
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
      setIsSuccess(false);
      setOutput([error.message || "Unable to run code"]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const sourceCode = editorRef.current.getValue();
      if (!sourceCode) return;

      await runCode();

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `${language}_${timestamp}.txt`;
      const blob = new Blob([sourceCode], { type: 'text/plain' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      const formData = new FormData();
      formData.append('file', blob, fileName);
      
      const response = await fetch('/api/savelog', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to save log file');
      }

      router.push(`/coding/results?status=completed`);
    } catch (error) {
      console.error('Error saving code:', error);
      setIsError(true);
      setOutput(['Failed to save code file']);
    }
  };

  return (
    <div className={`${className} flex flex-col`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center text-sm sm:text-base text-neutral-200 font-medium">
          <Terminal className="w-4 h-4 mr-2 text-blue-400" />
          <span>Output</span>
        </div>
        <div className="flex gap-1.5 sm:gap-2">
          <motion.button
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 text-sm font-medium
              ${isLoading 
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-inner shadow-blue-950/20' 
                : isSuccess
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-inner shadow-emerald-950/20'
                  : 'bg-gradient-to-r from-blue-900/40 to-cyan-900/40 hover:from-blue-800/40 hover:to-cyan-800/40 text-blue-300 border-blue-700/50 shadow-sm shadow-blue-950/30'
              }`}
            disabled={isLoading}
            onClick={runCode}
            data-run-button
            whileHover={!isLoading ? { y: -1, scale: 1.02 } : {}}
            whileTap={!isLoading ? { y: 0, scale: 0.98 } : {}}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Running...</span>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Run Again</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Run</span>
                <span className="hidden sm:inline text-xs opacity-70 bg-white/10 px-1.5 py-0.5 rounded ml-1">⌘R</span>
              </>
            )}
          </motion.button>
          
          {!hideSubmit && !isVideoCallPage && (
            <motion.button
              className="px-2.5 sm:px-3 py-1.5 rounded-lg border transition-all bg-gradient-to-r from-purple-900/40 to-blue-900/40 hover:from-purple-800/40 hover:to-blue-800/40 text-purple-300 border-purple-700/50 shadow-sm shadow-purple-950/30 text-sm font-medium flex items-center gap-1.5"
              onClick={handleSubmit}
              disabled={isLoading}
              whileHover={!isLoading ? { y: -1, scale: 1.02 } : {}}
              whileTap={!isLoading ? { y: 0, scale: 0.98 } : {}}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit</span>
            </motion.button>
          )}
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={isError ? 'error' : 'standard'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`flex-1 p-3 sm:p-4 font-mono text-xs sm:text-sm rounded-xl border backdrop-blur-sm overflow-auto relative
            ${isError 
              ? 'border-red-500/50 bg-red-500/10 text-red-400 shadow-inner shadow-red-950/10' 
              : isSuccess && output
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100 shadow-inner shadow-emerald-950/10'
                : 'border-neutral-700/80 bg-black/50 text-neutral-200 shadow-inner shadow-black/20'
            }`}
        >
          {isError && (
            <div className="absolute top-2 right-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
          
          {isSuccess && output && (
            <div className="absolute top-2 right-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
          
          {output ? (
            <>
              <div className="mb-2 text-xs opacity-70">
                {isError 
                  ? 'Execution failed with errors:' 
                  : isSuccess 
                    ? 'Execution completed successfully:' 
                    : 'Output:'}
              </div>
              {output.map((line, i) => (
                <motion.div 
                  key={i} 
                  className="whitespace-pre-wrap mb-0.5 sm:mb-1 pl-2 border-l-2 border-l-neutral-700/50"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.2 }}
                >
                  {line || ' '}
                </motion.div>
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-neutral-400 space-y-3">
              <Terminal className="w-10 h-10 opacity-30" />
              <div className="text-center">
                <p>Click "Run" to see the output here</p>
                <p className="text-xs opacity-70 mt-1">Your code execution results will appear in this panel</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Output;
