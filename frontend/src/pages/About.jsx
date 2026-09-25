import { useNavigate } from 'react-router-dom'
import styles from './About.module.css'

const MODEL_METRICS = [
  { key: 'random_forest', label: 'Random Forest', accuracy: 71.0, f1: 70.5, auc: 77.8 },
  { key: 'adaboost',      label: 'AdaBoost',      accuracy: 72.5, f1: 69.9, auc: 79.2 },
]

const FEATURE_IMPORTANCE = [
  { label: 'Systolic BP (ap_hi)', value: 42 },
  { label: 'Age',                  value: 18 },
  { label: 'Cholesterol',          value: 12 },
  { label: 'Weight',               value: 10 },
  { label: 'Diastolic BP (ap_lo)', value: 9  },
  { label: 'Glucose',              value: 5  },
  { label: 'Others',               value: 4  },
]

const IDEAL_RANGES = [
  { label: 'Blood Pressure',   value: '~120/80 mmHg' },
  { label: 'Cholesterol',      value: '< 200 mg/dL' },
  { label: 'Fasting Glucose',  value: '70–99 mg/dL' },
  { label: 'BMI',              value: '18.5–24.9' },
  { label: 'Physical Activity',value: '≥ 150 min/week' },
]

export default function About() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>

      {/* ── Page header ── */}
      <section className={styles.header}>
        <h1 className={styles.title}>About the Project</h1>
        <p className={styles.subtitle}>
          A machine learning tool that assesses cardiovascular disease risk based
          on clinical and lifestyle data — built as an academic ML project.
        </p>
        <p className={styles.disclaimer}>
          * Designed for educational purposes. Not a medical diagnosis tool.
        </p>
      </section>

      {/* ── Academic info ── */}
      <section className={styles.academicCard}>
        <div className={styles.academicLeft}>
          <p className={styles.university}>Darshan University</p>
          <p className={styles.department}>Department of Computer Engineering</p>
        </div>
        <div className={styles.academicRight}>
          <div className={styles.academicRow}>
            <span className={styles.academicLabel}>Student</span>
            <span className={styles.academicValue}>Hemang G. Joshi</span>
          </div>
          <div className={styles.academicRow}>
            <span className={styles.academicLabel}>Enrollment</span>
            <span className={styles.academicValue}>25010101630</span>
          </div>
          <div className={styles.academicRow}>
            <span className={styles.academicLabel}>Semester</span>
            <span className={styles.academicValue}>5 · Machine Learning · 2025–2026</span>
          </div>
          <div className={styles.academicRow}>
            <span className={styles.academicLabel}>Project</span>
            <span className={styles.academicValue}>Cardiovascular Disease Prediction</span>
          </div>
        </div>
      </section>

      {/* ── Data insights ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <DatabaseIcon /> Data Insights
        </h2>

        <div className={styles.card}>
          <div className={styles.sourceRow}>
            <span className={styles.sourceLabel}>Data Source</span>
            <span className={styles.sourceValue}>Cardiovascular Disease Dataset — Kaggle (sulianova)</span>
          </div>
          <div className={styles.dataStats}>
            <div className={styles.dataStat}>
              <span className={styles.dataStatNum}>70,000</span>
              <span className={styles.dataStatLabel}>Raw Records</span>
            </div>
            <div className={styles.dataStatDivider} />
            <div className={styles.dataStat}>
              <span className={styles.dataStatNum} style={{ color: 'var(--red)' }}>1,557</span>
              <span className={styles.dataStatLabel}>Rows Removed (2.22%)</span>
            </div>
            <div className={styles.dataStatDivider} />
            <div className={styles.dataStat}>
              <span className={styles.dataStatNum} style={{ color: 'var(--green)' }}>68,443</span>
              <span className={styles.dataStatLabel}>Final Training Records</span>
            </div>
          </div>
        </div>

        <div className={styles.twoCol}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}><InfoIcon /> Understanding CVD</h3>
            <p className={styles.cardBody}>
              Cardiovascular disease (CVD) covers conditions affecting the heart and blood vessels —
              coronary artery disease, heart attack, stroke. Risk drivers include blood pressure,
              cholesterol, glucose, and age. This model identifies patterns in historical clinical
              data to estimate risk probabilities for screening purposes.
            </p>
            <p className={styles.cardNote}>
              Consult a healthcare professional for medical decisions.
            </p>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}><CheckIcon /> Ideal Ranges Reference</h3>
            <div className={styles.rangeList}>
              {IDEAL_RANGES.map((r) => (
                <div key={r.label} className={styles.rangeRow}>
                  <span className={styles.rangeLabel}>{r.label}</span>
                  <span className={styles.rangeValue}>{r.value}</span>
                </div>
              ))}
            </div>
            <p className={styles.cardNote}>
              Values outside these ranges increase cardiovascular risk when combined.
            </p>
          </div>
        </div>
      </section>

      {/* ── Model info ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <ModelIcon /> Model Performance
        </h2>

        <div className={styles.card}>
          <p className={styles.cardSubtitle}>
            All 5 models trained on the same 68,443 cleaned records with an 80/20 train-test split.
          </p>
          <div className={styles.modelTable}>
            <div className={styles.modelTableHead}>
              <span>Algorithm</span>
              <span>Accuracy</span>
              <span>F1 Score</span>
              <span>ROC AUC</span>
            </div>
            {MODEL_METRICS.map((m, i) => (
              <div key={m.key} className={`${styles.modelRow} ${i === 0 ? styles.modelRowBest : ''}`}>
                <span className={styles.modelName}>
                  {i === 0 && <span className={styles.bestBadge}>default</span>}
                  {m.label}
                </span>
                <span className={styles.modelScore}>{m.accuracy}%</span>
                <span className={styles.modelScore}>{m.f1}%</span>
                <span className={styles.modelScore}>{m.auc}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}><TrendIcon /> Feature Importance</h3>
          <p className={styles.cardNote} style={{ marginBottom: 20 }}>
            Approximate relative importance based on Logistic Regression coefficients.
          </p>
          <div className={styles.barList}>
            {FEATURE_IMPORTANCE.map((f) => (
              <div key={f.label} className={styles.barRow}>
                <div className={styles.barMeta}>
                  <span className={styles.barLabel}>{f.label}</span>
                  <span className={styles.barValue}>{f.value}%</span>
                </div>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${f.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}><TuneIcon /> Architecture</h3>
          <div className={styles.archGrid}>
            <div className={styles.archItem}>
              <span className={styles.archKey}>Primary Algorithm</span>
              <span className={styles.archVal}>Logistic Regression</span>
            </div>
            <div className={styles.archItem}>
              <span className={styles.archKey}>Library</span>
              <span className={styles.archVal}>scikit-learn</span>
            </div>
            <div className={styles.archItem}>
              <span className={styles.archKey}>Preprocessing</span>
              <span className={styles.archVal}>StandardScaler</span>
            </div>
            <div className={styles.archItem}>
              <span className={styles.archKey}>Features Used</span>
              <span className={styles.archVal}>11</span>
            </div>
            <div className={styles.archItem}>
              <span className={styles.archKey}>Hyperparameter</span>
              <span className={styles.archVal}>C = 1.0 (GridSearchCV)</span>
            </div>
            <div className={styles.archItem}>
              <span className={styles.archKey}>Train/Test Split</span>
              <span className={styles.archVal}>80% / 20%</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section className={styles.section}>
        <div className={styles.disclaimerBox}>
          <WarningIcon />
          <div>
            <p className={styles.disclaimerTitle}>Disclaimer</p>
            <p className={styles.disclaimerBody}>
              This tool is built for academic/educational purposes as part of a Machine Learning
              course project. Predictions are based on a trained statistical model and are{' '}
              <strong>NOT a medical diagnosis</strong>. Always consult a qualified healthcare
              professional for medical advice.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <button className={styles.ctaBtn} onClick={() => navigate('/predict')}>
          Ready to check your risk? Try the Assessment →
        </button>
      </section>

      <footer className={styles.footer}>
        CardioPredict <span className={styles.sep}>|</span> Cardiovascular Disease Dataset <span className={styles.sep}>|</span> Educational use only
      </footer>
    </div>
  )
}

function DatabaseIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
}
function InfoIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
}
function CheckIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
}
function ModelIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
}
function TrendIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
}
function TuneIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
}
function WarningIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginTop:2}}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
}
