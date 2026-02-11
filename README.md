# 🏥 MyPGspace - Premium PG & Hostel Management Ecosystem

**MyPGspace** is a comprehensive, full-stack digital solution designed to bridge the gap between PG Owners and Tenants. It streamlines operations, automates billing, and enhances communication through a unified, premium interface.

---

## 🌟 Product Vision
Our goal is to eliminate the friction in shared living. From automated rent reminders to anonymous AI-assisted complaint resolution, MyPGspace brings transparency and efficiency to every square foot of your property.

---

## 🛠️ Tech Stack (Developer Perspective)

### Core Architecture
- **Monorepo Structure**: Managed with a shared configuration for backend and frontend.
- **Backend**: Node.js, Express, TypeScript, Mongoose.
- **Frontend**: React 18, Vite, TypeScript, Vanilla CSS (Premium Glassmorphism).
- **Icons**: Lucide React.
- **Security**: JWT-based Role-Based Access Control (RBAC), Bcrypt password hashing.

### Key Modules
- **`backend/`**: RESTful API with structured controllers, models, and middleware.
- **`owner-dashboard/`**: Responsive SPA handling dual roles (Owner & Tenant) via dynamic routing and layout injection.

---

## 🚀 Key Features

### For Owners
- **Visual Room Intelligence**: Floor-wise grouping with real-time Bed status (Vacant/Occupied) icons.
- **Inventory Management**: Add/Update rooms, manage sharing types, and track partially available beds.
- **Tenant Lifecycle**: One-click registration, 1-month notice period lock-in, and automated move-out workflows.
- **Financial Tracking**: Holistic view of payments (Paid, Due Soon, Overdue).
- **Flight Mode**: On-demand toggle for automated notice notifications.

### For Tenants
- **Personal Portal**: View stay details, bed location, and upcoming dues.
- **Complaint System**: Raise issues with category selection, description, and optional **Anonymity**.
- **Real-time Notifications**: Audio cues and polling for complaint status updates.
- **AI Assistant**: 24/7 chatbot to answer queries about rules, payments, and property info.

---

## 🧪 Testing & Quality Assurance (Tester Perspective)

### Critical Regression Paths
1.  **Notice Period Logic**: Verify that vacating dates cannot be set earlier than 30 days from today.
2.  **Role Integrity**: Ensure a user with role `tenant` cannot access `/rooms` or `/tenants` administrative endpoints.
3.  **Complaint Anonymity**: Verify that `tenantName` and `phone` are hidden from the UI when `isAnonymous: true`.
4.  **Real-time Polling**: Confirm the dashboard updates complaint status badges without manual refresh (10s interval).

### Identified Edge Cases
- Handling rooms with non-numeric names (e.g., "Guest-A") in the floor grouping logic.
- Concurrent bed allocation preventing overbooking.

---

## 🎨 Design & UX (UX Perspective)

### Design Philosophy
- **Glassmorphism**: Subtle backgrounds, blur effects, and soft shadows for a modern, airy feel.
- **Mobile-First**: Horizontal scrolling for rooms on small screens to prevent vertical clutter.
- **Micro-interactions**: Hover transforms on room cards, status badges with semantic colors (Red/Green/Yellow).
- **Accessibility**: High-contrast text on interactive elements and descriptive icon titles.

---

## 📋 Project Management (SM & Product Perspective)

### Current Roadmap
- [x] Phase 1: Core RBAC & Room Mapping.
- [x] Phase 2: Complaint Polling & Status Workflows.
- [x] Phase 3: AI Chatbot Integration.
- [x] Phase 4: Notice Period & Flight Mode logic.
- [ ] Phase 5: Multi-property support (Tenant-level selection).
- [ ] Phase 6: Native Mobile App via React Native.

### Workflow
We follow an Agile workflow with a **feature-branching strategy**. Every feature is isolated in a `feature/*` branch and requires verification against the `dev` branch before merging into `main`.

---

## ⚙️ Installation & Setup
Please refer to the detailed [Git Repository Setup Guide](./docs/gitrepo_setup.md) for environment configuration and local execution.

---

## ⚖️ License
All rights reserved by **Etukas Tech Pvt Ltd. 2026**.
Contact support@etukas.com for enterprise licensing.
