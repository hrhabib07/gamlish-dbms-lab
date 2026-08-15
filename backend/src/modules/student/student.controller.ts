import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../utils/AppError";
import type { AuthedRequest } from "../../middleware/auth";
import { submitQuizSchema } from "./student.validation";
import * as studentService from "./student.service";

function userIdOf(req: AuthedRequest): number {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError(401, "Please log in first");
  }
  return userId;
}

function lessonIdOf(req: AuthedRequest): number {
  const raw = req.params.lessonId;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const lessonId = Number(value);
  if (!Number.isInteger(lessonId) || lessonId <= 0) {
    throw new AppError(400, "Invalid lesson id");
  }
  return lessonId;
}

export const dashboard = catchAsync(async (req: AuthedRequest, res) => {
  const data = await studentService.getDashboard(userIdOf(req));
  sendResponse(res, 200, "Dashboard loaded", data);
});

export const lesson = catchAsync(async (req: AuthedRequest, res) => {
  const data = await studentService.getLesson(userIdOf(req), lessonIdOf(req));
  sendResponse(res, 200, "Lesson loaded", data);
});

export const quiz = catchAsync(async (req: AuthedRequest, res) => {
  const data = await studentService.getQuiz(lessonIdOf(req));
  sendResponse(res, 200, "Quiz loaded", data);
});

export const submit = catchAsync(async (req: AuthedRequest, res) => {
  const body = submitQuizSchema.parse(req.body);
  const data = await studentService.submitQuiz(
    userIdOf(req),
    lessonIdOf(req),
    body,
  );
  sendResponse(res, 200, "Quiz submitted", data);
});

export const result = catchAsync(async (req: AuthedRequest, res) => {
  const data = await studentService.getResult(userIdOf(req), lessonIdOf(req));
  sendResponse(res, 200, "Result loaded", data);
});
