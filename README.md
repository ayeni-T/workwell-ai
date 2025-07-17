# WorkWell AI

**WorkWell AI** is an AI-powered employee wellness monitoring platform that proactively detects early signs of workplace burnout and stress using behavioral, communication, and performance data. Built for modern organizations and inspired by the post-pandemic mental health crisis in Canada, it empowers employers to take a proactive role in supporting mental well-being.

🧠 **Presented at**: Husky Pitch Summit – Northeastern University, July 16, 2025

---

## 🎯 Purpose & Problem Statement

The Canadian workplace is experiencing a mental health crisis:

- 🧑‍💼 1 in 5 workers report high or very high stress at work  
- 💰 Mental health accounts for **30%** of disability claims  
- 💸 The economic cost is estimated at **$50 billion annually**

**Problem**: Traditional interventions are reactive and limited to healthcare systems, which are overwhelmed.

**Solution**: *WorkWell AI* bridges this gap by transforming reactive wellness checks into **predictive, AI-driven care**—alerting stakeholders before burnout fully manifests.

---

## 🧠 How It Works – System Overview

WorkWell AI continuously collects and processes data from five core dimensions:

1. **Workload Metrics**  
   (e.g., hours worked, meeting load, email activity after hours)

2. **Relationship & Team Dynamics**  
   (e.g., manager support, collaboration scores)

3. **Behavioral Patterns**  
   (e.g., break frequency, schedule irregularities)

4. **Self-Reported Wellness**  
   (e.g., surveys on work-life balance, role clarity, stress levels)

5. **Performance Signals**  
   (e.g., task completion rates, innovation input)

### ⚙️ Workflow Architecture

1. **Data Ingestion** – via manual inputs, HR system integration, and survey forms  
2. **Feature Extraction & Preprocessing** – using `stress_predictor.py`  
3. **ML-Based Prediction** – outputs a **WellScore** (0–100 scale)  
4. **Role-Based Dashboards** – separate views for Employee, Manager, HR, and Admin  
5. **Smart Chatbot Assistant** – provides personalized insights and suggestions

---

## 🔐 Platform Features

| Feature                | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| **AI Stress Prediction** | Machine learning model trained on simulated behavior datasets               |
| **WellScore Dashboard**  | Color-coded risk score (Green <33, Yellow 34–66, Red >67)                  |
| **Role-Based Access**    | Tailored dashboards: Employee, Manager, HR, Admin                         |
| **Interactive Chatbot**  | Offers support tips, self-care reminders, and stress coping suggestions    |
| **Secure JWT Auth**      | Token-based login and protected routes (Flask-JWT-Extended)                |
| **Performance Reports**  | Managers see team stress trends; HR sees company-wide heatmaps             |

---

## 🧰 Tech Stack

- **Frontend**: React.js, CSS, Tailwind  
- **Backend**: Flask (Python), REST APIs  
- **Database**: SQLite  
- **ML Model**: Scikit-learn, joblib  
- **Auth**: Flask-JWT-Extended  
- **Deployment**: Local with Flask CLI / Gunicorn  
- **Demo Tooling**: Bat scripts for rapid startup

---

## 📂 Project Structure

```
workwell-ai/
│
├── backend/
│   ├── app_backend.py
│   ├── stress_predictor.py
│   ├── database_schema.py
│   ├── realistic_mental_health_model.pkl
│   └── ...
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── ...
│
├── run_all.bat
├── Demo video.mp4
└── README.md
```

> 🚫 Excluded: `__pycache__/`, `venv/`, `node_modules/` — per `.gitignore`

---

## 🚀 Running the App Locally

### 🔧 Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
python app_backend.py
```

### 🌐 Frontend

```bash
cd frontend
npm install
npm start
```

- Frontend: `http://localhost:3000`  
- Backend: `http://localhost:5000`

---

## 📽 Demo Video

🎥 [Click to view full app demo](https://1drv.ms/v/c/3c315530817a4e8e/EXlsJKcuUslFtWBMKR-lpYsBoaRmtsAFaBW3l0HEYqTf6Q?e=aCS2UD)

---

## 👥 Team

- **Taiwo Michael Ayeni** – [@ayeni-T](https://github.com/ayeni-T)  
- **Paul Ojenomo** -[@jaydgreat](https://github.com/jaydgreat)

---

## 📚 References

- Canadian Mental Health Association (2025). *Workplace Mental Health Trends*. Retrieved July 16, 2025, from https://cmha.ca  
- Canadian Healthcare Trends (2025). *Economic Burden of Mental Health*. Retrieved July 16, 2025, from https://healthcarecan.ca  
- Mental Health Research Canada (MHRC). (2024). *Post-pandemic mental health impact*. Retrieved July 16, 2025, from https://mhrc.ca

---

## 📜 License

This repository is for educational and demonstration purposes only.  
© 2025 Taiwo Michael Ayeni & Paul Ojenomo.
