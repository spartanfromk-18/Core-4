import React from 'react';
import { useExamContext } from '../../context/ExamContext';

const Dashboard: React.FC = () => {
  const { university, setUniversity } = useExamContext();

  return (
    <div className="min-h-screen p-8 relative overflow-hidden flex flex-col items-center justify-center font-sans tracking-wide">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#06b6d4] opacity-20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[0%] right-[0%] w-[60%] h-[60%] bg-[#7c3aed] opacity-20 blur-[150px] rounded-full"></div>
      </div>

      {/* Header */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#06b6d4] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-[#06b6d4]/20 border border-white/10">
            <span className="text-white font-bold text-xl">C4</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Core-4
          </h1>
        </div>
        <div className="px-4 py-2 rounded-full glass text-sm font-medium border border-white/5 text-text3 font-mono">
          Core-4 Online
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: University Selector */}
        <section className="col-span-1 md:col-span-5 flex flex-col gap-6">
          <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group">
            {/* Hover Glow Edge Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#06b6d4]/0 via-[#06b6d4]/10 to-[#7c3aed]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-2 h-6 rounded-full bg-[#06b6d4]" />
              Exam Intelligence
            </h2>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400 font-medium">Target University</label>
              <div className="relative">
                <select 
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full bg-[#000000]/40 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-transparent transition-all backdrop-blur-md"
                >
                  <option value="" disabled className="bg-[#1a1a1a]">Select University</option>
                  <option value="AKTU" className="bg-[#1a1a1a]">AKTU</option>
                  <option value="VTU" className="bg-[#1a1a1a]">VTU</option>
                  <option value="PU" className="bg-[#1a1a1a]">Pune University</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            {/* Simulated Logic View */}
            <div className="mt-8 p-4 rounded-xl bg-black/30 border border-white/5 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#06b6d4] font-mono">System.Ready()</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7c3aed] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7c3aed]"></span>
                </span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-gradient-to-r from-[#06b6d4] to-[#7c3aed] rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Logic Builder */}
        <section className="col-span-1 md:col-span-7 flex flex-col gap-6">
          <div className="glass-panel p-8 rounded-2xl h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-2 h-6 rounded-full bg-[#7c3aed]" />
              Logic Builder
            </h2>
            
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex-1 relative">
                <textarea 
                  className="w-full h-full min-h-[200px] bg-[#000000]/40 border border-[#7c3aed]/20 rounded-xl p-5 text-gray-200 placeholder-gray-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/50 resize-none transition-all"
                  placeholder="// Define schema rules here...&#10;> Pattern match sequence&#10;> Validate dataset"
                />
                
                {/* Decorative UI elements for the text area */}
                <div className="absolute top-4 right-4 text-[10px] uppercase font-bold text-[#7c3aed]/60 tracking-wider">
                  Raw Input
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#04889c] text-white font-medium shadow-lg shadow-[#06b6d4]/25 hover:shadow-xl hover:shadow-[#06b6d4]/40 transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-[#06b6d4]/50 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                  Compile Logistics
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Dashboard;
