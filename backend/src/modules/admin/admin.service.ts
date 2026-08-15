import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { z } from "zod";
import type {
  createUserSchema,
  lessonSchema,
  questionSchema,
  questionUpdateSchema,
} from "./admin.validation";

export async function createUser(input: z.infer<typeof createUserSchema>) {
  const password = await bcrypt.hash(input.password, 10);
  try {
    return await prisma.user.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        password,
        role: input.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(409, "An account with this email already exists");
    }
    throw error;
  }
}

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function listProgress() {
  return prisma.userProgress.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      lesson: { select: { id: true, title: true } },
    },
  });
}

type ScoreRow = {
  userId: number;
  name: string;
  email: string;
  lessonId: number;
  lessonTitle: string;
  totalScore: number;
  questionsAnswered: number;
};

export async function listScores() {
  const rows = await prisma.$queryRaw<ScoreRow[]>(Prisma.sql`
    SELECT
      u.User_ID AS userId,
      u.Name AS name,
      u.Email AS email,
      l.Lesson_ID AS lessonId,
      l.Title AS lessonTitle,
      SUM(a.Score) AS totalScore,
      COUNT(a.Attempt_ID) AS questionsAnswered
    FROM QuizAttempts a
    JOIN Users u ON u.User_ID = a.User_ID
    JOIN QuizQuestions q ON q.Question_ID = a.Question_ID
    JOIN Lessons l ON l.Lesson_ID = q.Lesson_ID
    GROUP BY u.User_ID, u.Name, u.Email, l.Lesson_ID, l.Title
    ORDER BY totalScore DESC
  `);

  return rows.map((row) => ({
    userId: Number(row.userId),
    name: row.name,
    email: row.email,
    lessonId: Number(row.lessonId),
    lessonTitle: row.lessonTitle,
    totalScore: Number(row.totalScore),
    questionsAnswered: Number(row.questionsAnswered),
  }));
}

export async function listLessons() {
  return prisma.lesson.findMany({
    orderBy: { id: "asc" },
    include: {
      level: true,
      _count: { select: { questions: true } },
    },
  });
}

export async function createLesson(input: z.infer<typeof lessonSchema>) {
  const level =
    input.levelId != null
      ? await prisma.level.findUnique({ where: { id: input.levelId } })
      : await prisma.level.findUnique({ where: { levelNumber: 1 } });
  if (!level) {
    throw new AppError(404, "Level not found");
  }
  return prisma.lesson.create({
    data: {
      levelId: level.id,
      title: input.title,
      videoUrl: input.videoUrl,
      lessonContent: input.lessonContent,
    },
  });
}

export async function updateLesson(
  lessonId: number,
  input: z.infer<typeof lessonSchema>,
) {
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) {
    throw new AppError(404, "Lesson not found");
  }
  return prisma.lesson.update({
    where: { id: lessonId },
    data: {
      title: input.title,
      videoUrl: input.videoUrl,
      lessonContent: input.lessonContent,
    },
  });
}

export async function deleteLesson(lessonId: number) {
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) {
    throw new AppError(404, "Lesson not found");
  }
  await prisma.lesson.delete({ where: { id: lessonId } });
}

export async function listQuestions() {
  return prisma.quizQuestion.findMany({
    orderBy: { id: "asc" },
    include: {
      lesson: { select: { id: true, title: true } },
      options: { orderBy: { id: "asc" } },
    },
  });
}

export async function createQuestion(input: z.infer<typeof questionSchema>) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: input.lessonId },
  });
  if (!lesson) {
    throw new AppError(404, "Lesson not found");
  }
  return prisma.quizQuestion.create({
    data: {
      lessonId: input.lessonId,
      question: input.question,
      options: {
        create: input.options.map((option) => ({
          optionText: option.optionText,
          isCorrect: option.isCorrect,
        })),
      },
    },
    include: { options: true },
  });
}

export async function updateQuestion(
  questionId: number,
  input: z.infer<typeof questionUpdateSchema>,
) {
  const question = await prisma.quizQuestion.findUnique({
    where: { id: questionId },
  });
  if (!question) {
    throw new AppError(404, "Question not found");
  }

  return prisma.$transaction(async (tx) => {
    await tx.quizOption.deleteMany({ where: { questionId } });
    return tx.quizQuestion.update({
      where: { id: questionId },
      data: {
        question: input.question,
        options: {
          create: input.options.map((option) => ({
            optionText: option.optionText,
            isCorrect: option.isCorrect,
          })),
        },
      },
      include: { options: true },
    });
  });
}

export async function deleteQuestion(questionId: number) {
  const question = await prisma.quizQuestion.findUnique({
    where: { id: questionId },
  });
  if (!question) {
    throw new AppError(404, "Question not found");
  }
  await prisma.quizQuestion.delete({ where: { id: questionId } });
}
