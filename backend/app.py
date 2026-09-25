"""
CardioPredict – FastAPI Backend

Run train.py first, then:
    uvicorn app:app --reload --port 5000
"""

import os
import joblib
import numpy as np
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, model_validator
from contextlib import asynccontextmanager

BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model', 'model.pkl')
TMP_MODEL  = '/tmp/model.pkl'

bundle   = None
FEATURES = []

def _get_model_path():
    if os.path.exists(MODEL_PATH):
        return MODEL_PATH
    return TMP_MODEL if os.path.exists(TMP_MODEL) else None

def _train_and_save():
    import sys
    sys.path.insert(0, BASE_DIR)
    from train import train
    print("[CardioPredict] model.pkl not found — training now (first deploy)...")
    train(output_path=TMP_MODEL)
    print("[CardioPredict] Training done.")

# ── Load bundle on startup ─────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    global bundle, FEATURES
    path = _get_model_path()
    if path is None:
        _train_and_save()
        path = TMP_MODEL
    bundle   = joblib.load(path)
    FEATURES = bundle['features']
    models   = bundle['models']
    print(f"[CardioPredict] Loaded {len(models)} models: {', '.join(models.keys())}")
    yield
    bundle = None

# ── App ────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="CardioPredict API",
    description="Cardiovascular disease risk prediction — 2 models.",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Schemas ────────────────────────────────────────────────────────────────
class PatientInput(BaseModel):
    age:         int            = Field(..., ge=3650, le=43800)
    gender:      int            = Field(..., ge=1, le=2)
    height:      int            = Field(..., ge=100, le=220)
    weight:      float          = Field(..., ge=30, le=200)
    ap_hi:       int            = Field(..., ge=60, le=300)
    ap_lo:       int            = Field(..., ge=40, le=200)
    cholesterol: int            = Field(..., ge=1, le=3)
    gluc:        int            = Field(..., ge=1, le=3)
    smoke:       int            = Field(..., ge=0, le=1)
    alco:        int            = Field(..., ge=0, le=1)
    active:      int            = Field(..., ge=0, le=1)
    model:       Optional[str]  = None

    @model_validator(mode='after')
    def systolic_above_diastolic(self) -> 'PatientInput':
        if self.ap_hi <= self.ap_lo:
            raise ValueError("Systolic BP (ap_hi) must be greater than diastolic BP (ap_lo)")
        return self


class PredictionResponse(BaseModel):
    prediction:  int
    probability: float
    label:       str
    risk_level:  str
    model_used:  str
    model_key:   str
    inputs:      dict


# ── Helpers ────────────────────────────────────────────────────────────────
def risk_label(prob: float) -> str:
    if prob >= 0.75: return "High Risk"
    if prob >= 0.50: return "Moderate–High Risk"
    if prob >= 0.30: return "Moderate Risk"
    return "Low Risk"


# ── Routes ─────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    models = bundle['models'] if bundle else {}
    return {"status": "ok", "models_loaded": list(models.keys())}


@app.get("/models")
def list_models():
    if not bundle:
        raise HTTPException(status_code=503, detail="Models not loaded")
    return {
        "default": bundle["default"],
        "models": [
            {"key": k, "label": v["label"]}
            for k, v in bundle["models"].items()
        ],
    }


@app.post("/predict", response_model=PredictionResponse)
def predict(patient: PatientInput):
    if not bundle:
        raise HTTPException(status_code=503, detail="Models not loaded")

    model_key = patient.model or bundle["default"]
    if model_key not in bundle["models"]:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown model '{model_key}'. Available: {', '.join(bundle['models'].keys())}"
        )

    entry     = bundle["models"][model_key]
    estimator = entry["estimator"]
    scaler    = bundle["scaler"]

    row     = np.array([[getattr(patient, f) for f in FEATURES]])
    row_s   = scaler.transform(row)

    prediction  = int(estimator.predict(row_s)[0])
    probability = float(estimator.predict_proba(row_s)[0][1])

    return PredictionResponse(
        prediction  = prediction,
        probability = round(probability, 4),
        label       = "Cardiovascular Disease Detected" if prediction == 1
                      else "No Cardiovascular Disease",
        risk_level  = risk_label(probability),
        model_used  = entry["label"],
        model_key   = model_key,
        inputs      = {k: v for k, v in patient.model_dump().items() if k != "model"},
    )
