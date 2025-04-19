"use client"
import { useRef, useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "@/constants/constants";
import Output from "./Output";

const VideoCallCodeEditor = ({ isOpen, onClose }) => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  // Initialize with default code
  useEffect(() => {
    setValue(CODE_SNIPPETS[language]);
  }, []);

  // Add keyboard shortcut for code execution
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        editorRef.current?.trigger('anyString', 'editor.action.formatDocument');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-x-0 top-10 bottom-10 z-50 mx-auto max-w-7xl px-4">
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 shadow-xl overflow-hidden h-full flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-neutral-800">
            <h3 className="text-lg font-semibold text-neutral-200">Code Editor</h3>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 p-4">
            <div className="flex gap-4 h-full">
              <div className="w-1/2 flex flex-col gap-2">
                <LanguageSelector language={language} onSelect={onSelect} />
                <div className="flex-1 border border-neutral-700 rounded-lg overflow-hidden">
                  <Editor
                    height="100%"
                    theme="vs-dark"
                    language={language}
                    value={value}
                    onChange={(value) => setValue(value)}
                    onMount={onMount}
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      lineNumbers: "on",
                      roundedSelection: false,
                      padding: { top: 16, bottom: 16 },
                      cursorStyle: "line",
                      tabSize: 2,
                      wordWrap: "on",
                      formatOnPaste: true,
                      formatOnType: true,
                    }}
                  />
                </div>
              </div>
              <Output editorRef={editorRef} language={language} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallCodeEditor;