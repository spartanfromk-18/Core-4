import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BootSequenceProps {
  onComplete: () => void;
}

const bootLines = [
  'Initializing Core-4...',
  'Establishing secure connection...',
  'Node Connected...',
  'Loading Examiner personas...',
  'Injecting AKTU, SPPU, VJTI heuristics...',
  'System.Ready()'
];

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < bootLines.length) {
        setLines(prev => [...prev, bootLines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-ink">
      <div className="glass-panel p-8 rounded-lg max-w-lg w-full logic-pulse">
        <div className="flex gap-2 mb-4 pb-2 border-b border-border-main">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="font-mono text-green-400 text-sm h-64 flex flex-col justify-end overflow-hidden">
          {lines.map((line, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="terminal-text mb-2"
            >
              {`> ${line}`}
            </motion.div>
          ))}
          {lines.length < bootLines.length && (
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="terminal-text"
            >
              _
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
