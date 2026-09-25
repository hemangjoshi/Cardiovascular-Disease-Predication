import { useCallback, useEffect, useState } from 'react'
import PredictionForm from '../components/PredictionForm'
import ResultCard from '../components/ResultCard'
import styles from './Predict.module.css'

function readApiError(payload, status) {
  const detail = payload?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail.length > 0) {
    const [first] = detail
    const message = String(first.msg ?? '').replace(/^Value error,\s*/, '')
    const field = first.loc?.at(-1)
    return field && field !== 'body' ? `${field}: ${message}` : message
  }
  return `Request failed (${status})`
}

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export default function Predict() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [api, setApi] = useState('checking')

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/health`)
      setApi(res.ok ? 'online' : 'offline')
    } catch {
      setApi('offline')
    }
  }, [])

  useEffect(() => { checkHealth() }, [checkHealth])

  const handleSubmit = async (payload) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const body = await res.json().catch(() => null)
      if (!res.ok) throw new Error(readApiError(body, res.status))
      setApi('online')
      setResult(body)
    } catch (err) {
      const offline = err instanceof TypeError
      if (offline) setApi('offline')
      setError(
        offline
          ? 'Can\'t reach the model. Run "uvicorn app:app --reload --port 5000" in the backend folder.'
          : err.message
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.layout}>

      {/* ── Left panel ── */}
      <div className={`${styles.left} ${result ? styles.leftResult : ''}`}>
        {result ? (
          <ResultCard result={result} onReset={() => setResult(null)} />
        ) : (
          <div className={styles.intro}>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowDot} />
              Risk Assessment
            </p>
            <h1 className={styles.title}>Heart<br />risk score</h1>
            <p className={styles.lede}>
              Fill in 11 clinical measures on the right.
              The model returns a probability score in seconds.
            </p>

            <div className={styles.infoCards}>
              <div className={styles.infoCard}>
                <span className={styles.infoNum}>70K</span>
                <span className={styles.infoLabel}>training records</span>
              </div>
              <div className={styles.infoCard}>
                <span className={styles.infoNum}>2</span>
                <span className={styles.infoLabel}>ML models</span>
              </div>
              <div className={styles.infoCard}>
                <span className={styles.infoNum}>~74%</span>
                <span className={styles.infoLabel}>accuracy</span>
              </div>
            </div>

            <button
              type="button"
              className={styles.statusBtn}
              onClick={checkHealth}
              title="Check model connection"
            >
              <span className={`${styles.dot} ${styles[api]}`} />
              {api === 'online' ? 'Model ready' : api === 'offline' ? 'Model offline' : 'Connecting…'}
            </button>

            {error && <p className={styles.error} role="alert">{error}</p>}

            <p className={styles.footnote}>
              Not a medical diagnosis. Educational use only.
            </p>
          </div>
        )}
      </div>

      {/* ── Right panel — form ── */}
      <div className={styles.right}>
        <PredictionForm onSubmit={handleSubmit} loading={loading} />
      </div>

    </div>
  )
}
