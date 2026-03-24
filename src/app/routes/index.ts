import { Router } from "express";
import { EventRoutes } from "../modules/event/event.route";

const router = Router();

router.use('/events', EventRoutes);

export const IndexRoutes = router;