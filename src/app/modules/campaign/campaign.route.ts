import { Router } from "express";
import { CampaignController } from "./campaign.controller";
import { Role } from "../../../generated/prisma";
import { checkAuthMiddleware } from "../../middleware/authMiddleware";
import { validateRequest } from "../../middleware/validateRequest";
import { CampaignValidation } from "./campaign.validation";
import { multerUpload } from "../../../config/multer.config";

const router = Router();

router.post('/create', 
  checkAuthMiddleware(Role.SUPER_ADMIN, Role.ADMIN), 
  multerUpload.single("file"),
  validateRequest(CampaignValidation.createCampaignZodValidation), 
  CampaignController.createCampaign);
router.get("/all", CampaignController.getCampaigns);
router.get("/all/:id", CampaignController.getCampaignById);
router.patch(
  "/update/:id",
  checkAuthMiddleware(Role.SUPER_ADMIN, Role.ADMIN),
  multerUpload.single("file"),
  validateRequest(CampaignValidation.updateCampaignZodValidation),
  CampaignController.updateCampaign
);
router.delete("/:id", checkAuthMiddleware(Role.SUPER_ADMIN, Role.ADMIN), CampaignController.deleteCampaign);

export const CampaignRoutes = router;