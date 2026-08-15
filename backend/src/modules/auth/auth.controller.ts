import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../utils/AppError";
import type { AuthedRequest } from "../../middleware/auth";
import { loginSchema, registerSchema } from "./auth.validation";
import * as authService from "./auth.service";

export const register = catchAsync(async (req, res) => {
  const body = registerSchema.parse(req.body);
  const data = await authService.register(body);
  sendResponse(res, 201, "Account created", data);
});

export const login = catchAsync(async (req, res) => {
  const body = loginSchema.parse(req.body);
  const data = await authService.login(body);
  sendResponse(res, 200, "Logged in", data);
});

export const me = catchAsync(async (req: AuthedRequest, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError(401, "Please log in first");
  }
  const data = await authService.getMe(userId);
  sendResponse(res, 200, "Profile loaded", data);
});
