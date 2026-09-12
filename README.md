# 🎓 EduBatch - Education Batch Management Platform

A full-stack MVP for coaching institutes to manage batches, students, enrollments, fees, attendance, and notices.

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | admin@edubatch.com | Admin@123 |
| 👨‍🏫 Teacher | teacher@edubatch.com | Teach@123 |
| 🎓 Student | student@edubatch.com | Stud@123 |

## 🛠️ Tech Stack

- **Frontend:** ⚛️ React 18 + Vite + Tailwind CSS
- **Backend:** 🟢 Node.js + Express
- **Database:** 🍃 MongoDB + Mongoose
- **Auth:** 🔑 JWT + bcrypt
- **Payments:** 💳 Razorpay
- **Email:** 📧 Nodemailer

## 📦 Features

- 🔐 JWT Authentication with 3 roles (Admin/Teacher/Student)
- 📚 Batch Management (CRUD)
- 👥 Student Enrollment (capacity validation)
- 💳 Razorpay Payment Integration
- ✅ Attendance Marking (Present/Absent/Late)
- 📢 Batch-wise Notices
- 📊 Role-based Dashboards
- 👤 Profile Management

## 📸 Screenshots

### 👨‍💼 Admin Panel

| 🏠 Dashboard | 📚 Batches |
|-----------|---------|
| ![Dashboard](screenshots/A.Dashboard.png) | ![Batches](screenshots/A.Batches.png) |

| 🏠 Dashboard (Alt) | 📚 Batches (Alt) |
|-----------------|----------------|
| ![Dashboard1](screenshots/A.Dashboard1.png) | ![Batches1](screenshots/A.Batches1.png) |

| ✅ Attendance | ✅ Attendance (Alt) |
|------------|------------------|
| ![Attendance](screenshots/A.Attendance.png) | ![Attendance1](screenshots/A.Attendance1.png) |

| 📢 Notices | 📢 Notices (Alt) |
|---------|---------------|
| ![Notices](screenshots/A.Notices.png) | ![Notices1](screenshots/A.Notices1.png) |

| 👤 Profile | 👑 Admin |
|---------|-------|
| ![Profile](screenshots/A.Profile.png) | ![Admin](screenshots/Admin.png) |

### 👨‍🏫 Teacher Panel

| 🏠 Dashboard | 📚 Batches |
|-----------|---------|
| ![Dashboard](screenshots/T.Dashboard.png) | ![Batches](screenshots/T.batches.png) |

| ✅ Attendance | 📢 Notices |
|-----------|---------|
| ![Attendance](screenshots/T.Attendance.png) | ![Notices](screenshots/T.Notices.png) |

| 👤 Profile | 👨‍🏫 Teacher |
|---------|---------|
| ![Profile](screenshots/T.Profile.png) | ![Teacher](screenshots/Teacher.png) |

### 🎓 Student Panel

| 🏠 Dashboard | 📚 Batches |
|-----------|---------|
| ![Dashboard](screenshots/S.Dashboard.png) | ![Batches](screenshots/S.Batches.png) |

| ✅ My Attendance | 📝 My Enrollments |
|---------------|----------------|
| ![MyAttendance](screenshots/S.MyAttendance.png) | ![MyEnrollments](screenshots/S.MyEnrollments.png) |

| 📢 Notices | 👤 Profile |
|---------|---------|
| ![Notices](screenshots/S.Notices.png) | ![Profile](screenshots/S.Profile.png) |

| 🎓 Student |
|---------|
| ![Student](screenshots/Student.png) |

## 📁 Project Structure

```
edubatch/
├── client/                       # ⚛️ React frontend
├── server/                       # 🟢 Node.js backend
├── docs/                         # 📄 Documentation
├── screenshots/                  # 📸 All screenshots
│   ├── A.Attendance1.png
│   ├── A.Attendance.png
│   ├── A.Batches.png
│   ├── A.Batches1.png
│   ├── A.Dashboard.png
│   ├── A.Dashboard1.png
│   ├── A.Notices.png
│   ├── A.Notices1.png
│   ├── A.Profile.png
│   ├── Admin.png
│   ├── S.Batches.png
│   ├── S.Dashboard.png
│   ├── S.MyAttendance.png
│   ├── S.MyEnrollments.png
│   ├── S.Notices.png
│   ├── S.Profile.png
│   ├── Student.png
│   ├── T.Attendance.png
│   ├── T.batches.png
│   ├── T.Dashboard.png
│   ├── T.Notices.png
│   ├── T.Profile.png
│   └── Teacher.png
├── .gitignore
└── README.md
```

## 🚀 Setup

### Backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env with MongoDB URI, JWT secrets, Razorpay keys
npm run seed
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## 👨‍💻 Author

**Atul Kumar**  
📞 6393631994