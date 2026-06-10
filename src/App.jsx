import React, { useState, useEffect } from 'react';
import MajorSelector from './components/MajorSelector';
import OccupationTable from './components/OccupationTable';
import OccupationDetail from './components/OccupationDetail';
import SalaryCalculator from './components/SalaryCalculator';
import { Compass, Calculator, GraduationCap, Github, Briefcase, Award } from 'lucide-react';

export default function App() {
  const [data, setData] = useState({
    majors: null,
    occupations: null,
    crosswalk: null,
    provinces: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Selection states
  const [selectedCip, setSelectedCip] = useState('11.0101'); // Default to Computer Science
  const [selectedNoc, setSelectedNoc] = useState('21232');    // Default to Software Developers
  const [activeTab, setActiveTab] = useState('explorer');     // 'explorer' | 'calculator'

  // Fetch Canadian databases on mount
  useEffect(() => {
    Promise.all([
      fetch('/data/majors.json').then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status} majors`);
        return r.json();
      }),
      fetch('/data/occupations.json').then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status} occupations`);
        return r.json();
      }),
      fetch('/data/crosswalk.json').then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status} crosswalk`);
        return r.json();
      }),
      fetch('/data/provinces.json').then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status} provinces`);
        return r.json();
      })
    ])
      .then(([majors, occupations, crosswalk, provinces]) => {
        setData({ majors, occupations, crosswalk, provinces });
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load Canadian data files:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSelectMajor = (cip) => {
    setSelectedCip(cip);
    // Proactively select the first primary occupation for this major as default
    const mapping = data.crosswalk?.[cip];
    if (mapping) {
      const firstPrimary = mapping.primary?.[0] || mapping.related?.[0];
      if (firstPrimary) {
        setSelectedNoc(firstPrimary);
      }
    }
  };

  const handleJumpToMajor = (cip, noc) => {
    setSelectedCip(cip);
    setSelectedNoc(noc);
    setActiveTab('explorer');
    // Scroll window to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg text-white flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-xs text-zinc-500 font-medium">Assembling Canadian Labor Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 bg-negative/10 border border-negative/20 rounded-xl max-w-md">
          <h3 className="font-semibold text-negative">Database Connection Error</h3>
          <p className="text-xs text-zinc-400 mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-1.5 bg-zinc-800 text-white rounded text-xs hover:bg-zinc-700 cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const activeMajorDetails = data.majors?.find(m => m.cip === selectedCip);

  return (
    <div className="min-h-screen flex flex-col bg-bg text-white select-none">
      {/* Premium Header */}
      <header className="border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-primary/10 text-primary-bright">
              <Compass size={22} className="animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold tracking-tight text-white sm:text-lg">
                  Canadian Field Report
                </h1>
                <span className="px-1.5 py-0.5 rounded bg-accent/15 text-accent text-[9px] font-semibold border border-accent/20">
                  NOC/CIP 2021
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 sm:block hidden">
                Economic value, AI-disruption risk, and competition level mapping for Canadian college majors
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Github Link */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg border border-border bg-surface/50 text-zinc-400 hover:text-white hover:bg-surface transition-colors"
            >
              <Github size={16} />
            </a>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="border-b border-border bg-surface/20">
        <div className="max-w-7xl mx-auto px-4 flex gap-6">
          <button
            onClick={() => setActiveTab('explorer')}
            className={`py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'explorer'
                ? 'border-primary text-primary-bright'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Compass size={14} />
            Major & Career Explorer
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'calculator'
                ? 'border-primary text-primary-bright'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Calculator size={14} />
            Salary Reverse Calculator
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === 'explorer' ? (
          <div className="space-y-6">
            {/* College Majors Row */}
            <section className="bg-surface/30 p-5 rounded-xl border border-border">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <GraduationCap size={16} className="text-primary-bright" />
                  Select Post-Secondary Program
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Browse Stats Canada instructional programs to discover linked occupational prospects.
                </p>
              </div>
              <MajorSelector
                majors={data.majors}
                selectedCip={selectedCip}
                onSelectMajor={handleSelectMajor}
              />
            </section>

            {/* Selected Major Banner */}
            {activeMajorDetails && (
              <div className="p-4 bg-surface/40 border border-border/80 rounded-xl flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-zinc-500">
                    Active Program Search
                  </span>
                  <h3 className="text-sm font-bold text-white mt-0.5">
                    {activeMajorDetails.name} ({activeMajorDetails.cip})
                  </h3>
                </div>
                <div className="px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-medium">
                  Category: <span className="text-white font-bold">{activeMajorDetails.category}</span>
                </div>
              </div>
            )}

            {/* Split Data Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Careers Table - Left Column */}
              <div className="lg:col-span-7 space-y-4">
                <section className="bg-surface/30 p-5 rounded-xl border border-border">
                  <OccupationTable
                    selectedCip={selectedCip}
                    crosswalk={data.crosswalk}
                    occupations={data.occupations}
                    selectedNoc={selectedNoc}
                    onSelectNoc={setSelectedNoc}
                  />
                </section>
              </div>

              {/* Career Details Panel - Right Column */}
              <div className="lg:col-span-5 space-y-4">
                <section className="bg-surface/30 p-5 rounded-xl border border-border">
                  <OccupationDetail
                    selectedNoc={selectedNoc}
                    occupations={data.occupations}
                    provinceData={data.provinces}
                  />
                </section>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <section className="bg-surface/30 p-6 rounded-xl border border-border">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Calculator size={16} className="text-primary-bright" />
                  Canadian Target Salary Mapping Tool
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Slide your target annual salary to see matching Canadian careers and required post-secondary degrees.
                </p>
              </div>
              <SalaryCalculator
                occupations={data.occupations}
                majors={data.majors}
                crosswalk={data.crosswalk}
                onJumpToMajor={handleJumpToMajor}
              />
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 bg-surface/10 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2.5">
          <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-600">
            <span className="flex items-center gap-1">
              <Award size={10} />
              Statistics Canada Census 2021
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span className="flex items-center gap-1">
              <Briefcase size={10} />
              COPS Projections 2024–2033
            </span>
          </div>
          <p className="max-w-md mx-auto text-[10px] text-zinc-600 leading-relaxed">
            Disclaimer: Salaries, openings, and employment numbers represent synthesized averages compiled from StatCan Census data and COPS. AI Exposure rankings are based on theoretical task susceptibility indexes (inspired by Karpathy AI exposure rankings).
          </p>
          <div className="pt-2 text-[10px] text-zinc-700">
            &copy; {new Date().getFullYear()} Canadian Field Report. Built for student career discovery.
          </div>
        </div>
      </footer>
    </div>
  );
}
