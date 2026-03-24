import { Router } from "express";
import { EventController } from "./event.controller";

const router = Router();

router.post('/create', EventController.createEvent);

export const EventRoutes = router;
