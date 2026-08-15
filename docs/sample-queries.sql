-- Gamlish DBMS Lab · sample SQL for report, DBeaver, and viva
USE gamlish_dbms;

-- =========================================================
-- CREATE (already covered by schema.sql + seed)
-- =========================================================

-- Register-style insert (password should be bcrypt in the app)
-- INSERT INTO Users (Name, Email, Password, Role)
-- VALUES ('Test Student', 'test@gamlish.test', '$2b$10$hashed', 'student');

-- =========================================================
-- READ
-- =========================================================

-- All registered students
SELECT User_ID, Name, Email, Role, Created_At
FROM Users
WHERE Role = 'student'
ORDER BY Created_At DESC;

-- Level 1 with its lesson
SELECT
  lv.Level_Number,
  lv.Title AS Level_Title,
  ls.Lesson_ID,
  ls.Title AS Lesson_Title,
  ls.Video_URL
FROM Levels lv
JOIN Lessons ls ON ls.Level_ID = lv.Level_ID
WHERE lv.Level_Number = 1;

-- Quiz paper for a lesson (options hidden from students in the API)
SELECT
  q.Question_ID,
  q.Question,
  o.Option_ID,
  o.Option_Text,
  o.Is_Correct
FROM QuizQuestions q
JOIN QuizOptions o ON o.Question_ID = q.Question_ID
WHERE q.Lesson_ID = 1
ORDER BY q.Question_ID, o.Option_ID;

-- User progress
SELECT
  u.Name,
  l.Title AS Lesson,
  p.Completed,
  p.Updated_At
FROM UserProgress p
JOIN Users u ON u.User_ID = p.User_ID
JOIN Lessons l ON l.Lesson_ID = p.Lesson_ID
ORDER BY u.Name;

-- Quiz scores per student per lesson
SELECT
  u.User_ID,
  u.Name,
  l.Title AS Lesson,
  SUM(a.Score) AS Total_Score,
  COUNT(a.Attempt_ID) AS Questions_Answered,
  ROUND(SUM(a.Score) * 100.0 / COUNT(a.Attempt_ID), 1) AS Percent
FROM QuizAttempts a
JOIN Users u ON u.User_ID = a.User_ID
JOIN QuizQuestions q ON q.Question_ID = a.Question_ID
JOIN Lessons l ON l.Lesson_ID = q.Lesson_ID
GROUP BY u.User_ID, u.Name, l.Lesson_ID, l.Title
ORDER BY Total_Score DESC;

-- One student's wrong answers (join through Selected_Option FK)
SELECT
  u.Name,
  q.Question,
  chosen.Option_Text AS Selected,
  correct.Option_Text AS Correct_Answer
FROM QuizAttempts a
JOIN Users u ON u.User_ID = a.User_ID
JOIN QuizQuestions q ON q.Question_ID = a.Question_ID
JOIN QuizOptions chosen ON chosen.Option_ID = a.Selected_Option
JOIN QuizOptions correct
  ON correct.Question_ID = q.Question_ID
  AND correct.Is_Correct = 1
WHERE a.Score = 0
  AND u.Email = 'student@gamlish.test';

-- =========================================================
-- UPDATE
-- =========================================================

-- Edit a lesson title
UPDATE Lessons
SET Title = 'Word Order: Subject + Verb + Object'
WHERE Lesson_ID = 1;

-- Mark a lesson complete
UPDATE UserProgress
SET Completed = 1
WHERE User_ID = 2 AND Lesson_ID = 1;

-- =========================================================
-- DELETE
-- =========================================================

-- Delete one quiz question (options cascade)
-- DELETE FROM QuizQuestions WHERE Question_ID = 10;

-- Remove a leftover progress row
-- DELETE FROM UserProgress WHERE Progress_ID = 99;
