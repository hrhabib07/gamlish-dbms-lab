import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email("Valid email is required").max(150),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
  role: z.enum(["student", "admin"]).default("student"),
});

export const lessonSchema = z.object({
  levelId: z.number().int().positive().optional(),
  title: z.string().trim().min(2).max(150),
  videoUrl: z.string().trim().url("Video URL must be valid").max(500),
  lessonContent: z.string().trim().min(10, "Lesson notes are required"),
});

export const questionSchema = z.object({
  lessonId: z.number().int().positive(),
  question: z.string().trim().min(4),
  options: z
    .array(
      z.object({
        optionText: z.string().trim().min(1),
        isCorrect: z.boolean(),
      }),
    )
    .length(4, "Each question needs exactly 4 options")
    .refine((options) => options.filter((item) => item.isCorrect).length === 1, {
      message: "Mark exactly one option as correct",
    }),
});

export const questionUpdateSchema = z.object({
  question: z.string().trim().min(4),
  options: z
    .array(
      z.object({
        optionText: z.string().trim().min(1),
        isCorrect: z.boolean(),
      }),
    )
    .length(4, "Each question needs exactly 4 options")
    .refine((options) => options.filter((item) => item.isCorrect).length === 1, {
      message: "Mark exactly one option as correct",
    }),
});
