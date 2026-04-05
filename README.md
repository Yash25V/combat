# ⚔ CombatPrep — Soldier Readiness & Skill Assessment Tool

A web-based Soldier Readiness & Skill Assessment Tool built as per the SRS document (v1.0).  
Developed by: **Kavya Chaudhary · Lakshay Yadav · Yashvardhan Singh**

---

## 🚀 Live Demo

> Open `index.html` directly in any browser — no server required!

---

## 🔐 Demo Login Credentials

| Role    | Username  | Password     |
|---------|-----------|--------------|
| Admin   | `admin`   | `admin123`   |
| Officer | `officer1`| `officer123` |
| Soldier | `soldier1`| `soldier123` |

Or use the **Quick Access** buttons on the login screen.

---

## ✅ Features Implemented

### Per SRS Requirements:
- **FR-1** User Registration — Admin can add new users
- **FR-2** User Authentication — Login with credentials + role validation
- **FR-3** Role-Based Access Control (RBAC) — Admin / Officer / Soldier views
- **FR-4** Profile Management — Soldier profiles with full history
- **FR-5** Assessment Entry — Officers can record physical + skill scores
- **FR-6** Readiness Score Calculation — Auto-computed (Physical 50% + Skill 50%)
- **FR-7** Report Generation — Readiness reports with trends
- **FR-8** Data Storage — In-memory data store (frontend demo)

### Readiness Level Logic:
| Score | Level |
|-------|-------|
| ≥ 75  | 🟢 Combat Ready |
| 50–74 | 🟡 Partially Ready |
| < 50  | 🔴 Not Ready |

---

## 🗂 Project Structure

```
combatprep/
├── index.html          # Main application (single-page)
├── css/
│   └── style.css       # All styles (military dark theme)
├── js/
│   └── app.js          # All logic (data, auth, CRUD, render)
└── README.md
```

---

## 🛠 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Theme**: Military dark (olive, khaki, rust)
- **Fonts**: Bebas Neue, Rajdhani, Share Tech Mono (Google Fonts)
- **No dependencies**: Runs without any build tool or server

---

## 📌 How to Run

1. Clone this repository
2. Open `index.html` in Chrome / Firefox / Edge
3. Use demo credentials to log in

```bash
git clone https://github.com/YOUR_USERNAME/combatprep.git
cd combatprep
# Open index.html in browser
```

---

## 📋 Deployment on GitHub Pages

1. Push code to GitHub
2. Go to **Settings → Pages**
3. Set source to `main` branch, root folder
4. Your site will be live at `https://YOUR_USERNAME.github.io/combatprep`

---

## 👥 Team

| Name | Roll No. | Contribution |
|------|----------|-------------|
| Kavya Chaudhary | 241030308 | System Design & Documentation |
| Lakshay Yadav | 241030254 | Database Design & Requirement Analysis |
| Yashvardhan Singh | 241030082 | Requirement Analysis & Documentation |

---

*Academic Project — CombatPrep SRS v1.0*
