# MEGAMIND PLUS IELTS MOCK TEST PLATFORM

> **Realistic IELTS Computer-Based Test Experience**  
> *“Practice Like the Real Test. Perform With Confidence.”*

---

## 📌 Overview
**MEGAMIND PLUS IELTS MOCK TEST** is a full-featured, responsive, production-ready computer-based IELTS practice platform. It replicates authentic IELTS/CBT examination environments across all four skills: **Listening, Reading, Writing, and Speaking**, with timed sections, dual-layer auto-saving, instant IELTS band score conversions, deep diagnostic analysis, and an administrative control center.

*Disclaimer: This is an independent practice platform by Megamind Plus and is not affiliated with or endorsed by the British Council, IDP, or Cambridge Assessment English.*

---

## 🚀 Key Features

### 🎧 Listening CBT Module
- 4 parts, 40 questions with simulated audio playback.
- Multiple choice, form filling, note completion, table completion, matching, and map labelling.
- Audio volume controls, seek constraints, and time tracking.

### 📖 Reading CBT Module
- Authentic 2-column split screen (Passage on the left, Questions on the right).
- Interactive **Text Highlighters** (Yellow, Green, Pink, and Clear).
- Paragraph indicators (A–D), True/False/Not Given, Yes/No/Not Given, Matching Headings, and Summary completion.

### ✍️ Writing CBT Module
- Academic Task 1 (150 words) and Task 2 (250 words) tab switcher.
- Live word and character counting with auto-save heartbeat every 3 seconds.
- Integrated comparative SVG chart illustrations.

### 🎙️ Speaking CBT Module
- 3-part interactive Speaking simulator.
- Part 2 Cue Card with **1-minute preparation countdown timer** and **2-minute speaking timer**.
- Live Web Audio volume visualizer canvas, replay review, and cloud audio submission.

### 📊 Scoring & Analytics Engine
- Standard official IELTS 9.0 band conversion rules for Academic & General Training streams.
- Configurable rounding algorithm (e.g. 6.25 -> 6.5, 6.75 -> 7.0, 6.125 -> 6.0).
- Detailed question-by-question breakdown with answer variations and diagnostic explanations.
- Strengths, areas to improve, and recommended practice drills.

### 🛠️ Comprehensive Admin Control Center
- Real-time dashboard KPI metrics and band distribution charts.
- Test management (Create, Edit, Publish/Draft, Delete).
- Question & Passage Builder supporting all 14 IELTS question types.
- Examiner Evaluation Queue for scoring Writing and Speaking submissions with official 4-criteria rubrics.
- Student account management (search, view attempts, suspend/activate, password reset).
- System settings configuration (Brand, logos, colors, scoring rules).

---

## 🔑 Demo Access Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@megamindplus.com` | `admin123` | Full Admin Control Center |
| **Teacher / Evaluator** | `evaluator@megamindplus.com` | `teacher123` | Writing & Speaking Evaluation Queue |
| **Student** | `student@megamindplus.com` | `student123` | Student Dashboard & Test Library |

---

## 🛠️ Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Backend:** Node.js, Express.js, SQLite (`better-sqlite3`), JWT Authentication, Bcrypt password hashing.
- **Database:** Normalized relational SQLite schema with foreign keys, WAL mode, and indexes.

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/nahidmegamindplus-byte/mmp-mock-.git
cd mmp-mock-

# Install dependencies
npm install

# Seed the database with demo tests & accounts
npm run seed

# Build the frontend
npm run build

# Start the full-stack server
npm start
```

Open `http://localhost:5000` in your browser.

---

## 📜 License
© MEGAMIND PLUS. All rights reserved.
