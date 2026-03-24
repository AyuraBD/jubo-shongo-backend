import { Request, Response } from "express";
import { EventService } from "./event.service"
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

const createEvent = catchAsync(
  async(req: Request, res: Response)=>{
    const payload = req.body;
    const result = await EventService.createEvent(payload);
    sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: "Event created successfully.",
      data: result
    })
  }
)

export const EventController = {
  createEvent
}