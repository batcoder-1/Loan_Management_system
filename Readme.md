# 🏦 LoanFlow - Loan Management System

> A comprehensive, full-stack loan management platform with role-based access control, multi-step loan applications, and automated payment tracking.

![React](https://img.shields.io/badge/React-18.0-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18.0-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0-green?logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Login Credentials](#login-credentials)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [User Roles & Workflows](#user-roles--workflows)
- [Database Schema](#database-schema)
- [Design System](#design-system)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🎯 Overview

**LoanFlow** is an enterprise-grade loan management platform that streamlines the entire loan lifecycle from application to repayment. It features a sophisticated role-based access system that enables different teams (Sales, Sanction, Disbursement, Collection) to manage loans at different stages of the process.

The platform includes:
- Real-time loan status tracking
- Automated payment processing with UTR validation
- Business Rule Engine (BRE) for loan validation
- Multi-step borrower application process
- Comprehensive reporting and payment history

---

## ✨ Features

### For Borrowers
- 📝 **4-Step Loan Application** - Personal details, salary slip upload, loan configuration, review
- 📊 **Live Interest Calculation** - Real-time Simple Interest calculation at 12% per annum
- 🔍 **Loan Tracking** - View status, payment history, and rejection reasons
- 💳 **Payment History** - Track all payments with UTR numbers and dates
- 🚀 **Instant Application** - Quick and easy multi-step process

### For Admin & Staff
- 👥 **Lead Management** (Sales) - View borrowers without active loans
- ✅ **Loan Approval** (Sanction) - Approve/reject applications with reasons
- 💰 **Disbursement** (Disbursement) - Mark loans as disbursed
- 📦 **Payment Recording** (Collection) - Record payments and track outstanding amounts
- 🔐 **Role-Based Access** - Secured endpoints with role authorization

### Technical Features
- 🔐 **JWT Authentication** - Secure token-based authentication
- 🔒 **Password Hashing** - bcrypt for secure password storage
- 📤 **File Upload** - Multer-based salary slip upload with validation
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Glassmorphism design with gradient backgrounds
- ⚡ **Real-time Updates** - Refresh functionality for instant data sync

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│         Frontend (React 18)                     │
│  ┌──────────────────────────────────────────┐  │
│  │  Auth Pages (Login/Signup)               │  │
│  │  Borrower Pages (Apply/MyLoans)          │  │
│  │  Admin Dashboard (Role-based modules)    │  │
│  └──────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────┘
                  │ REST API (Axios)
                  ▼
┌─────────────────────────────────────────────────┐
│       Backend (Express.js on Node)              │
│  ┌──────────────────────────────────────────┐  │
│  │  Auth Controller (Login/Signup)          │  │
│  │  Loan Controller (Application flow)      │  │
│  │  Admin Controller (Loan management)      │  │
│  │  Auth Middleware (JWT verification)      │  │
│  │  BRE Middleware (Business rules)         │  │
│  └──────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────┘
                  │ Mongoose ODM
                  ▼
┌─────────────────────────────────────────────────┐
│         MongoDB Database                        │
│  ┌──────────────────────────────────────────┐  │
│  │  Users collection                        │  │
│  │  Loans collection (with payments array)  │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling (Glassmorphism design)

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication token
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

### Tools & Services
- **MongoDB Atlas** - Cloud database
- **Git** - Version control
- **npm/yarn** - Package management

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0 or higher)
- **npm** (v9.0 or higher) or **yarn** (v3.0 or higher)
- **MongoDB Atlas** account (free tier available)
- **Git** (for cloning the repository)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/loan-management-system.git
cd loan_management_system
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
EOF

# Seed the database with test data
npm run seed

# Start the backend server
npm run dev
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The application will open at `http://localhost:3000`

---

## ⚙️ Configuration

### MongoDB Connection
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with read/write permissions
4. Whitelist your IP address
5. Copy the connection string and add to `.env`:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/loanflow?retryWrites=true&w=majority
```

### JWT Secret
Generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to `.env`:
```
JWT_SECRET=your_generated_secret_here
```

### File Upload (Multer)
- **Upload directory**: `backend/uploads/`
- **Max file size**: 5MB
- **Allowed types**: PDF, JPG, PNG

---

## ▶️ Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Frontend runs on http://localhost:3000
```

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

---

## 🔑 Login Credentials

Test the application using these demo accounts:

| Role | Email | Password | Module |
|------|-------|----------|--------|
| **Admin** | admin@lms.com | admin123 | All modules |
| **Sales** | sales@lms.com | sales123 | View leads |
| **Sanction** | sanction@lms.com | sanction123 | Approve/Reject loans |
| **Disbursement** | disbursement@lms.com | disbursement123 | Disburse loans |
| **Collection** | collection@lms.com | collection123 | Record payments |
| **Borrower** | borrower@lms.com | borrower123 | Apply for loans |

**Note:** You can also create new borrower accounts via the Signup page.

---

## 📁 Project Structure

```
loan_management_system/
├── backend/
│   ├── config/           # Configuration files
│   ├── controllers/       # Business logic
│   │   ├── authController.js
│   │   ├── loanController.js
│   │   └── adminController.js
│   ├── middleware/        # Auth, BRE, Upload
│   │   ├── authMiddleware.js
│   │   ├── bre.js
│   │   └── upload.js
│   ├── models/            # Database schemas
│   │   ├── users.js
│   │   └── loan.js
│   ├── routes/            # API endpoints
│   │   ├── authroutes.js
│   │   ├── loanRoutes.js
│   │   └── adminRoutes.js
│   ├── uploads/           # Uploaded salary slips
│   ├── server.js          # Express app setup
│   ├── seed.js            # Database seeding
│   └── package.json
│
└── frontend/
    ├── public/            # Static files
    ├── src/
    │   ├── pages/         # React components
    │   │   ├── Login.js
    │   │   ├── Signup.js
    │   │   ├── Apply.js
    │   │   ├── Dashboard.js
    │   │   ├── MyLoans.js
    │   │   └── *.css
    │   ├── App.js         # Main app component
    │   └── index.js       # Entry point
    └── package.json
```

---

## 📡 API Documentation

### Authentication Endpoints

#### Register (Signup)
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "borrower"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "userId": "507f1f77bcf86cd799439011"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "role": "borrower"
}
```

### Loan Application Endpoints

#### Submit Personal Details
```http
POST /loan/personal-details
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "John Doe",
  "pan": "ABCDE1234F",
  "dob": "1990-01-01",
  "monthlySalary": 50000,
  "employmentMode": "salaried"
}
```

#### Upload Salary Slip
```http
POST /loan/upload-salary-slip
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData {
  "loanId": "507f1f77bcf86cd799439011",
  "salarySlip": <file>
}
```

#### Configure Loan
```http
POST /loan/configure
Authorization: Bearer {token}
Content-Type: application/json

{
  "loanId": "507f1f77bcf86cd799439011",
  "loanAmount": 100000,
  "tenure": 60
}
```

#### Get My Loans
```http
GET /loan/my-loans
Authorization: Bearer {token}
```

### Admin Endpoints

#### Get Leads (Sales)
```http
GET /admin/leads
Authorization: Bearer {token}
```

#### Get Applied Loans (Sanction)
```http
GET /admin/applied-loans
Authorization: Bearer {token}
```

#### Sanction Loan
```http
POST /admin/sanction
Authorization: Bearer {token}
Content-Type: application/json

{
  "loanId": "507f1f77bcf86cd799439011",
  "action": "approve"  // or "reject"
  "rejectionReason": "Insufficient income" // optional
}
```

#### Disburse Loan
```http
POST /admin/disburse
Authorization: Bearer {token}
Content-Type: application/json

{
  "loanId": "507f1f77bcf86cd799439011"
}
```

#### Record Payment
```http
POST /admin/payment
Authorization: Bearer {token}
Content-Type: application/json

{
  "loanId": "507f1f77bcf86cd799439011",
  "utrNumber": "UTR123456789",
  "amount": 5000,
  "date": "2024-05-31"
}
```

---

## 👥 User Roles & Workflows

### 1. Borrower Workflow
```
Signup → Login → Apply for Loan → Multi-step application → View Status
                                  ↓
                        Track in "My Loans"
                        • View status updates
                        • Download approval letter
                        • Track payment history
```

### 2. Sales Role
```
View Leads → Identify potential borrowers → Follow up → Document interactions
```

### 3. Sanction Role (Approval)
```
View Applied Loans → Analyze details → Approve/Reject → Notify borrower
                                    ↓
                            Update status
```

### 4. Disbursement Role
```
View Sanctioned → Verify documents → Disburse amount → Record transaction
```

### 5. Collection Role
```
View Disbursed Loans → Track payments → Record UTR → Auto-close when paid
```

---

## 📊 Database Schema

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['admin', 'sales', 'sanction', 'disbursement', 'collection', 'borrower'],
  createdAt: Date
}
```

### Loan Schema
```javascript
{
  borrower: ObjectId (User reference),
  fullname: String,
  pan: String,
  dob: Date,
  monthlySalary: Number,
  employmentMode: Enum ['salaried', 'self-employed', 'unemployed'],
  salarySlipPath: String (file path),
  loanAmount: Number,
  tenure: Number (days),
  status: Enum ['applied', 'sanctioned', 'disbursed', 'closed', 'rejected'],
  totalRepayment: Number (calculated as principal + SI),
  amountPaid: Number,
  rejectionReason: String,
  payments: [{
    utrNumber: String (unique, sparse),
    amount: Number,
    date: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Indigo (#6366f1) / Purple (#8b5cf6)
- **Success**: Green (#34d399 / #10b981)
- **Warning**: Amber (#fbbf24 / #f59e0b)
- **Error**: Red (#fecaca / #ef4444)
- **Background**: Dark (#0f172a) with gradient overlay

### Design Approach
- **Glassmorphism**: Frosted glass effect with backdrop blur
- **Responsive**: Mobile-first design
- **Accessible**: WCAG 2.1 AA compliant
- **Modern**: Smooth transitions and hover effects

---

## 🐛 Troubleshooting

### Backend Issues

**Port 5000 already in use:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

**MongoDB Connection Error:**
- Verify MongoDB Atlas cluster is running
- Check connection string format
- Ensure IP is whitelisted in MongoDB Atlas
- Verify username/password credentials

**JWT Token Errors:**
- Ensure JWT_SECRET is set in .env
- Check token expiration settings
- Clear browser localStorage and login again

### Frontend Issues

**CORS Errors:**
- Ensure backend is running on port 5000
- Check CORS configuration in Express
- Clear browser cache and refresh

**File Upload Failing:**
- Check file size (max 5MB)
- Verify file type (PDF, JPG, PNG only)
- Ensure `uploads/` directory exists

**Pages Not Loading:**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules/` and reinstall
- Check browser console for errors

---

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Guidelines
- Follow existing code style
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For issues, questions, or feedback:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the troubleshooting section

---

## 🙏 Acknowledgments

- React documentation and community
- Express.js best practices
- MongoDB tutorial and guides
- Modern design inspiration

---

**Built with ❤️ using React, Node.js, and MongoDB**

Last Updated: May 31, 2026