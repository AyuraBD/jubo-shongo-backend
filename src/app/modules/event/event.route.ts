import { Router } from "express";
import { EventController } from "./event.controller";
import { checkAuthMiddleware } from "../../middleware/authMiddleware";
import { Role } from "../../../generated/prisma";
import { multerUpload } from "../../../config/multer.config";

const router = Router();

router.post('/create', checkAuthMiddleware(Role.SUPER_ADMIN, Role.ADMIN), multerUpload.single("file"), EventController.createEvent);

export const EventRoutes = router;
