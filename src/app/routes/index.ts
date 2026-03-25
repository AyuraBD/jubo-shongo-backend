import { Router } from "express";
import { EventRoutes } from "../modules/event/event.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { CampaignRoutes } from "../modules/campaign/campaign.route";

const router = Router();

router.use('/events', EventRoutes);
router.use('/auth', AuthRouter);
router.use('/campaign', CampaignRoutes);

export const IndexRoutes = router;