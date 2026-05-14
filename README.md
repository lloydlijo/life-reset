# Life Reset — 66-Day Habit Tracker

A full-stack habit tracking app for the 66-Day Life Reset program.
Built with Node.js + Express + SQLite (backend) and React (frontend).

---

## Stack

- **Backend**: Node.js, Express, better-sqlite3, JWT auth, bcrypt
- **Frontend**: React, React Router, Axios
- **Database**: SQLite (file-based, no external DB needed)
- **Deploy**: Railway (single service, ~$0–5/month)

---

## Local Development

```bash
# Install all dependencies
npm run install-all

# Start both servers (backend :5000, frontend :3000)
npm run dev
```

---

## Deploy to Railway

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/life-reset.git
git push -u origin main
```

### 2. Deploy on Railway

1. Go to [railway.app](https://railway.app) and sign up/login
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your `life-reset` repo
4. Railway will auto-detect and build

### 3. Set Environment Variables on Railway

In your Railway project → **Variables** tab, add:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `any-long-random-string-here` |
| `DATA_DIR` | `/app/data` |

### 4. Add a Volume (for persistent SQLite data)

1. In Railway project → **Add Service** → **Volume**
2. Mount path: `/app/data`
3. This keeps your database between deploys

### 5. Done!

Railway gives you a public URL automatically. Share it and start Day 1.

---

## Cost Estimate

Railway **Hobby plan** ($5/month flat) covers:
- 8GB RAM, shared CPU
- 100GB outbound bandwidth
- Persistent volumes for SQLite
- Custom domains

For a personal tracker with a few users, you'll likely stay well under $5/month.
The **free tier** (500 hours/month) works too if you only need occasional access.

---

## Features

- ✅ User registration & login (JWT)
- ✅ Daily habit logging (6 habits)
- ✅ 66-day visual grid with completion status
- ✅ Streak tracking and stats
- ✅ Full 9-week workout plan with exercise details
- ✅ Meditation progression guide
- ✅ Cold shower progression
- ✅ Milestone previews
- ✅ Notes per day
- ✅ Mobile-friendly dark UI

---

## Project Structure

```
life-reset/
├── server/
│   ├── index.js          # Express entry point
│   ├── db.js             # SQLite setup
│   ├── middleware/
│   │   └── auth.js       # JWT middleware
│   └── routes/
│       ├── auth.js       # Register / login / me
│       ├── progress.js   # Daily log CRUD
│       └── plan.js       # Plan data (weeks, exercises)
├── client/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js
│       ├── index.js
│       ├── index.css
│       ├── context/
│       │   └── AuthContext.js
│       ├── components/
│       │   ├── Layout.js
│       │   └── HabitCheckbox.js
│       └── pages/
│           ├── AuthPage.js
│           ├── Dashboard.js
│           ├── DayLog.js
│           ├── PlanPage.js
│           └── WeekDetail.js
├── package.json          # Root (server deps + build scripts)
├── railway.toml          # Railway config
├── .env.example
└── .gitignore
```
