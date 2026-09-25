import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            Health Intelligence
          </p>
          <h1 className={styles.title}>
            Know your<br />
            <span className={styles.accent}>heart risk</span><br />
            in seconds.
          </h1>
          <p className={styles.subtitle}>
            Enter 11 clinical measures. Our model — trained on 70,000 patient records —
            returns your estimated cardiovascular disease probability instantly.
          </p>
          <div className={styles.heroCtas}>
            <button className={styles.ctaPrimary} onClick={() => navigate('/predict')}>
              Start Evaluation →
            </button>
            <button className={styles.ctaSecondary} onClick={() => navigate('/about')}>
              Explore the Method
            </button>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>70K+</span>
              <span className={styles.heroStatLabel}>training records</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>11</span>
              <span className={styles.heroStatLabel}>patient inputs</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>5</span>
              <span className={styles.heroStatLabel}>ML models</span>
            </div>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.visualCard}>
            <p className={styles.visualLabel}>Live Risk Estimate</p>
            <div className={styles.visualRing}>
              <svg viewBox="0 0 120 120" className={styles.visualSvg}>
                <circle cx="60" cy="60" r="50" className={styles.trackCircle} />
                <circle cx="60" cy="60" r="50" className={styles.progressCircle} />
              </svg>
              <div className={styles.visualCenter}>
                <span className={styles.visualPct}>73%</span>
                <span className={styles.visualPctLabel}>risk</span>
              </div>
            </div>
            <p className={styles.visualRisk}>Moderate–High Risk</p>
            <div className={styles.visualPills}>
              <span className={styles.pill}><span className={styles.pillDot} style={{ background: '#ff3b30' }} />Age 54</span>
              <span className={styles.pill}><span className={styles.pillDot} style={{ background: '#ff9500' }} />BP 140/90</span>
              <span className={styles.pill}><span className={styles.pillDot} style={{ background: '#34c759' }} />Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature cards ── */}
      <section className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <DatabaseIcon />
          </div>
          <p className={styles.featureEyebrow}>Data Foundation</p>
          <h3 className={styles.featureTitle}>70,000 patient records</h3>
          <p className={styles.featureBody}>
            Demographic, vital-sign, and lifestyle data from Kaggle's cardiovascular
            disease dataset, cleaned and validated before training.
          </p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <ChartIcon />
          </div>
          <p className={styles.featureEyebrow}>Risk Clarity</p>
          <h3 className={styles.featureTitle}>Probability + risk label</h3>
          <p className={styles.featureBody}>
            See the exact probability score alongside a Low / Moderate / High risk
            classification with an animated visual.
          </p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <ModelsIcon />
          </div>
          <p className={styles.featureEyebrow}>5 ML Models</p>
          <h3 className={styles.featureTitle}>Pick your algorithm</h3>
          <p className={styles.featureBody}>
            Logistic Regression, Decision Tree, Naive Bayes, Random Forest, and KNN —
            compare predictions across all five in one form.
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className={styles.flow}>
        <div className={styles.flowHeader}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowDot} />
              Evaluation Flow
            </p>
            <h2 className={styles.flowTitle}>Structured inputs.<br />Measurable confidence.</h2>
          </div>
          <p className={styles.flowDesc}>
            Every evaluation follows the same clear path, making the model
            easier to use and the output easier to explain.
          </p>
        </div>

        <div className={styles.steps}>
          <div className={styles.step}>
            <span className={styles.stepNum}>01</span>
            <h4 className={styles.stepTitle}>Capture context</h4>
            <p className={styles.stepBody}>Record age, vitals, cholesterol, glucose, and lifestyle details in one form.</p>
          </div>
          <div className={styles.stepArrow}>→</div>
          <div className={styles.step}>
            <span className={styles.stepNum}>02</span>
            <h4 className={styles.stepTitle}>Encode features</h4>
            <p className={styles.stepBody}>Data is scaled and fed into the selected ML model running in the backend.</p>
          </div>
          <div className={styles.stepArrow}>→</div>
          <div className={styles.step}>
            <span className={styles.stepNum}>03</span>
            <h4 className={styles.stepTitle}>Review risk</h4>
            <p className={styles.stepBody}>Get a probability score and risk tier to inform the next decision.</p>
          </div>
        </div>

        <div className={styles.callout}>
          <ShieldIcon />
          <p>Model responses are returned with clear probability context. Not a medical diagnosis.</p>
        </div>
      </section>

      <footer className={styles.footer}>
        CardioPredict <span className={styles.sep}>|</span> Cardiovascular Disease Dataset <span className={styles.sep}>|</span> Educational use only
      </footer>
    </div>
  )
}

function DatabaseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>
  )
}
function ChartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  )
}
function ModelsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
    </svg>
  )
}
function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
}
