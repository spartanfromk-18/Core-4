import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, GraduationCap, Library } from 'lucide-react';

interface LettaDockProps {
  selectedUni: string;
  onSelect: (uni: string) => void;
}

const universities = [
  { id: 'AKTU', label: 'Dr. A.P.J. Abdul Kalam Technical University', icon: BookOpen },
  { id: 'SPPU', label: 'Savitribai Phule Pune University', icon: GraduationCap },
  { id: 'VJTI', label: 'Veermata Jijabai Technological Institute', icon: Library },
];

export const LettaDock: React.FC<LettaDockProps> = ({ selectedUni, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dockRef.current && !dockRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block z-40" ref={dockRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="glass flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-text-main border border-border2 hover:bg-surface2 transition-colors logic-pulse"
      >
        <span className="text-gold font-mono uppercase tracking-widest text-xs">Network:</span> 
        <span className="font-bold">{selectedUni}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute top-full left-0 mt-4 p-2 glass-panel rounded-2xl flex flex-col gap-2 min-w-[280px]"
          >
            {universities.map(uni => {
              const Icon = uni.icon;
              const isActive = uni.id === selectedUni;
              return (
                <button
                  key={uni.id}
                  onClick={() => {
                    onSelect(uni.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'dock-item-active' : 'hover:bg-white/5 text-text2 hover:text-text-main'}`}
                >
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-gold/20 text-gold' : 'bg-surface2'}`}>
                    <Icon size={18} />
                  </div>
                  <div className="text-left flex flex-col">
                    <span className="font-bold text-sm tracking-wide">{uni.id}</span>
                    <span className="text-xs opacity-70 truncate max-w-[180px]">{uni.label}</span>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
