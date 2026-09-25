import { useState } from 'react'
import styles from './PredictionForm.module.css'

const MODELS = [
  { key: 'random_forest', label: 'Random Forest' },
  { key: 'adaboost',      label: 'AdaBoost' },
]

const INITIAL = {
  age: '',
  gender: '1',
  height: '',
  weight: '',
  ap_hi: '',
  ap_lo: '',
  cholesterol: '1',
  gluc: '1',
  smoke: '0',
  alco: '0',
  active: '1',
  model: 'random_forest',
}

const PRESETS = [
  {
    label: 'High Risk',
    color: '#ff3b30',
    description: '58yr male, high BP, smoker',
    data: {
      age: '58', gender: '2', height: '175', weight: '95',
      ap_hi: '165', ap_lo: '100', cholesterol: '3', gluc: '2',
      smoke: '1', alco: '1', active: '0', model: 'random_forest',
    },
  },
  {
    label: 'Moderate Risk',
    color: '#ff9500',
    description: '50yr male, slightly high BP',
    data: {
      age: '50', gender: '2', height: '170', weight: '82',
      ap_hi: '135', ap_lo: '85', cholesterol: '2', gluc: '1',
      smoke: '0', alco: '0', active: '1', model: 'random_forest',
    },
  },
  {
    label: 'Low Risk',
    color: '#34c759',
    description: '35yr female, healthy vitals',
    data: {
      age: '35', gender: '1', height: '165', weight: '62',
      ap_hi: '115', ap_lo: '75', cholesterol: '1', gluc: '1',
      smoke: '0', alco: '0', active: '1', model: 'random_forest',
    },
  },
]

/* Bounds mirror the FastAPI schema exactly, so the form never
   sends a payload the model will reject with a 422. */
const BOUNDS = {
  age: [10, 120, 'Age must be between 10 and 120 years'],
  height: [100, 220, 'Height must be between 100 and 220 cm'],
  weight: [30, 200, 'Weight must be between 30 and 200 kg'],
  ap_hi: [60, 300, 'Systolic pressure must be between 60 and 300'],
  ap_lo: [40, 200, 'Diastolic pressure must be between 40 and 200'],
}

export default function PredictionForm({ onSubmit, loading }) {
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})

  const set = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: null } : prev))
  }

  const validate = () => {
    const found = {}

    for (const [field, [min, max, message]] of Object.entries(BOUNDS)) {
      const value = Number(form[field])
      if (form[field] === '' || Number.isNaN(value) || value < min || value > max) {
        found[field] = message
      }
    }

    if (!found.ap_hi && !found.ap_lo && Number(form.ap_hi) <= Number(form.ap_lo)) {
      found.ap_hi = 'Systolic pressure must be higher than diastolic'
    }

    return found
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    onSubmit({
      age:         Math.round(Number(form.age) * 365),
      gender:      Number(form.gender),
      height:      Number(form.height),
      weight:      Number(form.weight),
      ap_hi:       Number(form.ap_hi),
      ap_lo:       Number(form.ap_lo),
      cholesterol: Number(form.cholesterol),
      gluc:        Number(form.gluc),
      smoke:       Number(form.smoke),
      alco:        Number(form.alco),
      active:      Number(form.active),
      model:       form.model,
    })
  }

  const bpError = errors.ap_hi || errors.ap_lo
  const bodyError = errors.age || errors.height || errors.weight

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>

      <div className={styles.presets}>
        <span className={styles.presetsLabel}>Try a demo</span>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            className={styles.presetBtn}
            onClick={() => { setForm(p.data); setErrors({}) }}
          >
            <span className={styles.presetDot} style={{ background: p.color }} />
            <span className={styles.presetName}>{p.label}</span>
            <span className={styles.presetDesc}>{p.description}</span>
          </button>
        ))}
      </div>

      <Group
        eyebrow="About the patient"
        footnote={bodyError || bmiNote(form.weight, form.height)}
        invalid={Boolean(bodyError)}
      >
        <NumberRow label="Age" unit="yrs" value={form.age} onChange={set('age')} invalid={errors.age} />
        <SegmentRow
          label="Gender"
          value={form.gender}
          onChange={set('gender')}
          options={[
            ['1', 'Female'],
            ['2', 'Male'],
          ]}
        />
        <NumberRow label="Height" unit="cm" value={form.height} onChange={set('height')} invalid={errors.height} />
        <NumberRow label="Weight" unit="kg" value={form.weight} onChange={set('weight')} invalid={errors.weight} step="0.1" />
      </Group>

      <Group
        eyebrow="Blood pressure"
        footnote={bpError || bpNote(form.ap_hi, form.ap_lo)}
        invalid={Boolean(bpError)}
      >
        <NumberRow label="Systolic" unit="mmHg" value={form.ap_hi} onChange={set('ap_hi')} invalid={errors.ap_hi} />
        <NumberRow label="Diastolic" unit="mmHg" value={form.ap_lo} onChange={set('ap_lo')} invalid={errors.ap_lo} />
      </Group>

      <Group eyebrow="Lab results" footnote="Measured against the reference range for the patient’s age.">
        <SegmentRow
          label="Cholesterol"
          value={form.cholesterol}
          onChange={set('cholesterol')}
          options={[
            ['1', 'Normal'],
            ['2', 'Above'],
            ['3', 'Well above'],
          ]}
        />
        <SegmentRow
          label="Glucose"
          value={form.gluc}
          onChange={set('gluc')}
          options={[
            ['1', 'Normal'],
            ['2', 'Above'],
            ['3', 'Well above'],
          ]}
        />
      </Group>

      <Group eyebrow="Lifestyle" footnote="Self-reported by the patient.">
        <SwitchRow label="Smokes" value={form.smoke} onChange={set('smoke')} />
        <SwitchRow label="Drinks alcohol" value={form.alco} onChange={set('alco')} />
        <SwitchRow label="Physically active" value={form.active} onChange={set('active')} />
      </Group>

      <Group eyebrow="Model" footnote="All models trained on the same 70,000 patient records.">
        <ModelRow value={form.model} onChange={set('model')} />
      </Group>

      <div className={styles.clearWrap}>
        <button
          type="button"
          className={styles.clear}
          onClick={() => {
            setForm(INITIAL)
            setErrors({})
          }}
        >
          Clear
        </button>
      </div>

      <div className={styles.dock}>
        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? <Spinner /> : null}
          {loading ? 'Calculating' : 'Calculate risk'}
        </button>
      </div>
    </form>
  )
}

/* ── Grouped inset list ─────────────────────────────────── */

function Group({ eyebrow, footnote, invalid, children }) {
  return (
    <section className={styles.group}>
      <h2 className={styles.eyebrow}>{eyebrow}</h2>
      <div className={styles.rows}>{children}</div>
      {footnote && (
        <p className={`${styles.footnote} ${invalid ? styles.footnoteError : ''}`}>{footnote}</p>
      )}
    </section>
  )
}

function NumberRow({ label, unit, value, onChange, invalid, step }) {
  return (
    <label className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.numberField}>
        <input
          type="number"
          inputMode="decimal"
          step={step}
          className={`${styles.input} ${invalid ? styles.inputError : ''}`}
          value={value}
          placeholder="—"
          onChange={(e) => onChange(e.target.value)}
        />
        <span className={styles.unit}>{unit}</span>
      </span>
    </label>
  )
}

function SegmentRow({ label, value, onChange, options }) {
  const index = options.findIndex(([key]) => key === value)

  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <div className={styles.segmented} role="radiogroup" aria-label={label}>
        <span
          className={styles.thumb}
          style={{
            width: `calc((100% - 4px) / ${options.length})`,
            transform: `translateX(${index * 100}%)`,
          }}
        />
        {options.map(([key, text]) => (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={value === key}
            className={`${styles.segment} ${value === key ? styles.segmentOn : ''}`}
            onClick={() => onChange(key)}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  )
}

function SwitchRow({ label, value, onChange }) {
  const on = value === '1'
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        className={`${styles.switch} ${on ? styles.switchOn : ''}`}
        onClick={() => onChange(on ? '0' : '1')}
      >
        <span className={styles.knob} />
      </button>
    </div>
  )
}

function Spinner() {
  return <span className={styles.spinner} aria-hidden="true" />
}

function ModelRow({ value, onChange }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>Algorithm</span>
      <div className={styles.selectWrap}>
        <select
          className={styles.modelSelect}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {MODELS.map((m) => (
            <option key={m.key} value={m.key}>{m.label}</option>
          ))}
        </select>
        <svg className={styles.selectChevron} width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}

/* ── Live footnotes ─────────────────────────────────────── */

function bmiNote(weight, height) {
  const w = Number(weight)
  const h = Number(height)
  if (!w || !h) return 'Height and weight are used to derive body mass index.'

  const bmi = w / (h / 100) ** 2
  if (!Number.isFinite(bmi)) return null

  const band =
    bmi < 18.5 ? 'underweight' : bmi < 25 ? 'normal' : bmi < 30 ? 'overweight' : 'obese'
  return `BMI ${bmi.toFixed(1)} — ${band}.`
}

function bpNote(hi, lo) {
  const h = Number(hi)
  const l = Number(lo)
  if (!h || !l) return 'Normal is under 120 over 80.'

  if (h >= 140 || l >= 90) return `${h}/${l} — stage 2 hypertension.`
  if (h >= 130 || l >= 80) return `${h}/${l} — stage 1 hypertension.`
  if (h >= 120) return `${h}/${l} — elevated.`
  return `${h}/${l} — normal.`
}
