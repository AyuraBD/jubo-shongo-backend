import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { CampaignServices } from "./campaign.service";
import { sendResponse } from "../../shared/sendResponse";

const createCampaign = catchAsync(
  async(req: Request, res: Response)=>{
    const payload = req.body;
    const result = await CampaignServices.createCampaign(payload);
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Campaign created successfully.",
      data: result
    });
  }
);

const getCampaigns = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CampaignServices.getCampaigns();
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Campaigns retrieved successfully.",
      data: result
    });
  }
);

const getCampaignById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await CampaignServices.getCampaignById(id as string);

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Campaign retrieved successfully.",
      data: result
    });
  }
);

const updateCampaign = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;

    const result = await CampaignServices.updateCampaign(id as string, payload);

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Campaign updated successfully.",
      data: result
    });
  }
);

const deleteCampaign = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await CampaignServices.deleteCampaign(id as string);

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Campaign deleted successfully.",
      data: result
    });
  }
);

export const CampaignController = {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign
}