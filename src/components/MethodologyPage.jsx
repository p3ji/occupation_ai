import React from 'react';
import { BookOpen, FileText, BarChart2, ShieldAlert, CheckCircle, Database } from 'lucide-react';

export default function MethodologyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 text-zinc-300">
      {/* Title Banner */}
      <div className="p-6 rounded-2xl bg-surface/30 border border-border/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
        <span className="px-2.5 py-1 rounded bg-primary/10 border border-primary/20 text-primary-bright text-[10px] font-bold tracking-wider uppercase">
          Technical Documentation
        </span>
        <h2 className="text-2xl font-bold text-white mt-3">
          Experimental Canadian AI Jobs Dashboard
        </h2>
        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
          This methodology page details the data pipelines, empirical sources, mathematical models, and structural limitations of the dashboard. Our commitment is 100% empirical data and full transparency to enable total reproducibility of each statistic.
        </p>
      </div>

      {/* Grid of Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Concordance */}
        <div className="bg-surface/25 p-5 rounded-xl border border-border space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <BookOpen size={16} className="text-primary-bright" />
            1. CIP-NOC Concordance (Prevalent Careers)
          </h3>
          <div className="space-y-2 text-xs">
            <p>
              <strong>Primary Source:</strong> Statistics Canada Census Study: <span className="text-zinc-400 italic">"Most prevalent occupations held among bachelor's degree graduates by detailed field of study, 2021, 25- to 34-year-olds"</span> (Appendix Tables A.1 and A.2).
            </p>
            <p>
              <strong>Data File:</strong> <code className="bg-zinc-950 px-1 py-0.5 rounded text-accent font-mono text-[10px]">public/data/noc_cip.ods</code>
            </p>
            <p>
              <strong>Methodology:</strong> Mapped using the 2021 Census of Population long-form dataset. It matches 4-digit Classification of Instructional Programs (CIP) codes with the top 5 most prevalent 5-digit National Occupational Classification (NOC) codes, separated by gender.
            </p>
          </div>
        </div>

        {/* Section 2: Wages */}
        <div className="bg-surface/25 p-5 rounded-xl border border-border space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Database size={16} className="text-accent" />
            2. Salary & Hourly Wages
          </h3>
          <div className="space-y-2 text-xs">
            <p>
              <strong>Primary Source:</strong> Government of Canada **Job Bank Wages Database (2025)**, published via the Open Government Portal.
            </p>
            <p>
              <strong>Data File:</strong> <code className="bg-zinc-950 px-1 py-0.5 rounded text-accent font-mono text-[10px]">scratch/wages2025.csv</code> (17.9 MB)
            </p>
            <p>
              <strong>Formula:</strong> Entry salary is calculated using the 25th percentile (Low Wage) and median salary is the 50th percentile (Median Wage). We convert hourly rates to annual salaries using a standard full-time multiplier of <strong>2,080 hours/year</strong> (40 hours/week × 52 weeks).
            </p>
            <p>
              <strong>Regional Resolution:</strong> Provincial statistics filter by SGC province codes (e.g. Ontario = ER35, Quebec = ER24) to match regional wage levels.
            </p>
          </div>
        </div>

        {/* Section 3: Projections */}
        <div className="bg-surface/25 p-5 rounded-xl border border-border space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <BarChart2 size={16} className="text-primary-bright" />
            3. Job Openings & Growth
          </h3>
          <div className="space-y-2 text-xs">
            <p>
              <strong>Primary Source:</strong> Employment and Social Development Canada (ESDC) **Canadian Occupational Projection System (COPS) 2024–2033** outlooks.
            </p>
            <p>
              <strong>Methodology:</strong> Displays total employment, projected annual job openings, and 10-year growth rates. For minor or aggregated careers with suppressed data, outlooks are estimated using standard NOC TEER-level (Training, Education, Experience, and Responsibility) baseline averages.
            </p>
          </div>
        </div>

        {/* Section 4: AI Exposure */}
        <div className="bg-surface/25 p-5 rounded-xl border border-border space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <FileText size={16} className="text-accent" />
            4. AI Disruption & Exposure
          </h3>
          <div className="space-y-2 text-xs">
            <p>
              <strong>Primary Source:</strong> Statistics Canada 2024 analytical paper: <span className="text-zinc-400 italic">"Experimental Estimates of Potential Artificial Intelligence Occupational Exposure in Canada"</span> (Mehdi and Morissette).
            </p>
            <p>
              <strong>Methodology:</strong> Mapped based on task susceptibility profiles. University-educated cognitive roles (high logic, information parsing) map to higher AI exposure, whereas clinical health, trades, and manual/interpersonal services map to lower exposure.
            </p>
          </div>
        </div>
      </div>

      {/* Limitations Section */}
      <div className="bg-negative/5 p-6 rounded-xl border border-negative/20 space-y-4">
        <h3 className="text-sm font-semibold text-negative flex items-center gap-2">
          <ShieldAlert size={16} />
          Analytical Limitations & Constraints
        </h3>
        <ul className="list-disc pl-5 text-xs space-y-2.5 text-zinc-400 leading-relaxed">
          <li>
            <strong className="text-zinc-300">Cohort Age Filter:</strong> The concordance dataset represents graduates aged 25 to 34. This provides a highly accurate view of early-career employment paths but does not reflect long-term senior careers.
          </li>
          <li>
            <strong className="text-zinc-300">Data Suppression:</strong> Statistics Canada suppresses cells with very low sample counts to comply with confidentiality under the <span className="text-zinc-400 italic">Statistics Act</span>. Broad occupational roll-ups (1 to 4 digit NOC codes) are used when detailed 5-digit data is unavailable.
          </li>
          <li>
            <strong className="text-zinc-300">Unweighted Averages for Broad NOCs:</strong> Broad occupations aggregate constitutive 5-digit codes using simple averages of their wages because total enrollment weights for suppressed cells are not published.
          </li>
          <li>
            <strong className="text-zinc-300">Wages Multiplier:</strong> Annual salaries assume full-time, full-year employment (40 hours/week). They do not incorporate bonuses, stock options, overtime pay, or pension adjustments.
          </li>
          <li>
            <strong className="text-zinc-300">AI Exposure vs. Unemployment:</strong> A high AI exposure score represents task-level augmentation potential and does not necessarily equate to future job loss. Many roles will see productivity gains rather than replacement.
          </li>
        </ul>
      </div>

      {/* Reproducibility Section */}
      <div className="bg-surface/20 p-6 rounded-xl border border-border space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <CheckCircle size={16} className="text-positive" />
          Full Reproducibility Pipeline
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Developers and researchers can reproduce the entire JSON database layout by following these steps:
        </p>
        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 text-[11px] font-mono space-y-2 text-zinc-300 overflow-x-auto">
          <div className="text-zinc-500"># 1. Clone the repository and install dependencies</div>
          <div>git clone https://github.com/p3ji/occupation_ai.git</div>
          <div>cd occupation_ai</div>
          <div className="text-zinc-500"># 2. Place the ODS Concordance sheet in public/data/noc_cip.ods</div>
          <div className="text-zinc-500"># 3. Place the 2025 Job Bank wages dataset in scratch/wages2025.csv</div>
          <div className="text-zinc-500"># 4. Run the data generation script</div>
          <div className="text-zinc-500"># This script parses the ODS cells, merges the 2025 wages, and outputs:</div>
          <div className="text-zinc-500"># - public/data/majors.json</div>
          <div className="text-zinc-500"># - public/data/crosswalk.json</div>
          <div className="text-zinc-500"># - public/data/occupations.json</div>
          <div>python scratch/generate_concordance_data.py</div>
          <div className="text-zinc-500"># 5. Run the provincial salary update script</div>
          <div className="text-zinc-500"># This merges provincial wages and outputs: public/data/provinces.json</div>
          <div>python scratch/update_provincial_salaries.py</div>
        </div>
      </div>
    </div>
  );
}
