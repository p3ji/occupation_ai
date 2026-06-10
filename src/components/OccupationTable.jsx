import React, { useMemo } from 'react';
import { Briefcase, AlertTriangle, HelpCircle } from 'lucide-react';

export default function OccupationTable({ selectedCip, crosswalk, occupations, selectedNoc, onSelectNoc, genderView }) {
  
  // Resolve mapped occupations for this major based on genderView
  const allJobs = useMemo(() => {
    if (!selectedCip || !crosswalk || !occupations) return [];
    
    const mapping = crosswalk[selectedCip];
    if (!mapping) return [];

    // Resolve list of NOCs and their shares based on genderView
    const list = genderView === 'women' ? (mapping.women || []) : (mapping.men || []);

    // Map to full occupation data from occupations.json
    return list
      .map(item => {
        const job = occupations.find(o => o.noc === item.noc);
        if (!job) return null;
        return {
          ...job,
          share: item.share
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.share - a.share); // Sort by prevalence
  }, [selectedCip, crosswalk, occupations, genderView]);

  const getCompetitionColor = (level) => {
    switch (level) {
      case 'Low': return 'text-positive bg-positive/10 border-positive/20';
      case 'Moderate': return 'text-accent bg-accent/10 border-accent/20';
      case 'High': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'Very High': return 'text-negative bg-negative/10 border-negative/20';
      default: return 'text-zinc-400 bg-zinc-800/60 border-zinc-700/30';
    }
  };

  const getAiRiskColor = (score) => {
    if (score >= 7) return 'text-negative bg-negative/10';
    if (score >= 4) return 'text-orange-400 bg-orange-400/10';
    return 'text-positive bg-positive/10';
  };

  if (allJobs.length === 0) {
    return (
      <div className="text-center py-12 bg-surface/20 rounded-xl border border-border">
        <Briefcase className="mx-auto text-zinc-500 mb-3" size={32} />
        <h3 className="text-sm font-medium text-white">No Career Mappings</h3>
        <p className="text-xs text-muted mt-1 max-w-xs mx-auto">
          We don't have direct occupation data for this program yet. Choose another major or use the salary calculator.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
          <Briefcase size={16} className="text-primary-bright" />
          Mapped Occupations ({allJobs.length})
        </h4>
        <span className="text-[10px] text-zinc-500 italic hidden sm:block">
          Select an occupation below to view AI insights & regional salaries.
        </span>
      </div>

      {/* Desktop/Tablet Table View */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border bg-surface/20">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-surface/40 text-zinc-500 font-medium">
              <th className="p-3 text-center">Rank</th>
              <th className="p-3">Occupation (NOC)</th>
              <th className="p-3 text-center">Census Share</th>
              <th className="p-3 text-center">Entry Salary</th>
              <th className="p-3 text-center">Median Salary</th>
              <th className="p-3 text-center">Openings</th>
              <th className="p-3 text-center">Competition</th>
              <th className="p-3 text-center">AI Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/60">
            {allJobs.map((job, index) => {
              const isSelected = selectedNoc === job.noc;
              const sharePct = `${job.share}%`;

              return (
                <tr
                  key={job.noc}
                  onClick={() => onSelectNoc(job.noc)}
                  className={`cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-primary/5 hover:bg-primary/10 text-white' 
                      : 'text-zinc-300 hover:bg-surface/30 hover:text-white'
                  }`}
                >
                  <td className="p-3 text-center font-bold text-zinc-500">
                    #{index + 1}
                  </td>
                  <td className="p-3 font-semibold">
                    <div>{job.title}</div>
                    <div className="text-[10px] text-zinc-500 font-mono mt-0.5">NOC {job.noc}</div>
                  </td>
                  <td className="p-3 text-center font-mono font-bold text-primary-bright">
                    {sharePct}
                  </td>
                  <td className="p-3 text-center font-mono font-medium text-zinc-400">
                    ${job.entrySalary.toLocaleString()}
                  </td>
                  <td className="p-3 text-center font-mono font-bold text-accent">
                    ${job.medianSalary.toLocaleString()}
                  </td>
                  <td className="p-3 text-center font-mono text-zinc-400">
                    {job.openPositions.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium inline-block ${getCompetitionColor(job.competitionLevel)}`}>
                      {job.competitionLevel}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${getAiRiskColor(job.karpathyExposure)}`}>
                      {job.karpathyExposure}/10
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {allJobs.map((job, index) => {
          const isSelected = selectedNoc === job.noc;
          const sharePct = `${job.share}%`;

          return (
            <div
              key={job.noc}
              onClick={() => onSelectNoc(job.noc)}
              className={`p-4 rounded-xl border cursor-pointer glass-panel select-none transition-all duration-200 ${
                isSelected 
                  ? 'border-primary/80 bg-primary/10 shadow-sm shadow-primary/10' 
                  : 'border-border bg-surface/10 hover:bg-surface/20'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="min-w-0">
                  <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700/30 mb-1.5">
                    Rank #{index + 1}
                  </span>
                  <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold bg-accent/10 text-accent border border-accent/20 ml-2 mb-1.5">
                    {sharePct} share
                  </span>
                  <h5 className="font-semibold text-white text-sm leading-tight leading-snug">
                    {job.title}
                  </h5>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">NOC {job.noc}</div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded-full border text-[9px] font-medium inline-block ${getCompetitionColor(job.competitionLevel)}`}>
                    {job.competitionLevel}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-zinc-900/60 text-center">
                <div>
                  <div className="text-[9px] text-zinc-500 uppercase">Median Salary</div>
                  <div className="text-xs font-mono font-bold text-accent mt-0.5">
                    ${job.medianSalary.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-zinc-500 uppercase">Openings</div>
                  <div className="text-xs font-mono font-medium text-white mt-0.5">
                    {job.openPositions.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-zinc-500 uppercase">AI Exposure</div>
                  <div className={`text-xs font-mono font-bold mt-0.5 ${getAiRiskColor(job.karpathyExposure).split(' ')[0]}`}>
                    {job.karpathyExposure}/10
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
