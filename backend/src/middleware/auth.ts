import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import type { Role } from "@prisma/client";

export interface AuthPayload {
  userId: number;
  role: Role;
}

export interface AuthedRequest extends Request {
  user?: AuthPayload;
}

export function authenticate(
  req: AuthedRequest,
  _res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    next(new AppError(401, "Please log in first"));
    return;
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as AuthPayload;
    req.user = decoded;
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
}

export function requireAdmin(
  req: AuthedRequest,
  _res: Response,
  next: NextFunction,
): void {
  if (req.user?.role !== "admin") {
    next(new AppError(403, "Admin access required"));
    return;
  }
  next();
}

export function requireStudent(
  req: AuthedRequest,
  _res: Response,
  next: NextFunction,
): void {
  if (req.user?.role !== "student") {
    next(new AppError(403, "Student access required"));
    return;
  }
  next();
}
