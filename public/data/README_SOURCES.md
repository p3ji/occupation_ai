# Data Sources and Methodology Reference

This data layer was generated programmatically from official Canadian statistics:

## 1. Field of Study and Careers Concordance
- **Source**: Statistics Canada Study: *"Most prevalent occupations held among bachelor's degree graduates by detailed field of study, 2021, 25- to 34-year-olds"* (Appendix Tables A.1 & A.2).
- **Data File**: [noc_cip.ods](file:///c:/Users/pushp/Documents/Projects/occupation_ai/public/data/noc_cip.ods)
- **Methodology**: Uses the 2021 Census of Population long-form dataset to match 4-digit CIP fields of study with the 5 most prevalent 5-digit NOC occupations by gender. Suppressed cells (for confidentiality) are ignored.

## 2. Salary & Labour Outlooks
- **Salaries (Entry/Median)**: Sourced directly from the official **Government of Canada Job Bank Wage Reports / Statistics Canada (2025)** dataset (`wages2025.csv`). For each of the 225 NOC codes, the national median and low hourly wages are extracted (using direct matches for 5-digit NOCs, and prefix averages of sub-occupations for broader/rolled-up NOC codes) and converted to annual salaries using a standard 2,080 hours/year multiplier. This ensures 100% empirical wages.
- **Job Openings & Projections**: Sourced from the **Canadian Occupational Projection System (COPS) 2024-2033** outlooks. For minor careers, projections are estimated using NOC TEER level mappings.

## 3. AI Exposure (Custom Model)
- **Methodology**: Rather than using the paper's exact classification statistics, we created a custom classification based on the concepts and task suitability frameworks introduced in the Statistics Canada 2024 paper *"Experimental Estimates of Potential Artificial Intelligence Occupational Exposure in Canada"* (Mehdi & Morissette). University-educated cognitive roles (high routine information processing) are mapped as highly exposed, while clinical care, trades, and manual/tactile roles are mapped as lower exposure.

## 4. Provincial Labor Distribution
- **Source**: Sourced from **Statistics Canada / 2025 Canada Job Bank Wage Reports** (for provincial salaries) and the **Labour Force Survey (LFS) / Census 2021** (for regional employment counts).
- **Data File**: [provinces.json](file:///c:/Users/pushp/Documents/Projects/occupation_ai/public/data/provinces.json)
- **Methodology**: Compiles provincial-level median wages for each of the major occupations from `wages2025.csv` (by filtering for province-level ER codes like `ER35` for Ontario, `ER24` for Quebec, etc.). Hourly wages are converted to annual salaries using the standard 2,080 hours/year multiplier. Employment numbers represent regional labor counts.
