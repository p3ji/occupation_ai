import React, { useState, useMemo } from 'react';
import { DollarSign, GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function SalaryCalculator({ occupations, majors, crosswalk, onJumpToMajor }) {
  const [targetSalary, setTargetSalary] = useState(80000);

  const presets = [60000, 80000, 100000, 120000, 140000];

  // Map NOC codes back to CIP majors that feed into them
  const nocToMajorsMap = useMemo(() => {
    if (!crosswalk || !majors) return {};
    
    const mapping = {};
    Object.keys(crosswalk).forEach(cip => {
      const paths = crosswalk[cip];
      const allNocs = new Set();
      (paths.men || []).forEach(item => allNocs.add(item.noc));
      (paths.women || []).forEach(item => allNocs.add(item.noc));
      
      allNocs.forEach(noc => {
        if (!mapping[noc]) {
          mapping[noc] = [];
        }
        const majorInfo = majors.find(m => m.cip === cip);
        if (majorInfo && !mapping[noc].some(m => m.cip === cip)) {
          mapping[noc].push(majorInfo);
        }
      });
    });
    return mapping;
  }, [crosswalk, majors]);

  // Find all occupations meeting or exceeding the target median salary
  const matchingOccupations = useMemo(() => {
    if (!occupations) return [];
    return occupations
      .filter(occ => occ.medianSalary >= targetSalary)
      .sort((a, b) => b.medianSalary - a.medianSalary);
  }, [occupations, targetSalary]);

  return (
    <div className="space-y-6">
      {/* Slider Controls */}
      <div className="bg-surface/30 p-5 rounded-xl border border-border space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-white">Select Target Annual Salary</h4>
          <p className="text-xs text-zinc-500 mt-0.5">
            Filter occupations and majors that meet or exceed your salary expectations.
          </p>
        </div>

        {/* Dynamic Big Text Display */}
        <div className="flex items-baseline gap-1 text-center justify-center py-2">
          <span className="text-zinc-500 text-sm font-bold">$</span>
          <span className="text-3xl font-bold font-mono text-accent">
            {targetSalary.toLocaleString()}
          </span>
          <span className="text-zinc-500 text-xs font-medium">CAD / year</span>
        </div>

        {/* Slider Input */}
        <input
          type="range"
          min={50000}
          max={150000}
          step={5000}
          value={targetSalary}
          onChange={(e) => setTargetSalary(Number(e.target.value))}
          className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-primary border border-zinc-800"
        />

        {/* Preset Buttons */}
        <div className="flex flex-wrap justify-between gap-2 pt-2">
          {presets.map(val => (
            <button
              key={val}
              onClick={() => setTargetSalary(val)}
              className={`px-3 py-1 rounded text-xs font-mono font-medium cursor-pointer transition-colors border ${
                targetSalary === val
                  ? 'bg-primary text-white border-primary shadow-sm shadow-primary/10'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-surface hover:text-white'
              }`}
            >
              ${(val / 1000).toFixed(0)}k
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center text-xs">
        <span className="text-zinc-400 font-semibold">
          Matching Canadian Careers ({matchingOccupations.length})
        </span>
        {matchingOccupations.length > 0 && (
          <span className="text-[10px] text-zinc-500 italic">
            Sorted by highest median salary
          </span>
        )}
      </div>

      {/* Results Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto pr-1">
        {matchingOccupations.map(occ => {
          const feedingMajors = nocToMajorsMap[occ.noc] || [];
          return (
            <div
              key={occ.noc}
              className="p-5 rounded-xl border border-border bg-surface/25 flex flex-col justify-between space-y-4 hover:border-zinc-800/80 hover:bg-surface/35 transition-all duration-200"
            >
              {/* Job Header */}
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500">NOC {occ.noc}</span>
                    <h5 className="font-bold text-white text-sm mt-0.5 leading-snug">
                      {occ.title}
                    </h5>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="text-[10px] text-zinc-500 uppercase">Median Salary</div>
                    <div className="text-sm font-mono font-bold text-accent">
                      ${occ.medianSalary.toLocaleString()}
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-400 mt-2 line-clamp-2">
                  {occ.description}
                </p>
              </div>

              {/* Mapped College Majors */}
              <div className="border-t border-zinc-900/60 pt-3 space-y-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block">
                  Relevant Programs of Study:
                </span>
                
                <div className="flex flex-col gap-1.5">
                  {feedingMajors.map(major => (
                    <div
                      key={major.cip}
                      onClick={() => onJumpToMajor(major.cip, occ.noc)}
                      className="group flex items-center justify-between text-xs p-2 rounded bg-zinc-900/40 border border-zinc-800/20 hover:border-primary/30 hover:bg-primary/5 cursor-pointer transition-all duration-150"
                    >
                      <span className="flex items-center gap-2 text-zinc-300 group-hover:text-white truncate">
                        <GraduationCap size={13} className="text-zinc-500 shrink-0 group-hover:text-primary-bright" />
                        <span className="truncate">{major.name}</span>
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-zinc-500 shrink-0 font-medium group-hover:text-primary-bright ml-2">
                        View
                        <ArrowRight size={10} className="transform group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  ))}
                  {feedingMajors.length === 0 && (
                    <span className="text-[10px] text-zinc-600 italic block">
                      No matching post-secondary program cataloged.
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {matchingOccupations.length === 0 && (
          <div className="col-span-full py-12 text-center bg-surface/10 rounded-xl border border-dashed border-border text-zinc-500">
            <DollarSign className="mx-auto text-zinc-600 mb-2" size={32} />
            <h5 className="text-sm font-medium">No Careers Match this Target</h5>
            <p className="text-xs text-zinc-600 mt-1">
              Try lowering your target salary limit using the slider above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
