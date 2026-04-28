import React, { useState, useRef, useEffect } from 'react';
import { LettaDock } from './LettaDock';
import { SystemHUD } from './SystemHUD';
import { ErrorBoundary } from './ErrorBoundary';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { streamLogisticsAnalysis } from '../services/geminiService';
import { Terminal, Send, Activity, ShieldAlert, Cpu } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const EngineCore: React.FC = () => {
  const { preferredUniversity, updatePreferredUniversity, traces, addTrace } = useSearchHistory();
  const [query, setQuery] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamStallDetected, setStreamStallDetected] = useState(false);
  const [currentOutput, setCurrentOutput] = useState('');
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  // Track mounted state to prevent setState after unmount (memory safety)
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentOutput]);

  const handleSearch = async () => {
    if (!query.trim() || isStreaming) return;

    if (isMountedRef.current) {
      setIsStreaming(true);
      setCurrentOutput('');
      setCurrentScore(null);
      setErrorMsg(null);
      setStreamStallDetected(false);
    }

    try {
      let tempOut = '';
      const { fullText, confidenceScore } = await streamLogisticsAnalysis(
        query,
        preferredUniversity,
        {
          onToken: (text) => {
            if (!isMountedRef.current) return;
            tempOut += text;
            setCurrentOutput(tempOut);
          },
          onStall: () => {
            if (isMountedRef.current) setStreamStallDetected(true);
          },
        }
      );

      if (isMountedRef.current) {
        setCurrentScore(confidenceScore);
        addTrace({
          query,
          university: preferredUniversity,
          result: fullText,
          confidenceScore,
        });
      }
    } catch (e: unknown) {
      if (isMountedRef.current) {
        setErrorMsg(e instanceof Error ? e.message : 'System Error.');
      }
    } finally {
      if (isMountedRef.current) {
        setIsStreaming(false);
      }
    }
  };

  return (
    <div className="min-h-screen text-text-main p-6 lg:p-12 z-10 relative">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold2 flex items-center justify-center font-cormorant font-bold text-ink text-xl">
            U
          </div>
          <div>
            <h1 className="font-cabinet font-bold text-lg tracking-tight">UNSMART</h1>
            <p className="text-xs text-text3 font-mono uppercase tracking-widest">Core-4 Node</p>
          </div>
        </div>
        <LettaDock selectedUni={preferredUniversity} onSelect={updatePreferredUniversity} />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">

        {/* Main Bento Terminal */}
        <div className="lg:col-span-8 fc flex flex-col h-[70vh]">
          <div className="flex items-center gap-3 mb-6 border-b border-border-main pb-4">
            <Terminal className="text-gold" size={20} />
            <h2 className="font-mono text-sm tracking-widest text-text2 uppercase">Compile Logistics</h2>
            {isStreaming && <Activity className="ml-auto text-green animate-pulse" size={16} />}
          </div>

          <div className="flex-1 overflow-y-auto mb-6 pr-2">
            {errorMsg ? (
              <div className="flex items-center gap-3 text-red-400 bg-red-400/10 p-4 rounded-lg border border-red-400/20">
                <ShieldAlert size={20} />
                <span className="font-mono text-sm">{errorMsg}</span>
              </div>
            ) : currentOutput ? (
              <div className="prose prose-invert prose-p:text-text2 prose-h3:text-gold prose-h3:font-cormorant prose-h3:text-2xl font-cabinet max-w-none">
                <ReactMarkdown>{currentOutput}</ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-30">
                <Cpu size={48} className="mb-4 text-gold" />
                <p className="font-mono text-sm uppercase tracking-widest text-text2">Awaiting Input Query</p>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {currentScore !== null && !isStreaming && (
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-xs text-text3 uppercase">Confidence Score:</span>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold to-gold2 transition-all duration-1000"
                  style={{ width: `${currentScore}%` }}
                />
              </div>
              <span className="font-mono text-gold text-sm font-bold">{currentScore}%</span>
            </div>
          )}

          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Query the logistics engine..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-12 text-text-main font-cabinet outline-none focus:border-gold/40 focus:bg-gold/5 transition-all"
              disabled={isStreaming}
            />
            <button
              onClick={handleSearch}
              disabled={isStreaming || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-text3 hover:text-gold disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Sidebar: Traces */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="fc">
            <h3 className="font-cormorant text-2xl font-semibold mb-6 flex items-center gap-2">
              <Activity className="text-gold" size={20} />
              Logic Traces
            </h3>
            <div className="flex flex-col gap-3">
              {traces.length === 0 ? (
                <p className="text-sm text-text3 italic">No recent queries found.</p>
              ) : (
                traces.map(trace => (
                  <div key={trace.id} className="result-item flex-col items-start gap-2">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono text-[10px] text-gold bg-gold/10 px-2 py-1 rounded border border-gold/20">
                        {trace.university}
                      </span>
                      <span className="font-mono text-xs text-green">{trace.confidenceScore}%</span>
                    </div>
                    <p className="text-sm text-text2 truncate w-full">{trace.query}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="fc flex-1 flex flex-col items-center justify-center text-center opacity-60">
            <ShieldAlert className="text-text3 mb-3" size={24} />
            <p className="font-mono text-[10px] uppercase text-text3">Prototype Phase</p>
            <p className="text-xs text-text2 mt-2">API Key exposure acknowledged. Migrating to secure backend post-competition.</p>
          </div>
        </div>
      </div>

      {/* System Health HUD */}
      <SystemHUD isStreaming={isStreaming} streamStallDetected={streamStallDetected} />
    </div>
  );
};

export const IntelligenceEngine: React.FC = () => (
  <ErrorBoundary componentName="Intelligence Engine">
    <EngineCore />
  </ErrorBoundary>
);
