import { CampaignCategory, CampaignStatus } from "../../../generated/prisma";

export interface ICreateCampaign {
  title: string;
  description: string;
  longBody?: string;

  category: CampaignCategory;
  status?: CampaignStatus;

  goalAmount: number;

  coverImage?: string;

  isUrgent?: boolean;
  isFeatured?: boolean;

  startDate?: Date;
  endDate?: Date;
}

export interface IUpdateCampaign {
  title?: string;
  description?: string;
  longBody?: string;

  category?: CampaignCategory;
  status?: CampaignStatus;

  goalAmount?: number;

  coverImage?: string;

  isUrgent?: boolean;
  isFeatured?: boolean;

  startDate?: Date;
  endDate?: Date;
}