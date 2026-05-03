# MERN Expense Tracker

A minimal full-stack expense tracker built with **MongoDB, Express, React, Node.js**.

## Features
- 🔐 JWT authentication (Signup / Login)
- ➕ Add transactions (Income / Expense)
- 📋 List & delete transactions (latest first)
- 📊 Dashboard summary: Total Income, Total Expense, Balance
- 🥧 Pie chart visualization (Income vs Expense)
- 🎨 4 themes: Light, Dark, Pink, Light Blue

## Project Structure
```
MERN EXPENSE TRACKER/
├── backend/      # Express + MongoDB API
└── frontend/     # React + Vite app
```

## Setup

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env       # then edit MONGO_URI / JWT_SECRET
npm run dev                # http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env       # VITE_API_URL=http://localhost:5000/api
npm run dev                # http://localhost:5173
```

## API
| Method | Endpoint                       | Auth | Description     |
|--------|--------------------------------|------|-----------------|
| POST   | /api/auth/signup               | No   | Create account  |
| POST   | /api/auth/login                | No   | Login           |
| GET    | /api/transactions/all          | Yes  | List user txns  |
| POST   | /api/transactions/add          | Yes  | Add transaction |
| DELETE | /api/transactions/delete/:id   | Yes  | Delete txn      |

## Transaction Model
```js
{ userId, title, amount, type: "income" | "expense", createdAt }
```
