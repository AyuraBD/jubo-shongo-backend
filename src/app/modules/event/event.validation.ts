import { z } from "zod";
import { EventStatus, EventType } from "../../../generated/prisma";

const createEventZodValidation = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(150),

  description: z
    .string()
    .optional(),

  type: z.nativeEnum(EventType),

  status: z
    .nativeEnum(EventStatus)
    .optional(),

  coverImage: z
    .string()
    .optional(),

  location: z
    .string()
    .optional(),

  startDate: z
    .string()
    .datetime(),

  endDate: z
    .string()
    .datetime()
    .optional(),

  maxAttendees: z
    .number()
    .int("Must be an integer")
    .positive("Must be greater than 0")
    .optional()
})
.refine(
  (data) => {
    if (data.endDate) {
      return new Date(data.startDate) < new Date(data.endDate);
    }
    return true;
  },
  {
    message: "End date must be after start date",
    path: ["endDate"]
  }
);

const updateEventZodValidation = z.object({
  title: z
    .string()
    .min(3)
    .max(150)
    .optional(),

  description: z
    .string()
    .optional(),

  type: z
    .nativeEnum(EventType)
    .optional(),

  status: z
    .nativeEnum(EventStatus)
    .optional(),

  coverImage: z
    .string()
    .url()
    .optional(),

  location: z
    .string()
    .optional(),

  startDate: z
    .string()
    .datetime()
    .optional(),

  endDate: z
    .string()
    .datetime()
    .optional(),

  maxAttendees: z
    .number()
    .int()
    .positive()
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
)

export const EventValidation = {
  createEventZodValidation,
  updateEventZodValidation
}