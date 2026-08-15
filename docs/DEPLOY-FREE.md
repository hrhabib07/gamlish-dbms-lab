# Deploy this lab for free

Yes, this is possible. You need **three free accounts**, not one.

| Piece | Free host | Why |
|---|---|---|
| Website (Next.js) | [Vercel](https://vercel.com) | Best free host for the frontend |
| API (Express + Prisma) | [Render](https://render.com) | Vercel is a poor fit for a long-running Express + MySQL API |
| Database (MySQL) | [Aiven](https://aiven.io) | XAMPP only works on your PC |

**Parcel** is a bundler, not a host. Use **Vercel** for the frontend.

You do not get `gamlish.com` from this. You get a free URL like `https://gamlish-dbms.vercel.app`. The gold bar still opens the real site: [https://gamlish.com](https://gamlish.com).

---

## Order (do not skip)

1. Put this lab folder on GitHub
2. Create free MySQL on Aiven
3. Deploy the API on Render
4. Deploy the website on Vercel
5. Paste the Vercel URL back into Render as `CLIENT_ORIGIN`

---

## 1. GitHub (lab folder only)

Create a **new** GitHub repo, for example `gamlish-dbms-lab`.

Do **not** push the live `ielts_habib_v1` project.

From this folder:

```bash
cd d:\ielts_habib\2026\web_project\gamlish-dbms-lab
git add .
git commit -m "Gamlish DBMS lab ready to deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/gamlish-dbms-lab.git
git push -u origin main
```

Do not commit `backend/.env` or `frontend/.env.local`.

---

## 2. Free MySQL · Aiven

1. Sign up at [https://aiven.io](https://aiven.io).
2. Create service · **MySQL** · free tier.
3. Open the service · copy the connection string.
4. For Prisma, use this form (SSL):

```text
mysql://USER:PASSWORD@HOST:PORT/defaultdb?sslaccept=strict
```

If Aiven shows `ssl-mode=REQUIRED`, change that part to `sslaccept=strict`.

Keep this string private. You will paste it into Render.

---

## 3. Free API · Render

1. Sign up at [https://render.com](https://render.com) with GitHub.
2. **New · Web Service** · pick `gamlish-dbms-lab`.
3. Set:

| Field | Value |
|---|---|
| Root directory | `backend` |
| Runtime | Node |
| Build command | `npm install && npx prisma generate && npx prisma db push && npx tsx prisma/seed.ts` |
| Start command | `npm start` |
| Instance | Free |

4. Environment variables:

| Key | Value |
|---|---|
| `DATABASE_URL` | Aiven string from step 2 |
| `JWT_SECRET` | any long random text |
| `CLIENT_ORIGIN` | `http://localhost:3001` for now. Replace after Vercel. |

5. Deploy. Copy the API URL, for example:

```text
https://gamlish-dbms-api.onrender.com
```

Test it in the browser:

```text
https://gamlish-dbms-api.onrender.com/api/health
```

You should see: `Gamlish DBMS API is running`.

Free Render apps **sleep** after idle time. The first open can take 30-60 seconds. Tell your teacher to wait once.

---

## 4. Free website · Vercel

1. Sign up at [https://vercel.com](https://vercel.com) with the same GitHub account.
2. **Add New · Project** · import `gamlish-dbms-lab`.
3. Set:

| Field | Value |
|---|---|
| Root directory | `frontend` |
| Framework | Next.js (auto) |

4. Environment variable:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://YOUR-RENDER-URL.onrender.com/api` |

No trailing slash after `api`.

5. Deploy. Copy the site URL, for example:

```text
https://gamlish-dbms.vercel.app
```

6. Go back to Render · Environment · set:

```text
CLIENT_ORIGIN=https://gamlish-dbms.vercel.app
```

No trailing slash. Save. Render will redeploy.

---

## 5. Send this to your teacher

```text
Lab website: https://YOUR-VERCEL-URL
ER diagram: https://dbdiagram.io/d/gamlish_dbms_lab-6a803de8e093539a9ebf8e38
Real Gamlish: https://gamlish.com

Student: register on the lab site
or student@gamlish.test / Student@123
Admin: admin@gamlish.test / Admin@123
```

---

## If something fails

| Problem | Fix |
|---|---|
| Vercel builds, login fails | `NEXT_PUBLIC_API_URL` must end with `/api` and match the Render URL |
| Browser CORS error | `CLIENT_ORIGIN` on Render must be the exact Vercel URL, `https`, no slash at the end |
| Prisma / SSL error | DATABASE_URL must include `?sslaccept=strict` |
| Render build cannot find `tsx` | Root directory must be `backend` |
| First visit is slow | Normal on the free Render plan. Wait and refresh |
| Teacher cannot register | API is asleep or `CLIENT_ORIGIN` is still localhost |

---

## Do not

- Do not deploy `ielts_habib_v1` (the live site) for this course.
- Do not point this lab at the live MongoDB.
- Do not put Aiven / Render passwords in the README.
