# SQL Injection Prevention

## Project-specific position

Gamlish uses Prisma with MySQL. Normal services use Prisma model methods such as `findUnique`, `findMany`, `create`, and `update`. The score report uses a tagged `Prisma.sql` query. These patterns parameterize values and should remain the default.

The seven existing tables are `Users`, `Levels`, `Lessons`, `QuizQuestions`, `QuizOptions`, `UserProgress`, and `QuizAttempts`. A foreign key or Prisma query is not a substitute for authorization: it prevents some invalid relationships but does not decide which user may access a valid row.

## Rules for future changes

- Use Prisma query arguments for values; do not build SQL with template-string interpolation or `+` concatenation.
- In raw SQL, use `Prisma.sql` parameters for every user-controlled value.
- Do not accept table names, column names, or sort expressions directly from a request. Map a small approved option set to fixed server-side identifiers.
- Parse numeric route IDs as positive integers before querying.
- Validate strings for type, length, and expected format at the route boundary.
- Keep response selection minimal; never select `Users.Password` for a response.
- Check authenticated ownership for `UserProgress` and `QuizAttempts` before reads and writes.
- Review SQL changes with a test containing quotes, comments, boolean expressions, and unusually long values.

## Safe review examples

Good Prisma value handling:

```ts
await prisma.user.findUnique({
  where: { email: input.email.toLowerCase() },
});
```

Good tagged raw SQL structure:

```ts
await prisma.$queryRaw(
  Prisma.sql`SELECT * FROM Lessons WHERE Lesson_ID = ${lessonId}`,
);
```

Unsafe pattern to reject:

```ts
// Do not use request input in concatenated SQL.
const sql = "SELECT * FROM Lessons WHERE Lesson_ID = " + request.params.id;
```

The examples are review guidance only; this document does not authorize running SQL or changing the schema.

## Safe verification

Use the manual cases in `security-test-cases.md` with a local or disposable environment. Send special characters through the normal HTTP API and confirm a controlled validation error or ordinary not-found response. Do not use `DROP`, `DELETE`, `UPDATE`, `INSERT`, `ALTER`, `TRUNCATE`, `LOAD DATA`, or any other write/destructive statement as a security test.

Evidence should include endpoint, HTTP status, and a redacted response summary. A successful test means the input is treated as data, no database error or stack trace is exposed, and no unauthorized record is returned.
