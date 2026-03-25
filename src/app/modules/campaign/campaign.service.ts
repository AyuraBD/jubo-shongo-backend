import { prisma } from "../../lib/prisma"
import { ICreateCampaign, IUpdateCampaign } from "./campaign.interfaces"

const createCampaign = async(payload:ICreateCampaign)=>{
  const campaign = await prisma.campaign.create({
    data:payload
  });
  return campaign;
}

const getCampaigns = async()=>{
  const campaigns = await prisma.campaign.findMany();
  return campaigns;
}

const getCampaignById = async(id:string)=>{
  const campaign = await prisma.campaign.findUnique({
    where:{
      id
    }
  });
  return campaign;
}

const updateCampaign = async(id:string, payload:IUpdateCampaign)=>{
  const campaign = await prisma.campaign.update({
    where:{
      id
    },
    data:payload
  });
  return campaign;
}

const deleteCampaign = async(id:string)=>{
  const campaign = await prisma.campaign.delete({
    where:{
      id
    }
  });
  return campaign;
}

export const CampaignServices = {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign
}