import { NextFunction, Request, Response } from "express";
import * as z from "zod";

export const validateRequest = (zodSchema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if(req.body.data){
      req.body = JSON.parse(req.body.data);
    }
    const validationResult = zodSchema.safeParse(req.body);
    if (!validationResult.success) {
      next(validationResult.error);
      return;
    }
    req.body = validationResult.data;
    next();
  }
}