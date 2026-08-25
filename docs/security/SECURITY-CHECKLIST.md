# Gamlish Security Checklist

Use this as a review checklist. Mark each item only after verifying it in the current deployment or code review.

## Authentication and passwords

- [ ] Login failures use the same public response for unknown and incorrect credentials.
- [ ] Registration does not return or log a plaintext password.
- [ ] Password hashes are never returned by API responses or admin lists.
- [ ] Password policy is documented and does not put passwords in logs.
- [ ] Bcrypt cost is reviewed for the deployment hardware.
- [ ] Login and registration have rate limiting or an equivalent abuse control.
- [ ] Password reset, if added, uses single-use expiring tokens.

## Authorization and access control

- [ ] Every student and admin endpoint is protected by server-side authorization.
- [ ] Student requests cannot read or change another student's progress or attempts.
- [ ] Admin endpoints reject students with HTTP 403.
- [ ] Role claims are verified and cannot be trusted from client storage alone.
- [ ] Admin account creation and role changes are intentionally restricted.
- [ ] The last administrator cannot be unintentionally removed.
- [ ] Object IDs are validated and ownership is checked before reads and writes.

## Input, SQL, and browser safety

- [ ] Body, path, query, and header values are validated with explicit types and limits.
- [ ] Prisma builders or parameterized tagged SQL are used for all database values.
- [ ] No request input is concatenated into SQL, identifiers, sort clauses, or file paths.
- [ ] Selected quiz options are checked against their question and the authenticated user.
- [ ] Database content is rendered as text unless a reviewed sanitizer and allowlist are used.
- [ ] Video URL schemes and hosts are restricted to the intended providers.
- [ ] Production responses include appropriate security headers and a CSP.

## Session and transport

- [ ] Production always uses HTTPS, including API and database connections.
- [ ] JWT secret is explicitly configured from the deployment secret manager.
- [ ] The development fallback JWT secret cannot be used in production.
- [ ] Token lifetime, renewal, logout, and revocation behavior are documented.
- [ ] Tokens are not placed in URLs, logs, analytics, or error reports.
- [ ] Browser storage choice has been reviewed against XSS risk.
- [ ] CORS allows only known HTTPS frontend origins.
- [ ] CSRF protections match the selected cookie or bearer-token design.

## Data and database

- [ ] Application database credentials are least privilege and are not root credentials.
- [ ] Database TLS certificate behavior is verified for the provider.
- [ ] Backups, retention, restore testing, and provider access are documented.
- [ ] User, progress, attempt, and score data are visible only to authorized roles.
- [ ] Error responses do not reveal SQL, stack traces, connection details, or hashes.
- [ ] Logs redact Authorization headers, passwords, database URLs, and personal data.
- [ ] Foreign keys and unique constraints are monitored for unexpected failures.

## Git and deployment

- [ ] `.env` and `.env.local` files are ignored and absent from Git history.
- [ ] GitHub secret scanning and push protection are enabled.
- [ ] Provider accounts use MFA and least-privilege team access.
- [ ] Build logs do not print environment variables or database URLs.
- [ ] Dependencies are reviewed and updated through controlled changes.
- [ ] Demo accounts are disabled, rotated, or isolated before real users are introduced.
- [ ] Deployment alerts cover repeated 401/403 responses, 5xx errors, and admin changes.

## Evidence

Record date, environment, test case ID, result, and a redacted observation. Do not record passwords, bearer tokens, database URLs, or full personal records.
