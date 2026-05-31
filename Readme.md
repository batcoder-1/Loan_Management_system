# Loan Management System

A full-stack loan management platform built with React, Node.js, Express, and MongoDB.

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB Atlas account

### Backend Setup
cd backend
npm install
cp .env.example .env
# Add your MONGO_URI and JWT_SECRET in .env
npm run seed
npm run dev

### Frontend Setup
cd frontend
npm install
npm start

## Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@lms.com | admin123 |
| Sales | sales@lms.com | sales123 |
| Sanction | sanction@lms.com | sanction123 |
| Disbursement | disbursement@lms.com | disbursement123 |
| Collection | collection@lms.com | collection123 |
| Borrower | borrower@lms.com | borrower123 |

## Tech Stack
- Frontend: React.js, Axios, React Router
- Backend: Node.js, Express.js
- Database: MongoDB + Mongoose
- Auth: JWT + bcrypt

## Features
- Borrower multi-step loan application
- Business Rule Engine (BRE) validation
- Role-based access control
- Loan lifecycle management
- Payment tracking with auto-close