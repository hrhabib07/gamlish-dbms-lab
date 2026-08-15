import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../utils/AppError";
import {
  createUserSchema,
  lessonSchema,
  questionSchema,
  questionUpdateSchema,
} from "./admin.validation";
import * as adminService from "./admin.service";

function idOf(value: string | string[] | undefined, label: string): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, `Invalid ${label}`);
  }
  return id;
}

export const users = catchAsync(async (_req, res) => {
  const data = await adminService.listUsers();
  sendResponse(res, 200, "Users loaded", data);
});

export const createUser = catchAsync(async (req, res) => {
  const body = createUserSchema.parse(req.body);
  const data = await adminService.createUser(body);
  sendResponse(res, 201, "User created", data);
});

export const progress = catchAsync(async (_req, res) => {
  const data = await adminService.listProgress();
  sendResponse(res, 200, "Progress loaded", data);
});

export const scores = catchAsync(async (_req, res) => {
  const data = await adminService.listScores();
  sendResponse(res, 200, "Scores loaded", data);
});

export const lessons = catchAsync(async (_req, res) => {
  const data = await adminService.listLessons();
  sendResponse(res, 200, "Lessons loaded", data);
});

export const createLesson = catchAsync(async (req, res) => {
  const body = lessonSchema.parse(req.body);
  const data = await adminService.createLesson(body);
  sendResponse(res, 201, "Lesson created", data);
});

export const updateLesson = catchAsync(async (req, res) => {
  const body = lessonSchema.parse(req.body);
  const data = await adminService.updateLesson(idOf(req.params.id, "lesson id"), body);
  sendResponse(res, 200, "Lesson updated", data);
});

export const deleteLesson = catchAsync(async (req, res) => {
  await adminService.deleteLesson(idOf(req.params.id, "lesson id"));
  sendResponse(res, 200, "Lesson deleted", null);
});

export const questions = catchAsync(async (_req, res) => {
  const data = await adminService.listQuestions();
  sendResponse(res, 200, "Questions loaded", data);
});

export const createQuestion = catchAsync(async (req, res) => {
  const body = questionSchema.parse(req.body);
  const data = await adminService.createQuestion(body);
  sendResponse(res, 201, "Question created", data);
});

export const updateQuestion = catchAsync(async (req, res) => {
  const body = questionUpdateSchema.parse(req.body);
  const data = await adminService.updateQuestion(
    idOf(req.params.id, "question id"),
    body,
  );
  sendResponse(res, 200, "Question updated", data);
});

export const deleteQuestion = catchAsync(async (req, res) => {
  await adminService.deleteQuestion(idOf(req.params.id, "question id"));
  sendResponse(res, 200, "Question deleted", null);
});
