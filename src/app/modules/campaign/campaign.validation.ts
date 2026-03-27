import z from "zod";
import { CampaignCategory, CampaignStatus } from "../../../generated/prisma";

const createCampaignZodValidation = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title is too long"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),

  longBody: z
    .string()
    .optional(),

  category: z.nativeEnum(CampaignCategory),

  status: z.nativeEnum(CampaignStatus).optional(),

  goalAmount: z
    .number()
    .positive("Goal amount must be greater than 0"),

  isUrgent: z
    .boolean()
    .optional(),

  isFeatured: z
    .boolean()
    .optional(),

  startDate: z
    .string()
    .datetime()
    .optional(),

  endDate: z
    .string()
    .datetime()
    .optional()
})
.refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) < new Date(data.endDate);
    }
    return true;
  },
  {
    message: "Start date must be before end date",
    path: ["endDate"]
  }
);

const updateCampaignZodValidation = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(150)
    .optional(),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),

  longBody: z
    .string()
    .optional(),

  category: z
    .nativeEnum(CampaignCategory)
    .optional(),

  status: z
    .nativeEnum(CampaignStatus)
    .optional(),

  goalAmount: z
    .number()
    .positive("Goal amount must be greater than 0")
    .optional(),

  coverImage: z
    .string()
    .url("Cover image must be a valid URL")
    .optional(),

  isUrgent: z
    .boolean()
    .optional(),

  isFeatured: z
    .boolean()
    .optional(),

  startDate: z
    .string()
    .datetime()
    .optional(),

  endDate: z
    .string()
    .datetime()
    .optional()
})
.refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) < new Date(data.endDate);
    }
    return true;
  },
  {
    message: "Start date must be before end date",
    path: ["endDate"]
  }
);

export const CampaignValidation = {
  createCampaignZodValidation,
  updateCampaignZodValidation
}