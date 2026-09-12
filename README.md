# EduBatch - Education Batch Management Platform

A full-stack MVP for coaching institutes to manage batches, students, enrollments, fees, attendance, and notices.

## 🔐 Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@edubatch.com | Admin@123 |
| Teacher | teacher@edubatch.com | Teach@123 |
| Student | student@edubatch.com | Stud@123 |

## 🛠️ Tech Stack
- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt
- **Payments:** Razorpay
- **Email:** Nodemailer

## 📦 Features
- JWT Authentication with 3 roles (Admin/Teacher/Student)
- Batch Management (CRUD)
- Student Enrollment (capacity validation)
- Razorpay Payment Integration
- Attendance Marking (Present/Absent/Late)
- Batch-wise Notices
- Role-based Dashboards
- Profile Management

## 🚀 Setup

### Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env with MongoDB URI, JWT secrets, Razorpay keys
npm run seed
npm run dev