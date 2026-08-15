import { Router } from "express";
import { authenticate, requireAdmin } from "../../middleware/auth";
import * as adminController from "./admin.controller";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/users", adminController.users);
router.post("/users", adminController.createUser);
router.get("/progress", adminController.progress);
router.get("/scores", adminController.scores);

router.get("/lessons", adminController.lessons);
router.post("/lessons", adminController.createLesson);
router.put("/lessons/:id", adminController.updateLesson);
router.delete("/lessons/:id", adminController.deleteLesson);

router.get("/questions", adminController.questions);
router.post("/questions", adminController.createQuestion);
router.put("/questions/:id", adminController.updateQuestion);
router.delete("/questions/:id", adminController.deleteQuestion);

export const adminRoutes = router;
