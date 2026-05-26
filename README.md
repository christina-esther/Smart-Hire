<div align="center">

<img src="https://img.shields.io/badge/SmartHire-AI%20Job%20Portal-6366f1?style=for-the-badge&logo=briefcase&logoColor=white" alt="SmartHire" />

# SmartHire – AI Powered Job Portal

### Connect talent with opportunity using the power of AI

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens)](https://jwt.io/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📸 Screenshots

> Landing Page · Candidate Dashboard · Recruiter Panel · Admin Analytics

| Landing | Jobs | Dashboard |
|--------|------|-----------|
| ![Landing](https://placehold.co/380x220/6366f1/ffffff?text=Landing+Page) | ![Jobs](https://placehold.co/380x220/6366f1/ffffff?text=Job+Listings) | ![Dashboard](https://placehold.co/380x220/6366f1/ffffff?text=Dashboard) |

---

## ✨ Features

### 🎯 For Candidates
- 🔐 Secure JWT Authentication
- 📄 Resume Upload (PDF/DOC)
- 🔍 Browse & Filter Jobs (type, category, location, experience)
- 📨 Apply with Cover Letter
- 🔖 Save Favourite Jobs
- 🤖 **AI-Powered Job Recommendations** (Google Gemini)
- 📊 Personal Dashboard — track applications & status

### 🏢 For Recruiters
- 📝 Post, Edit & Delete Job Listings
- 👥 View All Applicants Per Job
- ✅ Shortlist, Hire or Reject Candidates
- 📈 Recruiter Dashboard with Stats

### 🛡️ For Admins
- 📊 Platform-Wide Analytics
- 👤 User Management (activate/deactivate)
- 📋 Monitor All Jobs & Applications

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router DOM |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT, bcrypt |
| **AI** | Google Gemini API |
| **File Upload** | Multer |
| **HTTP Client** | Axios |
| **Notifications** | React Hot Toast |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://mongodb.com/atlas) — free)
- Git

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/smarthire.git
cd smarthire
```

**2. Setup Backend**
```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` with your values:
```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/smarthire
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
GEMINI_API_KEY=your_gemini_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**3. Seed the Database**
```bash
npm run seed
node fix.js
```

**4. Start the Backend**
```bash
npm run dev
```

**5. Setup Frontend** *(new terminal)*
```bash
cd ../client
npm install
npm run dev
```

**6. Open the app**

Visit `http://localhost:5173` 🎉

---

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| 🧑‍💼 Candidate | alex@example.com | password123 |
| 🏢 Recruiter | recruiter@techcorp.io | password123 |
| 🛡️ Admin | admin@smarthire.io | password123 |

---

## 📁 Project Structure

```
smarthire/
├── client/                  # React Frontend
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── context/         # Auth context (JWT state)
│       ├── hooks/           # Custom React hooks
│       ├── layouts/         # Dashboard layout
│       ├── pages/           # All page components
│       │   ├── candidate/   # Candidate dashboard
│       │   ├── recruiter/   # Recruiter dashboard
│       │   └── admin/       # Admin dashboard
│       └── services/        # Axios API client
│
└── server/                  # Node.js Backend
    ├── config/              # Database connection
    ├── controllers/         # Business logic
    ├── middleware/          # Auth, error, upload
    ├── models/              # MongoDB schemas
    ├── routes/              # API routes
    └── utils/               # Seed script
```

---

## 🔌 API Endpoints

```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login
GET    /api/auth/me                Get current user

GET    /api/jobs                   Get all jobs (with filters)
POST   /api/jobs                   Create job (recruiter)
PUT    /api/jobs/:id               Update job (recruiter)
DELETE /api/jobs/:id               Delete job (recruiter)

POST   /api/applications/apply/:id Apply for job (candidate)
GET    /api/applications/my        My applications (candidate)
PATCH  /api/applications/:id/status Update status (recruiter)

GET    /api/ai/recommendations     AI job recommendations
GET    /api/admin/stats            Platform statistics (admin)
```

---

## 🤖 AI Recommendations

SmartHire uses **Google Gemini** to analyze your skills and match you with the most relevant jobs. If no API key is provided, it falls back to a smart skill-matching algorithm — so it always works!

Get your free Gemini API key at [aistudio.google.com](https://aistudio.google.com)

---

## 🌐 Deployment

### Frontend → Netlify
1. Push code to GitHub
2. Connect repo on [netlify.com](https://netlify.com)
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variable: `VITE_API_URL=your_backend_url`

### Backend → Render / Railway
1. Connect your GitHub repo
2. Set root directory to `server`
3. Add all `.env` variables
4. Deploy!

---

## 📄 License

MIT License — feel free to use this project for learning or portfolio purposes.

---

<div align="center">

Made with ❤️ using the MERN Stack + AI

⭐ **Star this repo if you found it helpful!** ⭐

</div>
