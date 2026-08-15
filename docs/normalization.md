# Normalization · Gamlish DBMS Lab

## 1NF

- Each table has a primary key.
- Each cell holds one value (no comma-separated options).
- Quiz choices live in `QuizOptions`, not inside `QuizQuestions`.

## 2NF

- Non-key attributes depend on the whole primary key.
- Composite unique keys:
  - `UserProgress (User_ID, Lesson_ID)`
  - `QuizAttempts (User_ID, Question_ID)`
- Lesson title is stored on `Lessons`, not repeated on every attempt.

## 3NF

- No transitive dependency.
- `Selected_Option` is a foreign key. The option text is not copied onto `QuizAttempts`.
- `Score` is stored as 0 or 1 for that question. The lesson total is computed:

```sql
SUM(Score)
```

- User name and email stay on `Users`. Progress and attempts only store `User_ID`.

## Why this design fits CSE 224

- Primary keys and foreign keys are explicit.
- Cascades are documented (`ON DELETE CASCADE` for questions/options/progress).
- Admin CRUD changes one table (or a parent + children) without rewriting scores as text.
- Join queries in `sample-queries.sql` prove the relationships work.
