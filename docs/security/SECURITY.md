# Gamlish DBMS Lab Security

## Scope

This document describes the security posture of the Gamlish DBMS Lab as implemented in this repository. It covers the Next.js frontend, Express and Prisma backend, and MySQL database used by the course lab. The commercial Gamlish product is out of scope.

This is documentation only. It does not change the schema, application behavior, database data, users, roles, or deployment.

## System and data inventory

The deployed path is browser -> Vercel frontend -> Render Express API -> Aiven MySQL. Local development can use MySQL through XAMPP. Prisma maps these existing tables:

| Table | Security-relevant data |
|---|---|
| `Users` | Name, email, bcrypt password hash, role, timestamps |
| `Levels` | Level number and title |
| `Lessons` | Level reference, title, video URL, lesson content |
| `QuizQuestions` | Question text and lesson reference |
| `QuizOptions` | Option text, correctness flag, question reference |
| `UserProgress` | User/lesson ownership and completion state |
| `QuizAttempts` | User/question ownership, selected option, score |

The highest sensitivity is in `Users.Password`, authentication tokens, database connection strings, and administrator capabilities. Quiz and progress records are personal academic activity and should also be treated as private.

## Current controls

- Registration and login use Zod validation.
- Passwords are hashed with `bcryptjs`; the application returns public user fields rather than the password hash.
- Prisma parameterizes normal queries. The score report uses `Prisma.sql` tagged query construction rather than string concatenation.
- JWTs are verified by the authentication middleware.
- Student and admin routes require authentication; admin routes additionally require the `admin` role.
- Unknown routes and unexpected errors return generic error messages.
- JSON request bodies have a 1 MB limit.
- Lesson video URLs are validated as URLs.
- Database relations, unique constraints, and foreign keys provide integrity boundaries.

## Required security expectations

### Authentication

Keep registration and login responses free of password material. Use generic login failures, as the current service does, to reduce account enumeration. Add rate limiting, login monitoring, account recovery rules, and a documented token lifetime before treating authentication as production-ready.

### Authorization and access control

Enforce authorization on the server for every protected operation. The authenticated user identity must come from a verified token, not from a request body or URL supplied by the browser. Student reads and writes must be restricted to that student's own progress and attempts. Administrative create, update, and delete operations must remain restricted to administrators.

Review whether an administrator should be allowed to create another administrator. Protect the last administrator from accidental removal or demotion if those operations are added later.

### Password hashing

Use a deliberately chosen bcrypt cost factor and review it as hardware changes. Never log, display, email, or place plaintext passwords in source control, seed output, screenshots, or issue reports. The existing seed contains demonstration accounts; those credentials must never be reused outside the lab.

### SQL injection prevention

Use Prisma query builders and tagged `Prisma.sql` parameters. Never construct SQL, table names, sort clauses, or filters by concatenating request input. If dynamic identifiers are ever needed, map approved values from a fixed allowlist. Validate and bound IDs before querying.

### Input validation

Validate body, path, query, and header values at the API boundary. Keep limits for names, email addresses, lesson content, URLs, question text, options, IDs, and pagination. Reject unexpected fields where practical. Validate that selected quiz options belong to the submitted question and that lesson and user relationships are authorized.

### XSS prevention

Render lesson content, question text, option text, names, and emails as text. Do not use unsafe HTML injection for database content. Treat video URLs as untrusted and allow only the intended URL schemes and hosts. Add a restrictive Content Security Policy and security headers at the deployment edge when the hosting setup permits it.

### Session and token security

The frontend currently stores the JWT in `localStorage`, which makes token theft through an XSS flaw especially serious. A stronger production design is a short-lived access token with a refresh mechanism using a Secure, HttpOnly, SameSite cookie, plus server-side rotation and revocation strategy. Until then, keep token lifetimes short, never put tokens in URLs, avoid logging Authorization headers, and clear client state on logout or authentication failure.

The current seven-day JWT lifetime and environment fallback secret require review before public production use. `JWT_SECRET` must be set to a long random value in the deployment secret manager; a fallback must never be accepted in production.

### Sensitive data protection

Use HTTPS for browser, API, and database connections. Minimize returned fields, especially in admin reports. Do not expose database URLs, hashes, stack traces, internal IDs beyond what the UI requires, or private student records to unauthorized clients. Redact tokens and personal data from logs and support artifacts.

### Database security

Use a managed MySQL service with TLS, private networking or IP restrictions where available, backups, monitoring, and least-privilege application credentials. Do not use a root account for the application. Keep schema changes reviewed and backups protected. Foreign keys and unique constraints are useful integrity controls but are not authorization controls.

### Error handling

Keep client errors generic and log diagnostic details only in protected server logs. Ensure errors from Prisma, JWT verification, URL parsing, and validation do not reveal SQL, connection strings, hashes, or stack traces. Use correlation IDs and alerting without placing secrets in the IDs or messages.

### Git and GitHub secret protection

Keep `.env`, `.env.local`, database URLs, JWT secrets, provider credentials, and exported database dumps out of Git. Use secret scanning and push protection, review `git diff --cached` before commits, rotate any exposed secret, and remove leaked values from history using the hosting provider's incident process. Documentation must use placeholders, never working credentials.

### Deployment security

Set exact production CORS origins rather than reflecting arbitrary origins. Keep frontend and API URLs on HTTPS, restrict Render and Vercel environment-variable access, review build logs, pin and update dependencies, and protect provider accounts with MFA. Disable or protect seed/demo behavior for production data. Monitor authentication failures, authorization failures, unexpected 5xx responses, and unusual admin activity.

## Security ownership checklist

Before calling this lab production-ready, verify the recommendations in `SECURITY-CHECKLIST.md`, then run the safe cases in `security-test-cases.md`. Record evidence without recording tokens, passwords, or personal data.
