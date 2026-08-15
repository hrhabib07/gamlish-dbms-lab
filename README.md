# Gamlish DBMS Lab

**Gamlish: A Game-Based English Learning Platform**  
CSE 224 · Database Management System Lab  
Department of Computer Science and Engineering · Metropolitan University · Section CSE 61A

A deployed MySQL prototype of [Gamlish](https://gamlish.com). Students register, play **Mission 01 · Word Order**, complete a 10-question quiz one item at a time, and save scores. Admins manage users, lessons, questions, progress, and results.

This repository is the **course project only**. The commercial product on gamlish.com is a separate system (MongoDB). Do not mix the two.

---

## Live links

| Item | URL |
|---|---|
| Lab website (Vercel) | [https://gamlish-dbms-lab.vercel.app](https://gamlish-dbms-lab.vercel.app) |
| Lab API (Render) | [https://gamlish-dbms-lab.onrender.com/api/health](https://gamlish-dbms-lab.onrender.com/api/health) |
| ER diagram | [https://dbdiagram.io/d/gamlish_dbms_lab-6a803de8e093539a9ebf8e38](https://dbdiagram.io/d/gamlish_dbms_lab-6a803de8e093539a9ebf8e38) |
| Real Gamlish | [https://gamlish.com](https://gamlish.com) |
| Source code | [https://github.com/hrhabib07/gamlish-dbms-lab](https://github.com/hrhabib07/gamlish-dbms-lab) |

A gold bar on every lab page opens **https://gamlish.com**.

The first API request after idle time can take 30-60 seconds. Render’s free plan sleeps the backend.

---

## Team

| Name | Student ID | Section |
|---|---|---|
| MD HABIBUR RAHMAN | 242-115-019 | CSE 61A |
| MD YOUSUF ALI | 242-115-007 | CSE 61A |
| SRIJON DEY | 242-115-049 | CSE 61A |

Submitted to: **Samia Rahman Rima**, Lecturer, Department of CSE

---

## Where the data is stored

**The live lab does not store data in this folder, and it does not use MongoDB.**

| Environment | Database | Where the rows live | How to open them |
|---|---|---|---|
| **Deployed lab** (teacher / public) | **MySQL 8** on **Aiven** | Cloud service `mysql-ac05563`, database `defaultdb`, Bangalore | [Aiven Console](https://console.aiven.io) · project **gamlish** · service **mysql-ac05563** · **Databases** / Query editor, or DBeaver using the Aiven URI |
| **This PC only** (optional) | MySQL on **XAMPP** | Your machine, database `gamlish_dbms` | XAMPP + DBeaver / phpMyAdmin |
| **Real Gamlish** (not this course) | **MongoDB** | Atlas / production cluster of gamlish.com | MongoDB Atlas. Not used by this lab |

Think of it this way:

- **gamlish.com** → MongoDB (the real product)
- **This CSE 224 lab** → MySQL on Aiven (the course database)
- **`d:\ielts_habib\...`** → source code only. Users, scores, and quiz answers are **not** saved as files in the project folder

When a student registers on [https://gamlish-dbms-lab.vercel.app](https://gamlish-dbms-lab.vercel.app):

1. The Vercel site calls the Render API.
2. The API writes a row into Aiven MySQL table `Users`.
3. Quiz answers go to `QuizAttempts`. Progress goes to `UserProgress`.

To show the teacher the live data: log in to Aiven → **gamlish** → **mysql-ac05563** → browse `Users`, `QuizAttempts`, and the other tables. That is the MySQL equivalent of opening a collection in MongoDB Atlas.

Host (no password in this file):

```text
mysql-ac05563-gamlish.c.aivencloud.com:11383
database: defaultdb
```

---

## How the live system is hosted

```text
Browser
   │
   ▼
Vercel          Next.js frontend
gamlish-dbms-lab.vercel.app
   │  HTTPS  /api/...
   ▼
Render          Express + Prisma API
gamlish-dbms-lab.onrender.com
   │  MySQL + TLS
   ▼
Aiven           MySQL 8 · defaultdb
mysql-ac05563   Bangalore
```

| Layer | Service | Role |
|---|---|---|
| Frontend | Vercel | Pages, login, quiz UI |
| Backend | Render | Auth, CRUD, scoring |
| Database | Aiven MySQL | Persistent rows (users, lessons, attempts) |
| ORM | Prisma | Maps TypeScript to the 7 MySQL tables |

---

## Features

**Student**
- Register (insert into `Users`)
- Log in with JWT
- Mission 01: video, notes, 10-question quiz (one question at a time)
- Score saved in `QuizAttempts` (`Score` is 0 or 1 per question)

**Admin**
- Create users
- View progress and scores (`SUM(Score)`)
- Add / edit / delete lessons and quiz questions

---

## Database design

**Live ER diagram:** [dbdiagram.io/d/gamlish_dbms_lab-6a803de8e093539a9ebf8e38](https://dbdiagram.io/d/gamlish_dbms_lab-6a803de8e093539a9ebf8e38)

| Table | Purpose |
|---|---|
| `Users` | Name, unique email, bcrypt password, role (`student` / `admin`) |
| `Levels` | Level 1 · Word Order |
| `Lessons` | Title, YouTube URL, notes. `Level_ID` FK |
| `QuizQuestions` | Question text. `Lesson_ID` FK |
| `QuizOptions` | Four options. `Is_Correct`. `Question_ID` FK |
| `UserProgress` | One row per user + lesson. `Completed` |
| `QuizAttempts` | One row per user + question. `Selected_Option` FK. `Score` 0 or 1 |

Lesson total is not copied onto `Users`. It is computed:

```sql
SELECT u.Name, l.Title, SUM(a.Score) AS Total_Score
FROM QuizAttempts a
JOIN Users u ON u.User_ID = a.User_ID
JOIN QuizQuestions q ON q.Question_ID = a.Question_ID
JOIN Lessons l ON l.Lesson_ID = q.Lesson_ID
GROUP BY u.User_ID, u.Name, l.Lesson_ID, l.Title;
```

Report files: `docs/schema.sql`, `docs/normalization.md`, `docs/sample-queries.sql`, `docs/er-diagram.dbml`.

---

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | MySQL 8, Prisma ORM |
| Auth | JWT, bcrypt, Zod |
| Hosting | Vercel, Render, Aiven |
| Local tools | XAMPP, DBeaver |

---

## Demo accounts

Use these on the **live lab** or on localhost after seed.

| Role | Email | Password |
|---|---|---|
| Admin | admin@gamlish.test | Admin@123 |
| Student | student@gamlish.test | Student@123 |

Anyone can also register at `/register`. Admin can create users at **Admin → Users**.

---

## Run on this PC (optional)

Local run uses **XAMPP MySQL**, a second copy of the data. It is not the Aiven database the teacher sees.

1. Start **MySQL** in XAMPP Control Panel.
2. Then:

```bash
cd d:\ielts_habib\2026\web_project\gamlish-dbms-lab
npm install
npm run install:all
npm run db:setup
npm run dev
```

| App | Local URL |
|---|---|
| Website | http://localhost:3001 |
| API | http://localhost:4000/api/health |

Default local URL: `mysql://root:@localhost:3306/gamlish_dbms`

---

## Project layout

```text
gamlish-dbms-lab/
  frontend/          Next.js (Vercel)
  backend/           Express + Prisma (Render)
  backend/prisma/    schema.prisma + seed.ts
  docs/              ER, SQL, normalization, deploy notes
  README.md          this file
```

---

## Viva and report

1. Cover page from the proposal
2. ER: [dbdiagram.io/d/gamlish_dbms_lab-6a803de8e093539a9ebf8e38](https://dbdiagram.io/d/gamlish_dbms_lab-6a803de8e093539a9ebf8e38)
3. Show live data in **Aiven** (not MongoDB)
4. Screenshots: register, login, video, one-question quiz, score, admin CRUD
5. SQL from `docs/sample-queries.sql`

```sql
SHOW TABLES;
DESCRIBE Users;
SHOW CREATE TABLE QuizAttempts;
SELECT * FROM Users;
```

Redeploy notes: `docs/DEPLOY-FREE.md`.

---

## What this project is not

- Not the live Gamlish SaaS
- Not MongoDB
- Not 21 missions, payments, or leaderboards

Those belong to [gamlish.com](https://gamlish.com). This lab demonstrates relational design, foreign keys, CRUD, authentication, and progress tracking for CSE 224.
