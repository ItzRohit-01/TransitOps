# TransitOps 🚚

TransitOps is a Smart Transport Operations Platform built to digitize and streamline fleet management, driver operations, dispatching, maintenance tracking, financial monitoring, and operational analytics.

The platform provides a centralized system for managing the complete lifecycle of transport operations while enforcing business rules, improving visibility, and enabling data-driven decision-making.

---

## Features

### Authentication & RBAC
- Secure Firebase Authentication
- Role-Based Access Control (RBAC)
- Fleet Manager
- Dispatcher
- Safety Officer
- Financial Analyst

### Fleet Management
- Vehicle Registry
- Vehicle Status Tracking
- Fleet Utilization Monitoring
- Vehicle Lifecycle Management

### Driver Management
- Driver Profiles
- License Tracking
- Safety Scores
- Driver Availability Management

### Trip Operations
- Trip Creation
- Vehicle Assignment
- Driver Assignment
- Dispatch Workflow
- Trip Lifecycle Tracking
- Cargo Validation

### Maintenance Management
- Maintenance Logs
- Service Tracking
- Vehicle Shop Status Management
- Maintenance History

### Fuel & Expense Management
- Fuel Logs
- Expense Tracking
- Operational Cost Monitoring
- Cost Analysis

### Safety & Compliance
- Incident Management
- Complaint Tracking
- Compliance Monitoring
- License Expiry Tracking
- Driver Risk Analysis

### Financial Intelligence
- Revenue Analytics
- Expense Analytics
- Vehicle ROI
- Route Profitability
- Financial Forecasting

### AI Intelligence Center
- Predictive Maintenance Insights
- Driver Risk Detection
- License Expiry Alerts
- Cost Optimization Recommendations
- Fleet Efficiency Analysis

### Reporting
- CSV Export
- KPI Dashboards
- Operational Analytics
- Financial Reports

---

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS

### Backend
- Firebase

### Firebase Services
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Security Rules

### UI / Design
- Stitch
- Figma

---

## Project Structure

```bash
src/
├── components/
├── pages/
├── routes/
├── services/
├── hooks/
├── context/
├── utils/
├── firebase/
└── assets/
```

---

## Installation

Clone the repository:

```bash
git clone <https://github.com/ItzRohit-01/TransitOps.git>
```

Navigate to the project:

```bash
cd transitops
```

Install dependencies:

```bash
npm install
```

Create environment file:

```bash
.env
```

Add Firebase configuration:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Run locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Roles

### Fleet Manager
- Full platform access
- Fleet oversight
- Analytics
- Administration
- AI Intelligence

### Dispatcher
- Trip Planning
- Vehicle Assignment
- Driver Assignment
- Dispatch Operations

### Safety Officer
- Incident Tracking
- Complaint Management
- Compliance Monitoring
- Risk Analysis

### Financial Analyst
- Revenue Tracking
- Cost Analysis
- ROI Monitoring
- Financial Reporting

---

## Business Rules Implemented

- Unique Vehicle Registration Numbers
- Vehicle Capacity Validation
- Driver License Validation
- Driver Availability Validation
- Vehicle Availability Validation
- Automatic Status Transitions
- Maintenance Restrictions
- Operational Cost Calculations
- ROI Calculations

---

## Future Enhancements

- Real-time GPS Integration
- Email Notifications
- Predictive ML Models
- PDF Reports
- Mobile Driver Application
- Advanced Route Optimization

---

## Team
Rohit Prasad

Mohammed Jazim

Shameer

Irshad Ahamed

Built as part of the Odoo Hackathon.

TransitOps - Smart Transport Operations Platform.
