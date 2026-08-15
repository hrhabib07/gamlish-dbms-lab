# Report and viva notes · Gamlish DBMS Lab

Course: CSE 224 · Database Management System Lab  
Project: Gamlish: A Game-Based English Learning Platform

## What to put in the PDF

1. Cover page from the submitted proposal.
2. Introduction, problem, objectives (already written).
3. ER diagram: live link [https://dbdiagram.io/d/gamlish_dbms_lab-6a803de8e093539a9ebf8e38](https://dbdiagram.io/d/gamlish_dbms_lab-6a803de8e093539a9ebf8e38). Also `docs/er-diagram.png` or export PNG from that dbdiagram page.
4. Table list with PK/FK from `schema.sql`.
5. Normalization page from `normalization.md`.
6. Screenshots:
   - XAMPP MySQL running
   - phpMyAdmin or DBeaver showing the 7 tables
   - DBeaver ER or the dbdiagram export
   - Student register / login / lesson / quiz / score
   - Admin users, progress, scores, add/edit/delete lesson and question
7. Sample SQL results from `sample-queries.sql`.
8. Conclusion.

## Demo accounts (after seed)

| Role | Email | Password |
|---|---|---|
| Admin | admin@gamlish.test | Admin@123 |
| Student | student@gamlish.test | Student@123 |

## Viva talking points

- Why MySQL instead of MongoDB: this course is relational. The live Gamlish product is a different system.
- Why `Selected_Option` is a foreign key: avoids repeating option text and keeps 3NF.
- Why `Score` is 0/1 per question: the lesson total is an aggregate, not a stored derived column on Users.
- Cascade: deleting a question deletes its options. Deleting a user deletes that user's progress and attempts.
- Restrict: a lesson cannot be deleted if you change the rule; levels are restricted so you do not drop Level 1 by accident.

## Commands the teacher may ask you to run

```sql
SHOW TABLES;
DESCRIBE Users;
SHOW CREATE TABLE QuizAttempts;
SELECT * FROM Users;
```
