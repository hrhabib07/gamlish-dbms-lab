# Gamlish DBMS Lab

**Gamlish: A Game-Based English Learning Platform**  
CSE 224 · Database Management System Lab · Metropolitan University · CSE 61A

A MySQL prototype of [Gamlish](https://gamlish.com). Students register, play **Mission 01 · Word Order**, submit a 10-question quiz, and save scores. Admins manage users, lessons, and questions.

This folder is the **course project only**. The live product is a separate system.

| | Link |
|---|---|
| Real Gamlish | [https://gamlish.com](https://gamlish.com) |
| Live ER diagram | [https://dbdiagram.io/d/gamlish_dbms_lab-6a803de8e093539a9ebf8e38](https://dbdiagram.io/d/gamlish_dbms_lab-6a803de8e093539a9ebf8e38) |
| Local website | http://localhost:3001 |
| Local API | http://localhost:4000/api/health |

A gold bar on every lab page opens **gamlish.com**.

---

## Team

| Name | Student ID | Section |
|---|---|---|
| MD HABIBUR RAHMAN | 242-115-019 | CSE 61A |
| MD YOUSUF ALI | 242-115-007 | CSE 61A |
| SRIJON DEY | 242-115-049 | CSE 61A |

Submitted to: **Samia Rahman Rima**, Lecturer, Department of CSE

---

## What you can do

**Student**
- Register a new account (writes to `Users`)
- Log in with JWT
- Open Level 1 · watch the lesson video · read notes
- Play 10 quiz questions, **one at a time**
- See the score. Each answer is stored in `QuizAttempts`

**Admin**
- Log in and open the dashboard
- Create users
- View progress and quiz scores (`SUM(Score)`)
- Add / edit / delete lessons
- Add / edit / delete quiz questions and options

---

## Database

### Live ER diagram

Open and export from here:

**[gamlish_dbms_lab on dbdiagram.io](https://dbdiagram.io/d/gamlish_dbms_lab-6a803de8e093539a9ebf8e38)**

Local copies for the PDF:

- `docs/er-diagram.dbml` · same model as the live link
- `docs/er-diagram.md` · Mermaid version
- `docs/er-diagram.png` · image
- `docs/schema.sql` · `CREATE TABLE` script
- `docs/normalization.md` · 1NF, 2NF, 3NF
- `docs/sample-queries.sql` · joins for viva

### Tables

| Table | Purpose |
|---|---|
| `Users` | Name, unique email, bcrypt password, role (`student` / `admin`) |
| `Levels` | Level 1 · Word Order |
| `Lessons` | Title, YouTube URL, notes. `Level_ID` FK |
| `QuizQuestions` | Question text. `Lesson_ID` FK |
| `QuizOptions` | Four options. `Is_Correct`. `Question_ID` FK |
| `UserProgress` | One row per user + lesson. `Completed` |
| `QuizAttempts` | One row per user + question. `Selected_Option` FK to `QuizOptions`. `Score` is 0 or 1 |

Lesson total score is not stored as a copy. It is:

```sql
SELECT u.Name, l.Title, SUM(a.Score) AS Total_Score
FROM QuizAttempts a
JOIN Users u ON u.User_ID = a.User_ID
JOIN QuizQuestions q ON q.Question_ID = a.Question_ID
JOIN Lessons l ON l.Lesson_ID = q.Lesson_ID
GROUP BY u.User_ID, u.Name, l.Lesson_ID, l.Title;
```

---

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | MySQL + Prisma ORM |
| Auth | JWT, bcrypt, Zod |
| Local tools | XAMPP, DBeaver |

---

## Run on this PC

### 1. Start MySQL

1. Open **XAMPP Control Panel** (`C:\xampp\xampp-control.exe`).
2. Click **Start** next to **MySQL**. Wait until it is green.

Default URL (empty XAMPP root password):

```text
mysql://root:@localhost:3306/gamlish_dbms
```

If root has a password, edit `backend/.env`.

### 2. Create tables and seed

```bash
cd d:\ielts_habib\2026\web_project\gamlish-dbms-lab
npm install
npm run install:all
npm run db:setup
```

This creates `gamlish_dbms`, pushes the 7 tables, and seeds Mission 01 plus demo accounts.

### 3. Start the app

```bash
npm run dev
```

| App | URL |
|---|---|
| Website | http://localhost:3001 |
| API health | http://localhost:4000/api/health |

Ports **3001** and **4000** are used so this lab does not clash with live Gamlish.

---

## Demo logins

| Role | Email | Password |
|---|---|---|
| Admin | admin@gamlish.test | Admin@123 |
| Student | student@gamlish.test | Student@123 |

Or open http://localhost:3001/register and create a new student.  
Admin can also create users at **Admin → Users**.

---

## Project layout

```text
gamlish-dbms-lab/
  frontend/          Next.js UI (port 3001)
  backend/           Express + Prisma (port 4000)
  backend/prisma/    schema.prisma + seed.ts
  docs/              ER, SQL, normalization, deploy notes
  README.md          this file
```

---

## Report checklist

Use these in the PDF and viva:

1. Cover page from the proposal
2. Live ER: [dbdiagram.io/d/gamlish_dbms_lab-6a803de8e093539a9ebf8e38](https://dbdiagram.io/d/gamlish_dbms_lab-6a803de8e093539a9ebf8e38)
3. Table list + PK/FK from `docs/schema.sql`
4. Normalization from `docs/normalization.md`
5. Screenshots: register, login, video, one-question quiz, score, admin CRUD
6. Sample SQL from `docs/sample-queries.sql`
7. More notes in `docs/report-notes.md`

Teacher may ask:

```sql
SHOW TABLES;
DESCRIBE Users;
SHOW CREATE TABLE QuizAttempts;
SELECT * FROM Users;
```

---

## Public URL for the teacher

`localhost` only works on this PC. To let the teacher open the lab from her laptop, follow **[docs/DEPLOY-FREE.md](docs/DEPLOY-FREE.md)** (free Aiven MySQL + Render API + Vercel frontend).

After deploy, send:

```text
Lab demo: https://YOUR-VERCEL-URL
ER diagram: https://dbdiagram.io/d/gamlish_dbms_lab-6a803de8e093539a9ebf8e38
Real Gamlish: https://gamlish.com
```

---

## What this is not

- Not the live Gamlish SaaS
- Not MongoDB
- Not 21 missions, payments, or leaderboards

Those belong to [gamlish.com](https://gamlish.com). This repo proves relational design, CRUD, auth, and progress tracking for CSE 224.
