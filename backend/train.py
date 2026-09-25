"""
train.py — trains 5 models and saves them as one bundle.

    python train.py

Saves model/model.pkl then app.py loads it.
"""

import os
import joblib
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score

BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
DATA_PATH  = os.path.join(BASE_DIR, '..', 'cardio_train.csv')
MODEL_DIR  = os.path.join(BASE_DIR, 'model')
MODEL_PATH = os.path.join(MODEL_DIR, 'model.pkl')

FEATURES = ['age', 'gender', 'height', 'weight',
            'ap_hi', 'ap_lo', 'cholesterol', 'gluc',
            'smoke', 'alco', 'active']

MODELS = {
    'random_forest': (RandomForestClassifier(n_estimators=20, max_depth=10, random_state=42, n_jobs=-1), 'Random Forest'),
    'adaboost':      (AdaBoostClassifier(n_estimators=50, random_state=42),                             'AdaBoost'),
}

def train(output_path=None):
    print("Loading data...")
    df = pd.read_csv(DATA_PATH, sep=';')
    print(f"Raw records  : {len(df)}")

    df = df[(df['ap_hi']  >= 60)  & (df['ap_hi']  <= 250)]
    df = df[(df['ap_lo']  >= 40)  & (df['ap_lo']  <= 200)]
    df = df[df['ap_hi'] > df['ap_lo']]
    df = df[(df['height'] >= 100) & (df['height'] <= 220)]
    df = df[(df['weight'] >= 30)  & (df['weight'] <= 200)]
    print(f"After clean  : {len(df)}")

    X = df[FEATURES].values
    y = df['cardio'].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s  = scaler.transform(X_test)

    trained = {}
    print("\nTraining models...")
    print(f"{'Model':<25} {'Accuracy':>10} {'F1-Score':>10}")
    print("-" * 47)

    for key, (model, label) in MODELS.items():
        model.fit(X_train_s, y_train)
        y_pred = model.predict(X_test_s)
        acc = accuracy_score(y_test, y_pred)
        f1  = f1_score(y_test, y_pred)
        print(f"{label:<25} {acc:>10.4f} {f1:>10.4f}")
        trained[key] = {'estimator': model, 'label': label}

    bundle = {
        'features': FEATURES,
        'scaler':   scaler,
        'models':   trained,
        'default':  'random_forest',
    }

    save_path = output_path or MODEL_PATH
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    joblib.dump(bundle, save_path, compress=3)
    print(f"\nSaved → {save_path}")

if __name__ == '__main__':
    train()
