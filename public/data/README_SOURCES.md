# Data Sources and Methodology Reference

This data layer was generated programmatically from official Canadian statistics:

## 1. Field of Study and Careers Concordance
- **Source**: Statistics Canada Study: *"Most prevalent occupations held among bachelor's degree graduates by detailed field of study, 2021, 25- to 34-year-olds"* (Appendix Tables A.1 & A.2).
- **Data File**: [noc_cip.ods](file:///c:/Users/pushp/Documents/Projects/occupation_ai/public/data/noc_cip.ods)
- **Methodology**: Uses the 2021 Census of Population long-form dataset to match 4-digit CIP fields of study with the 5 most prevalent 5-digit NOC occupations by gender. Suppressed cells (for confidentiality) are ignored.

## 2. Salary & Labour Outlooks
- **Major Careers**: Directly matched to wages from the **Government of Canada Job Bank** (2023-2025 wage database updates) and employment projections from **COPS (Canadian Occupational Projection System) 2024-2033**.
- **Estimates**: Minor careers use standard formulas mapped to the National Occupational Classification (NOC 2021) TEER levels (0-5) and broad occupational categories.

## 3. AI Exposure
- **Ratings & Rationale**: Aligned with the Statistics Canada 2024 paper *"Experimental Estimates of Potential Artificial Intelligence Occupational Exposure in Canada"* (Mehdi & Morissette), categorizing university-educated cognitive roles as highly exposed, and health care, trades, and manual services as low/moderate exposure.
