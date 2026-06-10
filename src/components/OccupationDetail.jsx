import React, { useMemo } from 'react';
import CanadaMap from './CanadaMap';
import { Cpu, TrendingUp, Users, DollarSign, BookOpen } from 'lucide-react';

export default function OccupationDetail({ selectedNoc, occupations, provinceData }) {
  
  // Find current active occupation details
  const activeOcc = useMemo(() => {
    if (!selectedNoc || !occupations) return null;
    return occupations.find(o => o.noc === selectedNoc);
  }, [selectedNoc, occupations]);

  const getAiDisruptionLabelColor = (label) => {
    switch (label) {
      case 'High': return 'text-negative bg-negative/10 border-negative/20';
      case 'Moderate': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'Low': return 'text-positive bg-positive/10 border-positive/20';
      default: return 'text-zinc-400 bg-zinc-800/60 border-zinc-700/30';
    }
  };

  const getAiProgressColor = (score) => {
    if (score >= 7) return 'bg-negative';
    if (score >= 4) return 'bg-orange-400';
    return 'bg-positive';
  };

  if (!activeOcc) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-center bg-surface/10 rounded-xl border border-dashed border-border min-h-[300px]">
        <div>
          <BookOpen className="mx-auto text-zinc-600 mb-3" size={36} />
          <h3 className="text-sm font-semibold text-zinc-400">Select an Occupation</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-[250px] mx-auto">
            Click on any occupation in the table to display its AI exposure, Canadian outlook, and provincial salary variations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Description */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-zinc-800 text-zinc-300 border border-zinc-700/40">
            NOC {activeOcc.noc}
          </span>
          <span className="text-[10px] text-zinc-500">
            National Occupational Classification
          </span>
        </div>
        <h3 className="text-xl font-bold text-white mt-1 leading-snug">
          {activeOcc.title}
        </h3>
        <p className="text-xs text-zinc-400 mt-2 leading-relaxed bg-surface/20 p-3 rounded-lg border border-border/40">
          {activeOcc.description}
        </p>
      </div>

      {/* Salaries Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-surface/30 p-4 rounded-xl border border-border flex items-center gap-3.5">
          <span className="p-3 rounded-lg bg-zinc-800/50 text-zinc-400">
            <DollarSign size={20} />
          </span>
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
              Entry Salary (25th Percentile)
            </div>
            <div className="text-lg font-mono font-bold text-zinc-300 mt-0.5">
              ${activeOcc.entrySalary.toLocaleString()}{' '}
              <span className="text-xs font-sans text-zinc-500">CAD</span>
            </div>
            <div className="text-[9px] text-zinc-600 mt-0.5">
              Typical starting pay for graduates
            </div>
          </div>
        </div>

        <div className="bg-surface/30 p-4 rounded-xl border border-primary/20 flex items-center gap-3.5 shadow-sm shadow-primary/5">
          <span className="p-3 rounded-lg bg-primary/10 text-primary-bright">
            <DollarSign size={20} />
          </span>
          <div>
            <div className="text-[10px] text-primary-bright uppercase tracking-wider font-semibold">
              Median Salary (50th Percentile)
            </div>
            <div className="text-lg font-mono font-bold text-accent mt-0.5">
              ${activeOcc.medianSalary.toLocaleString()}{' '}
              <span className="text-xs font-sans text-zinc-500">CAD</span>
            </div>
            <div className="text-[9px] text-zinc-600 mt-0.5">
              National mid-point wage in Canada
            </div>
          </div>
        </div>
      </div>

      {/* Labor Market Indicators */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface/10 p-3 rounded-xl border border-border/50 text-center">
          <TrendingUp className="mx-auto text-primary-bright mb-1" size={16} />
          <div className="text-[9px] text-zinc-500 uppercase">Growth (10y)</div>
          <div className="text-sm font-mono font-bold text-white mt-0.5">
            +{activeOcc.projectedGrowthRate}%
          </div>
        </div>

        <div className="bg-surface/10 p-3 rounded-xl border border-border/50 text-center">
          <Users className="mx-auto text-accent mb-1" size={16} />
          <div className="text-[9px] text-zinc-500 uppercase">Employment</div>
          <div className="text-sm font-mono font-bold text-white mt-0.5">
            {activeOcc.totalEmployment >= 1000 
              ? `${(activeOcc.totalEmployment / 1000).toFixed(0)}k` 
              : activeOcc.totalEmployment}
          </div>
        </div>

        <div className="bg-surface/10 p-3 rounded-xl border border-border/50 text-center">
          <div className="text-[9px] text-zinc-500 uppercase font-semibold">Annual Openings</div>
          <div className="text-sm font-mono font-bold text-white mt-1">
            {activeOcc.openPositions.toLocaleString()}
          </div>
        </div>
      </div>

      {/* AI Exposure Analysis */}
      <div className="bg-surface/30 p-5 rounded-xl border border-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Cpu size={16} className="text-primary-bright" />
            AI Exposure & Disruption Risk
          </div>
          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-semibold ${getAiDisruptionLabelColor(activeOcc.aiDisruptionLabel)}`}>
            {activeOcc.aiDisruptionLabel} Risk
          </span>
        </div>

        {/* Custom Progress Bar for AI Exposure */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>Automation Sensitivity</span>
            <span className="font-bold text-white">{activeOcc.karpathyExposure * 10}%</span>
          </div>
          <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getAiProgressColor(activeOcc.karpathyExposure)}`}
              style={{ width: `${activeOcc.karpathyExposure * 10}%` }}
            />
          </div>
          <div className="flex justify-between text-[8px] text-zinc-600">
            <span>Tactile / Leadership heavy (Low)</span>
            <span>Knowledge workers / Routine cognitive (High)</span>
          </div>
        </div>

        {/* AI Rationale Text */}
        <div className="text-xs text-zinc-400 bg-zinc-950/40 p-3.5 rounded-lg border border-border/50 leading-relaxed">
          <span className="font-semibold text-zinc-300 block mb-1">Impact Rationale:</span>
          {activeOcc.karpathyRationale}
        </div>
      </div>

      {/* Provincial Map Embedding */}
      <CanadaMap
        selectedNoc={activeOcc.noc}
        provinceData={provinceData}
        occupations={occupations}
      />
    </div>
  );
}
