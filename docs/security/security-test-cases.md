# Safe Security Test Cases

These are manual, non-destructive checks for a local or disposable deployment. Use test accounts and synthetic values. Do not use production personal data, real passwords, tokens, or database credentials. Never run SQL statements from a request parameter.

| ID | Test | Steps | Expected result |
|---|---|---|---|
| AUTH-01 | Missing authentication | Request `GET /api/auth/me`, `GET /api/student/dashboard`, and `GET /api/admin/users` without an Authorization header. | Each protected endpoint returns HTTP 401 and no private data. |
| AUTH-02 | Invalid bearer token | Send `Authorization: Bearer invalid-test-token` to a protected endpoint. | HTTP 401 with a generic message; no stack trace or token echo. |
| AUTH-03 | Expired or altered token | Use a deliberately expired or locally altered test token, never a live token. | HTTP 401; request is not accepted. |
| AUTH-04 | Generic login failure | Attempt login once with a nonexistent test email and once with a wrong password for a test account. | Public responses do not reveal whether the account exists. |
| AUTH-05 | Password not returned | Log in with an existing non-production test account, inspect the JSON response, then call `GET /api/auth/me` with the returned test token. | No plaintext password or password hash appears in either response. |
| AUTH-06 | Student blocked from admin | Authenticate as a test student and request `GET /api/admin/users` and one harmless admin read endpoint. | HTTP 403 and no admin data. |
| AUTH-07 | Admin route coverage | Authenticate as a test admin and verify only the intended admin endpoints succeed. | Admin access works only with a valid admin identity; errors remain generic. |
| AUTH-08 | Logout/client cleanup | Log in through the UI, log out, then inspect the browser's application storage and request a protected page. | Client session values are cleared and protected access requires authentication again. |
| INPUT-01 | Validation boundaries | Submit missing fields, wrong types, overlong names, invalid email, short password, invalid lesson URL, and malformed numeric IDs. | HTTP 400 or the documented validation response; no database error or stack trace. |
| INPUT-02 | SQL metacharacters in IDs | Request `GET /api/student/lessons/:lessonId`, `/quiz`, and `/result` with URL-encoded quote and comment-like values such as `test%27` and `--%20test`, using a test student token. | Controlled HTTP 400 response from ID validation; no SQL error, stack trace, or unrelated content. |
| INPUT-03 | SQL expression in an ID | Request the same read-only student routes with a value such as `x%27%20OR%20%271%27=%271`. | The value is rejected as an invalid numeric ID and is not interpreted as a query. |
| INPUT-04 | Numeric ID boundaries | Request the read-only student lesson, quiz, and result routes with `0`, negative, decimal, alphabetic, and very large IDs. | Controlled 400/404 response; no 500 response, SQL details, or unrelated content. |
| INPUT-05 | Unexpected fields | Add an extra field such as `role: "admin"` to public registration input. | The public registration path does not grant an admin role. |
| XSS-01 | Stored text rendering review | Review the existing student and admin pages that render lesson content, question text, option text, names, and emails. Confirm they use text rendering and do not use `dangerouslySetInnerHTML`; use source review or existing data only. | Stored values are escaped or safely rendered as text; no script executes and no storage token is exposed. |
| XSS-02 | URL scheme handling | Test lesson URL validation with `javascript:` and other non-HTTP schemes in a disposable environment. | URL is rejected and is never executed or embedded. |
| XSS-03 | Error reflection | Put HTML-like characters in an invalid path or input and inspect the response and UI. | Characters are encoded; the browser does not execute them. |
| ACCESS-01 | Student ownership | Using two existing test student identities, use student A's session while requesting IDs associated with student B's progress, attempt, or result. If only one test identity exists, verify the ownership filters in the student service by source review. | No student B data is returned or changed. |
| ACCESS-02 | Cross-lesson quiz relationship | Review the quiz submission path and, if an HTTP check is needed, send an incomplete or otherwise validation-failing answer payload to `POST /api/student/lessons/:lessonId/quiz` using a test student session. | The request is rejected before a transaction; no invalid attempt is stored. |
| ACCESS-03 | Admin data minimization | Inspect admin user, progress, and score responses using a test admin session. | Necessary fields are present; password hashes, tokens, and unrelated secrets are absent. |
| DEPLOY-01 | CORS policy | Send an API request with an untrusted `Origin` and inspect response CORS headers. | Production does not reflect arbitrary origins or allow unintended credentialed access. |
| DEPLOY-02 | HTTPS and session transport | Check deployed frontend/API/database configuration and browser network requests. The current frontend uses a bearer JWT in `localStorage`, not a session cookie. | Public traffic uses HTTPS and bearer tokens are not exposed in URLs or logs. If cookie sessions are introduced later, verify Secure, HttpOnly, and appropriate SameSite attributes. |
| DEPLOY-03 | Secret exposure | Inspect repository status, tracked files, build logs, and public frontend configuration for secret-shaped values. | No database URL, JWT secret, password, API key, or bearer token is exposed. |
| ERROR-01 | Unexpected server error | Send harmless malformed JSON or invalid content types to a JSON endpoint. | Controlled 4xx response; no stack trace, SQL, file path, or environment value. |
| ERROR-02 | Not-found behavior | Request nonexistent routes and nonexistent numeric resources. | HTTP 404 with a generic response and no information about unrelated records. |
| AVAIL-01 | Body limit | Send a synthetic request body just over the documented 1 MB JSON limit, without sensitive data. | Request is rejected or bounded without an unhandled crash. |

## Recording results

For each case record: date, environment, case ID, status, HTTP status, and a short redacted observation. Stop and report if a test unexpectedly writes data, exposes a secret, returns another user's data, or produces a stack trace. Restore only disposable test data through the normal application workflow; do not run destructive SQL.
