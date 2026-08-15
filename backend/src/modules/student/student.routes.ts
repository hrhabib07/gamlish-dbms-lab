import { Router } from "express";
import { authenticate, requireStudent } from "../../middleware/auth";
import * as studentController from "./student.controller";

const router = Router();

router.use(authenticate, requireStudent);

router.get("/dashboard", studentController.dashboard);
router.get("/lessons/:lessonId", studentController.lesson);
router.get("/lessons/:lessonId/quiz", studentController.quiz);
router.post("/lessons/:lessonId/quiz", studentController.submit);
router.get("/lessons/:lessonId/result", studentController.result);

export const studentRoutes = router;
