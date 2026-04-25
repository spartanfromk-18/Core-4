// React imported automatically by Vite plugin
import './index.css';

function App() {
  return (
    <div className="relative min-h-screen bg-[#020617] text-white overflow-hidden font-sans flex flex-col items-center justify-center p-6">
      
      {/* Background Radial Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500 opacity-20 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600 opacity-20 blur-[180px] rounded-full pointer-events-none"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center gap-10">
        
        {/* Header Text */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Unsmart
            </span>
          </h1>
          <p className="text-slate-400 text-lg">
            A professional way of smart study.
          </p>
        </div>

        {/* Interactive Elements Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Glassmorphism Search Bar */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-cyan-400 tracking-wider uppercase pl-2">Semantic Search</label>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-cyan-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
              <input 
                type="text" 
                placeholder="Query PYQs or Topper answers..." 
                className="relative w-full bg-slate-900/50 backdrop-blur-md border border-cyan-500/50 rounded-xl px-5 py-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]"
              />
            </div>
          </div>

          {/* Glowing University Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-indigo-400 tracking-wider uppercase pl-2">Target Institution</label>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-indigo-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <select 
                className="relative w-full bg-slate-900/50 backdrop-blur-md border border-indigo-500/50 rounded-xl px-5 py-4 text-slate-100 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.2)]"
              >
                <option value="AKTU" className="bg-slate-900">AKTU (APJ Abdul Kalam Tech)</option>
                <option value="VTU" className="bg-slate-900">VTU (Visvesvaraya Tech)</option>
                <option value="PU" className="bg-slate-900">Pune University</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
