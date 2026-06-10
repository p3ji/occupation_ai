import React, { useState, useMemo } from 'react';
import { Search, GraduationCap } from 'lucide-react';

export default function MajorSelector({ majors, selectedCip, onSelectMajor }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Extract unique categories
  const categories = useMemo(() => {
    if (!majors) return ['All'];
    const cats = new Set(majors.map(m => m.category));
    return ['All', ...Array.from(cats)];
  }, [majors]);

  // Filter majors based on query and category
  const filteredMajors = useMemo(() => {
    if (!majors) return [];
    return majors.filter(major => {
      const matchesSearch = major.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            major.cip.includes(searchQuery);
      const matchesCategory = activeCategory === 'All' || major.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [majors, searchQuery, activeCategory]);

  return (
    <div className="space-y-4">
      {/* Category Pills */}
      <div className="flex overflow-x-auto gap-1.5 pb-2 scrollbar-none snap-x snap-mandatory touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 border shrink-0 snap-start select-none ${
              activeCategory === cat
                ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                : 'bg-surface/50 text-zinc-400 border-border hover:bg-surface hover:text-zinc-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500">
          <Search size={16} />
        </span>
        <input
          type="text"
          placeholder="Search college majors (e.g. Computer Science, Accounting)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface/40 hover:bg-surface/60 focus:bg-surface/80 text-sm text-white pl-10 pr-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200"
        />
      </div>

      {/* Majors Results List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[350px] overflow-y-auto pr-1">
        {filteredMajors.map(major => {
          const isSelected = selectedCip === major.cip;
          return (
            <div
              key={major.cip}
              onClick={() => onSelectMajor(major.cip)}
              className={`p-4 rounded-xl border cursor-pointer glass-panel glass-panel-hover flex items-start gap-3 select-none ${
                isSelected 
                  ? 'border-primary/80 bg-primary/10 shadow-sm shadow-primary/10' 
                  : ''
              }`}
            >
              <span className={`p-2 rounded-lg shrink-0 ${
                isSelected ? 'bg-primary/20 text-primary-bright' : 'bg-zinc-800/60 text-zinc-400'
              }`}>
                <GraduationCap size={18} />
              </span>
              <div className="min-w-0">
                <div className="text-xs font-mono text-zinc-500">{major.cip}</div>
                <h3 className="text-sm font-semibold text-white mt-0.5 truncate leading-tight">
                  {major.name}
                </h3>
                <span className="inline-block text-[10px] font-medium text-muted mt-1.5">
                  {major.category}
                </span>
              </div>
            </div>
          );
        })}
        {filteredMajors.length === 0 && (
          <div className="col-span-full py-8 text-center text-sm text-zinc-500">
            No majors found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
