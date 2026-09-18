# Sri Vidya E.M. High School - Comprehensive Web Platform

Official website and unified digital portal ecosystem for **Sri Vidya E.M. High School**, established in 2017 with the guiding motto:
> *"Vidyathe Vijayam" — Knowledge Brings Victory*

---

## 🏫 About the School
- **Recognition**: Recognized by the Government of Andhra Pradesh
- **Medium**: English Medium
- **Classes Offered**: LKG, UKG, 1 class, 2 class, 3 class, 4th class, 5th class, 6th class, 7th class, 8th class, 9th class, 10th class
- **Leadership**:
  - **Principal**: Smt. Gorle Varalakshmi
  - **Vice Principal**: Sri Navva Anand
- **Contact Helplines**:
  - **Offline Admissions & Campus Walk-ins**: `+91 93985 78584`
  - **School Reception & Appointments**: `8106636230`, `9966422096`
  - **Official Email**: `srividyaschools2017@gmail.com`

---

## 🌟 Key Portals & Architecture

| Portal / Page | Clean Route | Description |
| :--- | :--- | :--- |
| **Public Website** | `/` or `/index.html` | Multilingual website (English, Telugu, Hindi) with live admissions, notices, downloads, curriculum, faculty roster, and gallery |
| **Management Portal** | `/management` | Unified ERP for Principal (Full Access) & Vice Principal (Role-restricted academic & discipline operations) |
| **Teacher Portal** | `/teacher` | Faculty dashboard for Grade 8A (Ms. Anjali) — attendance, marks entry, timetable, homework, and syllabus tracking |
| **Student Portal** | `/student` | Personalized student dashboard for Grade 10-A (Rahul) — timetable, assignments, hall ticket, report cards, and fee status |
| **Parent Portal** | `/parent` | Dedicated parent dashboard with multi-child switcher (Rahul 8A, Sneha 5B, Aditya UKG), live fee payment, attendance alerts, and direct messaging |

---

## 🚀 Running Locally

### Option 1: Python (Built-in Server with Clean Routing)
```bash
python server.py 8080
```
Then visit: [http://localhost:8080/](http://localhost:8080/)

### Option 2: Node.js
```bash
node server.js
```
Then visit: [http://localhost:8080/](http://localhost:8080/)

---

## 📂 Project Structure
```
├── assets/                  # Logos, icons, campus images, lab photos
├── css/                     # Global styles, portal themes, responsive layouts
│   ├── style.css            # Public website stylesheet (light/dark mode, responsive header)
│   └── parent.css           # Dedicated parent portal stylesheet
├── js/                      # Interactive client-side logic
│   ├── app.js               # Public website routing, language translation, modals
│   ├── management.js        # Management portal logic & permission matrix
│   ├── teacher.js           # Teacher portal logic & grade recording
│   ├── student.js           # Student portal academic tracking
│   └── parent.js            # Parent portal multi-child state & fee payment
├── images/                  # Gallery and campus assets
├── management/index.html    # Management clean route handler
├── teacher/index.html       # Teacher clean route handler
├── student/index.html       # Student clean route handler
├── parent/index.html        # Parent clean route handler
├── index.html               # Main public portal
├── management-portal.html   # Principal & Vice Principal ERP
├── teacher-portal.html      # Teacher Portal
├── student-portal.html      # Student Portal
├── parent-portal.html       # Parent Portal
├── server.py                # Threaded HTTP server supporting clean URLs
└── server.js                # Node HTTP server supporting clean URLs
```

---

## 📜 License
Copyright © 2025 Sri Vidya E.M. High School. All Rights Reserved.
