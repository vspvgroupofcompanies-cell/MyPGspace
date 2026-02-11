# MyPGspace Git Repository Setup Guide

Welcome to the **MyPGspace** development repository. This guide will help you set up the project locally and follow standard Git workflows.

## 🛠️ Prerequisites
- **Node.js**: v18.x or higher
- **MongoDB**: Local instance or MongoDB Atlas URI
- **Git**: Installed on your local machine

## 🚀 Initial Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/NaguBandaru/Etukas-Platform.git
   cd Etukas-Platform
   ```

2. **Backend Configuration**
   - Navigate to `backend`
   - Create a `.env` file based on the environment requirements:
     ```env
     PORT=5000
     MONGODB_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     ```
   - Install dependencies: `npm install`

3. **Dashboard Configuration**
   - Navigate to `owner-dashboard` (and `tenant-dashboard` once fully setup)
   - Install dependencies: `npm install`

## 💻 Running the Project

### Start Backend
```bash
cd backend
npm run dev
```

### Start Owner Dashboard
```bash
cd owner-dashboard
npm run dev
```

## 🌿 Branching Strategy
- `main`: Production-ready code only.
- `dev`: Development branch where features are integrated.
- `feature/*`: Create new branches for specific features from `dev`.

## 📜 Git Best Practices
- **Commit Messages**: Use descriptive messages (e.g., `feat: add ai chatbot`, `fix: room add modal`).
- **Syncing**: Always `git pull origin dev` before starting new work.
- **Pull Requests**: Raise PRs to merge features into the `dev` branch.

---
*Created by Etukas Tech Pvt Ltd.*
