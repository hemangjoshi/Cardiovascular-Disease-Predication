# CardioPredict – Full Stack ML App

Cardiovascular disease risk predictor built with **React + Vite** (frontend) and **FastAPI + Scikit-learn** (backend).

---

## Project Structure

```
Project/
├── cardio_train.csv          ← dataset (70,000 records)
├── ML_Project.ipynb          ← Jupyter analysis notebook
├── backend/
│   ├── app.py                ← FastAPI server (trains model on startup)
│   └── requirements.txt
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── App.jsx           ← routing only
        ├── index.css         ← global design tokens
        ├── main.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── PredictionForm.jsx
        │   └── ResultCard.jsx
        └── pages/
            ├── Home.jsx      ← landing page
            └── Predict.jsx   ← form + result page
```

---

## How to Run

### 1 — Start the Backend

```bash
cd Project/backend

pip install -r requirements.txt

uvicorn app:app --reload --port 5000
```

API → **http://localhost:5000**  
Swagger docs → **http://localhost:5000/docs**

### 2 — Start the Frontend

Open a **second terminal**:

```bash
cd Project/frontend

npm install

npm run dev
```

Open **http://localhost:3000**

---

## API Reference

### `POST /predict`

| Field | Type | Description |
|---|---|---|
| `age` | int | Age in **days** (years × 365) |
| `gender` | int | 1 = Female, 2 = Male |
| `height` | int | cm |
| `weight` | float | kg |
| `ap_hi` | int | Systolic BP (mmHg) |
| `ap_lo` | int | Diastolic BP (mmHg) |
| `cholesterol` | int | 1 = Normal, 2 = Above, 3 = Well Above |
| `gluc` | int | 1 = Normal, 2 = Above, 3 = Well Above |
| `smoke` | int | 0 / 1 |
| `alco` | int | 0 / 1 |
| `active` | int | 0 / 1 |

**Response:**

```json
{
  "prediction": 1,
  "probability": 0.7342,
  "label": "Cardiovascular Disease Detected",
  "risk_level": "High Risk",
  "inputs": { ... }
}
```

### `GET /health`

Returns `{ "status": "ok" }` — use to check the server is up.
