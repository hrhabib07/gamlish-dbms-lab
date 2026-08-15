import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { z } from "zod";
import type { submitQuizSchema } from "./student.validation";

export async function getDashboard(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  const level = await prisma.level.findUnique({
    where: { levelNumber: 1 },
    include: {
      lessons: {
        orderBy: { id: "asc" },
        include: {
          progress: {
            where: { userId },
          },
          _count: { select: { questions: true } },
        },
      },
    },
  });

  if (!level) {
    throw new AppError(404, "Level 1 is not set up yet");
  }

  return {
    user,
    level: {
      id: level.id,
      levelNumber: level.levelNumber,
      title: level.title,
      lessons: level.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        questionCount: lesson._count.questions,
        completed: lesson.progress[0]?.completed ?? false,
      })),
    },
  };
}

export async function getLesson(userId: number, lessonId: number) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      level: true,
      progress: { where: { userId } },
      _count: { select: { questions: true } },
    },
  });
  if (!lesson) {
    throw new AppError(404, "Lesson not found");
  }

  return {
    id: lesson.id,
    title: lesson.title,
    videoUrl: lesson.videoUrl,
    lessonContent: lesson.lessonContent,
    questionCount: lesson._count.questions,
    completed: lesson.progress[0]?.completed ?? false,
    level: {
      id: lesson.level.id,
      levelNumber: lesson.level.levelNumber,
      title: lesson.level.title,
    },
  };
}

export async function getQuiz(lessonId: number) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      questions: {
        orderBy: { id: "asc" },
        include: {
          options: {
            orderBy: { id: "asc" },
            select: { id: true, optionText: true },
          },
        },
      },
    },
  });
  if (!lesson) {
    throw new AppError(404, "Lesson not found");
  }
  if (lesson.questions.length === 0) {
    throw new AppError(404, "No quiz questions for this lesson");
  }

  return {
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    questions: lesson.questions.map((question) => ({
      id: question.id,
      question: question.question,
      options: question.options,
    })),
  };
}

export async function submitQuiz(
  userId: number,
  lessonId: number,
  input: z.infer<typeof submitQuizSchema>,
) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      questions: {
        include: { options: true },
      },
    },
  });
  if (!lesson) {
    throw new AppError(404, "Lesson not found");
  }

  const questionIds = new Set(lesson.questions.map((q) => q.id));
  const submittedIds = new Set(input.answers.map((a) => a.questionId));
  if (questionIds.size !== submittedIds.size) {
    throw new AppError(400, "Answer every question before submitting");
  }
  for (const id of questionIds) {
    if (!submittedIds.has(id)) {
      throw new AppError(400, "Answer every question before submitting");
    }
  }

  const questionMap = new Map(lesson.questions.map((q) => [q.id, q]));

  await prisma.$transaction(async (tx) => {
    for (const answer of input.answers) {
      const question = questionMap.get(answer.questionId);
      if (!question) {
        throw new AppError(400, "Invalid question in submission");
      }
      const option = question.options.find((item) => item.id === answer.optionId);
      if (!option) {
        throw new AppError(400, "Invalid option in submission");
      }
      const score = option.isCorrect ? 1 : 0;
      await tx.quizAttempt.upsert({
        where: {
          userId_questionId: {
            userId,
            questionId: question.id,
          },
        },
        update: {
          selectedOptionId: option.id,
          score,
        },
        create: {
          userId,
          questionId: question.id,
          selectedOptionId: option.id,
          score,
        },
      });
    }

    await tx.userProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      update: { completed: true },
      create: { userId, lessonId, completed: true },
    });
  });

  return getResult(userId, lessonId);
}

export async function getResult(userId: number, lessonId: number) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      questions: {
        orderBy: { id: "asc" },
        include: {
          options: true,
          attempts: {
            where: { userId },
          },
        },
      },
    },
  });
  if (!lesson) {
    throw new AppError(404, "Lesson not found");
  }

  const rows = lesson.questions.map((question) => {
    const attempt = question.attempts[0];
    const correct = question.options.find((option) => option.isCorrect);
    const selected = question.options.find(
      (option) => option.id === attempt?.selectedOptionId,
    );
    return {
      questionId: question.id,
      question: question.question,
      selectedOption: selected?.optionText ?? null,
      correctOption: correct?.optionText ?? null,
      score: attempt?.score ?? 0,
    };
  });

  const total = rows.reduce((sum, row) => sum + row.score, 0);
  return {
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    total,
    outOf: rows.length,
    percent: rows.length === 0 ? 0 : Math.round((total * 100) / rows.length),
    answers: rows,
  };
}
