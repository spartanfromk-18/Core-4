import React, { useState, useEffect, useRef } from 'react';
import { Activity, Wifi, Cpu, X } from 'lucide-react';

interface SystemHUDProps {
  isStreaming: boolean;
  streamStallDetected: boolean;
}

export const SystemHUD: React.FC<SystemHUDProps> = ({ isStreaming, streamStallDetected }) => {
  const [visible, setVisible] = useState(true);
  const [fps, setFps] = useState(60);
  const [memoryMb, setMemoryMb] = useState<number | null>(null);

  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  useEffect(() => {
    // Initialize timing inside effect to avoid impurity during render
    lastTimeRef.current = performance.now();
    
    const measure = () => {
      const now = performance.now();
      frameCountRef.current++;
      
      if (now - lastTimeRef.current >= 1000) {
        const measuredFps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
        setFps(measuredFps);
        frameCountRef.current = 0;
        lastTimeRef.current = now;

        // Measure memory if available (Chrome only)
        const perf = performance as Performance & { memory?: { usedJSHeapSize: number } };
        const mem = perf.memory
          ? Math.round(perf.memory.usedJSHeapSize / 1048576)
          : null;
        setMemoryMb(mem);
      }
      frameRef.current = requestAnimationFrame(measure);
    };

    frameRef.current = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  // Derive status directly from props and state to avoid sync effects
  const apiNode = isStreaming ? 'Active' : streamStallDetected ? 'Stalled' : 'Active';
  const domHealth = fps < 30 ? 'Degraded' : 'Optimal';

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="fixed bottom-4 right-4 z-50 p-2 glass-panel rounded-full text-text3 hover:text-gold transition-colors"
      >
        <Activity size={16} />
      </button>
    );
  }

  const apiColor = apiNode === 'Active' ? 'text-green' : apiNode === 'Stalled' ? 'text-red-400' : 'text-text3';
  const domColor = domHealth === 'Optimal' ? 'text-green' : 'text-yellow-400';
  const fpsColor = fps >= 50 ? 'text-green' : fps >= 30 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="fixed bottom-4 right-4 z-50 glass-panel rounded-xl p-3 text-[10px] font-mono min-w-[200px] border border-border-main shadow-2xl">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-border-main">
        <span className="uppercase tracking-widest text-gold flex items-center gap-1.5">
          <Cpu size={10} />
          System Health
        </span>
        <button onClick={() => setVisible(false)} className="text-text3 hover:text-text-main transition-colors">
          <X size={12} />
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between">
          <span className="text-text3">FPS</span>
          <span className={fpsColor}>{fps} {fps >= 50 ? '— Stable' : fps >= 30 ? '— Moderate' : '— Low'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text3">API Node</span>
          <span className={apiColor}>{apiNode}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-text3">DOM Health</span>
          <span className={domColor}>{domHealth}</span>
        </div>
        {memoryMb !== null && (
          <div className="flex justify-between">
            <span className="text-text3">Heap</span>
            <span className="text-ice2">{memoryMb} MB</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-text3">Stream</span>
          <span className={isStreaming ? 'text-gold animate-pulse' : 'text-text3'}>
            {isStreaming ? 'Streaming...' : 'Idle'}
          </span>
        </div>
      </div>

      {streamStallDetected && (
        <div className="mt-2 pt-2 border-t border-border-main text-red-400 flex items-center gap-1">
          <Wifi size={10} />
          <span>Node congestion detected</span>
        </div>
      )}
    </div>
  );
};
