As a clinical researcher, I can tell you that your technology stack—React for a highly responsive frontend, Tailwind for clean UI components, and Python for handling complex backend calculations—is well-suited for this project.

To bridge the gap between clinical reality and your development team, I have outlined the core Functional Requirements Document (FRD) below. This details the exact hardware data sources, tracking mechanisms, and algorithmic logic your application must support.

### **1\. Client Environment & Hardware Data Sources**

Your application needs to act as a centralized hub that can interpret or manually ingest data from specific clinical hardware.

* **Target Devices:** The application must function natively via web browsers (Safari, Chrome, Firefox) on iPads and laptops, requiring no dedicated app downloads.

* **Continuous Telemetry (Real-Time Data):** The system should account for inputs from bedside monitors like the Philips IntelliVue, which uses the DXL algorithm to provide real-time QT interval readings.  
* **Intermittent 12-Lead ECGs:** The system must track baseline and follow-up data from devices like the Schiller ETM, which uses a Minnesota Code-based algorithm.  
* **High-Fidelity Post-Session Tracking:** The application should be prepared to log or ingest continuous multi-lead data from wireless precordial patches, such as Wearlinq, which is used for capturing transient QTc excursions over 24-48 hours.

---

### **2\. Automated Dosing Mechanisms (Python Backend)**

Manual dosing math during an intense clinical session is a risk. Your Python backend needs to handle the following running calculations:

* **Cumulative Tracking:** The app must automatically calculate the total running dose in milligrams (mg) as subsequent "booster" doses are administered over a 12+ hour period.

* **Weight-Based Ratio:** For every dose, the system must calculate the specific ratio of milligrams of the substance per kilogram of the patient's body weight.

* **Compound Differentiation:** The logic must differentiate between pure Ibogaine HCl and Total Plant Alkaloids (TPA), factoring in that TPA contains approximately an 80% concentration of ibogaine.

---

### **3\. The "Heads-Up" Display (React & Tailwind Frontend)**

The frontend UI needs to replace the practitioner's paper scratchpad with a clean, instantly readable grid.

* **Intra-Session Table UI:** The primary view must be a table with columns for Time, Substance, Dose (mg), Weight (kg), and the running calculation of mg/kg.  
* **Vitals Tracking:** Dedicated input fields or displays for real-time blood pressure, heart rate, and respiratory rate.

---

### **4\. Cardiac Safety Dashboard & Algorithms**

Because ibogaine blocks the hERG potassium channel and slows repolarization, tracking cardiac metrics is the single most important safety feature of this app.

* **QT Interval Column:** A dedicated column to track real-time QT interval data points.  
* **Inter-System Correlation:** A mechanism to run side-by-side correlations of QT readings from two different EKG systems (e.g., comparing the continuous Philips monitor to the intermittent Schiller 12-lead) to account for machine discrepancies.

* **Algorithmic Formula Handling:** The software must recognize that standard ECGs often report QTc using Bazett’s formula ($QTcB \= \\frac{QT}{\\sqrt{RR}}$), while continuous monitors might use Fridericia’s formula ($QTcF \= \\frac{QT}{\\sqrt\[3\]{RR}}$).  
* **Danger Threshold Alerts:** The system should flag when QTc intervals exceed the 500 millisecond (ms) threshold, a marker associated with increased arrhythmic risk.

* **Morphology Flags:** Checkboxes or toggles to quickly log visual ECG changes: sinus bradycardia, flattened T waves, notched T waves, and prolonged Tpeak-Tend intervals.

---

### **5\. Floating AI Clinical Resource**

To prevent context-switching and keep the doctor in the app, the interface requires an integrated search tool.

* **Persistent Interface:** A floating tab or top-bar icon accessible from any page to rapidly query drug interactions.  
* **Pharmacology Focus:** It must reliably pull data on Cytochrome P450 2D6 (CYP2D6) inhibitors—like Fluoxetine or Methadone—which can dangerously elevate plasma levels of psychedelics.

* **Hyperlinking:** The tool should generate direct hyperlinks to Medline databases for deeper literature review.

Would you like me to map out the specific JSON payload structures needed to pass this cardiac and dosing data between your Python backend and the React frontend?

Yes

As a clinical researcher, I want to ensure your development team understands *why* we are structuring the data this way. In a psychedelic clinical setting, especially with ibogaine, data must be structured to immediately surface life-threatening anomalies (like a QTc interval creeping past 500ms) while keeping a precise audit trail of the cumulative pharmacology.

Here are the specific JSON payload structures that will act as the API contract between your Python backend and React frontend.

### **1\. The Dosing Event Payload**

When the practitioner administers a dose, the React frontend will send a simple payload, but the Python backend must return an enriched payload containing the running calculations.

**Frontend to Backend (POST /api/v1/session/{session\_id}/dose)**

JSON

```
{
  "timestamp": "2026-02-25T14:30:00Z",
  "practitioner_id": "DR_J_001",
  "substance_type": "TPA", 
  "administered_dose_mg": 200.0,
  "route": "ORAL"
}
```

**Backend Response to Frontend (Enriched with Calculations)**

Notice how the backend references the patient's baseline weight and applies the 80% concentration rule if the substance is Total Plant Alkaloid (TPA), returning the exact mg/kg ratio.

JSON

```
{
  "event_id": "dose_evt_88392",
  "timestamp": "2026-02-25T14:30:00Z",
  "substance_type": "TPA",
  "administered_dose_mg": 200.0,
  "estimated_active_ibogaine_mg": 160.0, 
  "patient_weight_kg": 75.0,
  "dose_mg_per_kg": 2.13,
  "session_cumulative_mg": 600.0,
  "session_cumulative_mg_per_kg": 8.0,
  "safety_warnings": []
}
```

### **2\. The Cardiac Telemetry & Vitals Payload**

This is the most critical data structure in the application. Whether this data is being ingested directly via an API from the Philips IntelliVue monitor, or manually typed into the iPad by the clinician, the structure must capture the exact cardiac morphology.

**Frontend/Device to Backend (POST /api/v1/session/{session\_id}/vitals)**

JSON

```
{
  "timestamp": "2026-02-25T14:45:00Z",
  "source_device": "PHILIPS_INTELLIVUE",
  "vitals": {
    "heart_rate_bpm": 58,
    "blood_pressure_systolic": 135,
    "blood_pressure_diastolic": 85,
    "respiratory_rate": 14
  },
  "cardiac_metrics": {
    "qt_absolute_ms": 460,
    "rr_interval_ms": 1034,
    "qtc_value_ms": 453,
    "qtc_formula": "FRIDERICIA" 
  },
  "morphology_flags": {
    "sinus_bradycardia": true,
    "t_wave_flattening": false,
    "t_wave_notching": true,
    "t_peak_t_end_prolongation": false
  },
  "neurological_observations": {
    "clonus": false,
    "saccadic_eye_movements": true,
    "diaphoresis": false
  }
}
```

### **3\. The "Heads-Up Display" Session State Payload**

To render the Tailwind UI effectively without constantly recalculating on the client side, your Python backend should provide a comprehensive "Session State" object via a GET request or WebSockets. This feeds the main dashboard.

**Backend to Frontend (GET /api/v1/session/{session\_id}/status)**

JSON

```
{
  "session_id": "sess_99482",
  "patient_id": "pt_3382",
  "status": "ACTIVE",
  "elapsed_time_minutes": 180,
  "current_pharmacology": {
    "total_administered_mg": 600.0,
    "current_cumulative_mg_per_kg": 8.0,
    "time_since_last_dose_minutes": 15
  },
  "cardiac_status": {
    "baseline_qtc_ms": 410,
    "latest_qtc_ms": 453,
    "qtc_delta_from_baseline": 43,
    "is_danger_threshold_exceeded": false,
    "trend": "INCREASING"
  },
  "recent_alerts": [
    {
      "severity": "WARNING",
      "message": "T-wave notching observed.",
      "timestamp": "2026-02-25T14:45:00Z"
    },
    {
      "severity": "INFO",
      "message": "Heart rate has dropped below 60 BPM (Expected Ibogaine Bradycardia).",
      "timestamp": "2026-02-25T14:45:00Z"
    }
  ]
}
```

### **Why this specific structure matters to a developer:**

1. **Separation of absolute and corrected QT (qt\_absolute\_ms vs qtc\_value\_ms)**: Heart rate drops significantly during ibogaine therapy (bradycardia). If we only look at absolute QT, it naturally lengthens as the heart slows. The backend must always know which formula (FRIDERICIA vs BAZETT) is being used to correct for heart rate so we don't trigger false alarms.  
2. **estimated\_active\_ibogaine\_mg**: Because practitioners use different forms of the medicine, treating 100mg of raw root bark the same as 100mg of pure Ibogaine HCl could lead to massive underdosing or overdosing. The API forces the frontend to declare the substance\_type so the backend math is always accurate.

Pass these JSON contracts to your React/Tailwind frontend developer and your Python backend engineer. It will give them exactly what they need to build the state management and database models.

