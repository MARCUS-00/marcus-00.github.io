/*
 * Skills: a competency inventory, answering "what can he work with?". Where each skill was
 * demonstrated is the job of the Work case studies, which list their own tools, so skills do
 * not link to projects.
 *
 * Grouped as on the résumé and ordered for an analyst reader: SQL, BI and data processing
 * first, then analytics and statistics, with machine learning and tooling last. Within a group,
 * the most role-relevant items come first.
 *
 * Source: the résumé's skills section (Oct 2026). No proficiency levels, ratings or bars, so
 * the résumé's "Advanced Excel" is listed as Excel. Do not add: REST endpoints, A/B testing,
 * statsmodels (no current source).
 */
export default [
  {
    group: "SQL and databases",
    items: ["SQL", "PostgreSQL", "MySQL", "Joins, CTEs and window functions", "Star-schema data modelling"],
  },
  {
    group: "BI and visualisation",
    items: ["Power BI", "DAX", "Power Query", "Excel (pivot tables, VLOOKUP/XLOOKUP)", "Tableau"],
  },
  {
    group: "Data processing",
    items: ["Python", "pandas", "NumPy", "ETL pipelines", "Data cleaning and validation", "Data-quality tests", "Reconciliation"],
  },
  {
    group: "Analytics and statistics",
    items: ["Hypothesis testing (Mann-Whitney U)", "Cohort, RFM and Pareto analysis", "Root-cause analysis", "Time-series forecasting (Holt-Winters)", "Walk-forward backtesting", "KPI reporting"],
  },
  {
    group: "Machine learning",
    items: ["scikit-learn", "XGBoost", "TensorFlow and Keras", "PyTorch", "CNN and LSTM", "SHAP", "FinBERT", "OpenCV", "Optuna"],
  },
  {
    group: "Tools and development",
    items: ["Git", "GitHub Actions (CI/CD)", "Docker", "Jupyter", "Flask", "Streamlit", "Jira", "Agile", "SDLC"],
  },
].map((g) => ({ group: g.group, items: g.items.map((name) => ({ name })) }));
