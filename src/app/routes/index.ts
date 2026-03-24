import { Router } from "express";
import { EventRoutes } from "../modules/event/event.route";
import { AuthRouter } from "../modules/auth/auth.route";

const router = Router();

router.use('/events', EventRoutes);
router.use('/auth', AuthRouter);
export const IndexRoutes = router;