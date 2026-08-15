import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import { env } from "../../config/env";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { loginSchema, registerSchema } from "./auth.validation";
import type { z } from "zod";

function signToken(userId: number, role: "student" | "admin"): string {
  return jwt.sign({ userId, role }, env.jwtSecret, { expiresIn: "7d" });
}

function publicUser(user: {
  id: number;
  name: string;
  email: string;
  role: "student" | "admin";
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function register(input: z.infer<typeof registerSchema>) {
  const password = await bcrypt.hash(input.password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        password,
        role: "student",
      },
    });
    return {
      token: signToken(user.id, user.role),
      user: publicUser(user),
    };
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

export async function login(input: z.infer<typeof loginSchema>) {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });
  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }
  const ok = await bcrypt.compare(input.password, user.password);
  if (!ok) {
    throw new AppError(401, "Invalid email or password");
  }
  return {
    token: signToken(user.id, user.role),
    user: publicUser(user),
  };
}

export async function getMe(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return publicUser(user);
}
