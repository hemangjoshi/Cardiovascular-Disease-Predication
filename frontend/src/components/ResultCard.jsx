import { useEffect, useState } from 'react'
import styles from './ResultCard.module.css'

const R = 88
const CIRCUMFERENCE = 2 * Math.PI * R

/* Ring gradients follow Apple's activity-ring construction:
   a warm two-stop sweep, tinted to the risk tier. */
const TIERS = [
  { min: 0.75, key: 'high', from: '#FA114F', to: '#FF5E3A' },
  { min: 0.5, key: 'raised', from: '#FF3B30', to: '#FF9500' },
  { min: 0.3, key: 'moderate', from: '#FF9500', to: '#FFCC00' },
  { min: 0, key: 'low', from: '#34C759', to: '#30D158' },
]

const tierFor = (p) => TIERS.find((t) => p >= t.min) ?? TIERS.at(-1)

export default function ResultCard({ result, onReset }) {
  const { probability, prediction, risk_level: riskLevel, model_used, inputs } = result
  const tier = tierFor(probability)
  const percent = useCountUp(probability * 100)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setDrawn(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className={styles.wrap}>
      <div className={styles.ringBlock}>
        <svg className={styles.ring} viewBox="0 0 200 200" role="img"
             aria-label={`${(probability * 100).toFixed(0)} percent estimated risk`}>
          <defs>
            <linearGradient id="riskGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={tier.from} />
              <stop offset="100%" stopColor={tier.to} />
            </linearGradient>
          </defs>

          <circle className={styles.track} cx="100" cy="100" r={R} stroke={tier.from} />
          <circle
            className={styles.progress}
            cx="100"
            cy="100"
            r={R}
            stroke="url(#riskGradient)"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={drawn ? CIRCUMFERENCE * (1 - probability) : CIRCUMFERENCE}
          />
        </svg>

        <div className={styles.center}>
          <span className={styles.percent}>{percent.toFixed(0)}</span>
          <span className={styles.percentMark}>%</span>
        </div>
      </div>

      <h1 className={styles.verdict} style={{ color: tier.from }}>
        {riskLevel ?? (prediction === 1 ? 'Elevated risk' : 'Low risk')}
      </h1>
      {model_used && (
        <p className={styles.modelBadge}>{model_used}</p>
      )}
      <p className={styles.summary}>
        {prediction === 1
          ? 'The model classifies this patient as likely to have cardiovascular disease.'
          : 'The model classifies this patient as unlikely to have cardiovascular disease.'}
      </p>

      <section className={styles.group}>
        <h2 className={styles.eyebrow}>What the model saw</h2>
        <div className={styles.rows}>
          <Row label="Age" value={`${Math.round(inputs.age / 365)} yrs`} />
          <Row label="Gender" value={inputs.gender === 2 ? 'Male' : 'Female'} />
          <Row label="Height" value={`${inputs.height} cm`} />
          <Row label="Weight" value={`${inputs.weight} kg`} />
          <Row label="Body mass index" value={bmi(inputs.weight, inputs.height)} />
          <Row label="Blood pressure" value={`${inputs.ap_hi}/${inputs.ap_lo} mmHg`} />
          <Row label="Cholesterol" value={LEVELS[inputs.cholesterol]} />
          <Row label="Glucose" value={LEVELS[inputs.gluc]} />
          <Row label="Smokes" value={inputs.smoke ? 'Yes' : 'No'} />
          <Row label="Drinks alcohol" value={inputs.alco ? 'Yes' : 'No'} />
          <Row label="Physically active" value={inputs.active ? 'Yes' : 'No'} />
        </div>
        <p className={styles.footnote}>
          Not a diagnosis. This is a student model trained on 70,000 records for coursework —
          clinical decisions belong to a doctor.
        </p>
      </section>

      <button type="button" className={styles.again} onClick={onReset}>
        Score another patient
      </button>
    </div>
  )
}

const LEVELS = { 1: 'Normal', 2: 'Above normal', 3: 'Well above normal' }

function Row({ label, value }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value}</span>
    </div>
  )
}

function bmi(weight, height) {
  if (!weight || !height) return '—'
  const value = weight / (height / 100) ** 2
  const band =
    value < 18.5 ? 'Underweight' : value < 25 ? 'Normal' : value < 30 ? 'Overweight' : 'Obese'
  return `${value.toFixed(1)} · ${band}`
}

/* Counts up to the target, unless the reader asked for less motion. */
function useCountUp(target, duration = 950) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (still) {
      setValue(target)
      return
    }

    let frame
    const start = performance.now()

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      setValue(target * (1 - (1 - t) ** 3)) // ease-out cubic
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return value
}
