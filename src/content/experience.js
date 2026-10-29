/*
 * Professional experience: where Manoj worked, in what role, when, and what he was
 * responsible for. Newest first; the first entry is the one summarised on Home and
 * Contact.
 *
 * Keep project results (metrics, validation, findings) in projects.js. An entry can
 * point to the system it produced with `project`, so the two link to each other
 * instead of repeating each other.
 *
 * Fields: role, org, dates (display text), current (boolean) required; location,
 * summary (one line), did (what the role involved, as short bullets), tools, project
 * (a project id) optional. Source: the résumé's work-experience bullets.
 */
export default [
  {
    role: "Research intern",
    org: "C3I, PES University",
    location: "Bengaluru",
    dates: "Jan — May 2026",
    current: false,
    summary: "Research under faculty supervision: an explainable, multimodal machine-learning pipeline predicting 10-day price direction for 40 Indian large-cap equities.",
    did: [
      "Combined price and technical indicators, fundamentals, FinBERT news sentiment and macroeconomic events into a 68-feature dataset.",
      "Engineered a per-stock sentiment-decay feature tuned on training data only, and guarded against lookahead bias with time-based splits, an automated leakage audit and a 17-test regression suite.",
      "Trained an AUC-weighted XGBoost and LSTM ensemble and reported its result as measured, including where it fell below a simple always-up baseline.",
      "Designed a regime-adaptive confidence threshold that produces a ranked daily watchlist, and backtested the ensemble signals with 0.1% transaction costs; no trading edge is claimed.",
      "Turned SHAP attributions into plain-English, per-prediction explanations in a Streamlit app for non-technical users.",
    ],
    tools: ["Python", "XGBoost", "LSTM", "PyTorch", "FinBERT", "SHAP", "Streamlit"],
    project: "c3i",
  },
];
