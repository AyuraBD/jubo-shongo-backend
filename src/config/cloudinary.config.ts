import {v2 as cloudinary, UploadApiResponse} from "cloudinary";
import AppError from "../app/errorHelpers/AppError";
import status from "http-status";
import { EnvVars } from "./env";

cloudinary.config({
  cloud_name: EnvVars.CLOUDINARY_CLOUD_NAME,
  api_key: EnvVars.CLOUDINARY_API_KEY,
  api_secret: EnvVars.COUDINARY_API_SECRET
});

export const uploadFileToCloudinary = async(buffer: Buffer, fileName: string): Promise<UploadApiResponse> =>{
  if(!buffer || !fileName){
    throw new AppError(status.BAD_REQUEST, "File buffer and file name are required to upload.")
  }
  const extension = fileName.split(".").pop()?.toLocaleLowerCase();
  const fileNameWithoutExtension = fileName.split(".").slice(0,-1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const uniqueName = Math.random().toString(36).substring(2)+"-"+Date.now()+"-"+fileNameWithoutExtension;
  const folder = extension === "pdf" ? "pdfs" : "images";

  return new Promise((resolve, reject)=>{
    cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        public_id: `jubo-shongo/${folder}/${uniqueName}`,
        folder: `jubo-shongo/${folder}`,
      },
      (error, result)=>{
        if(error){
          return reject(new AppError(status.INTERNAL_SERVER_ERROR, "Failed to upload to cloudinary"))
        }
        resolve(result as UploadApiResponse)
      }
    ).end(buffer)
  })
}

export const deleteFileFromCloudinary = async(url: string)=>{
  try{
    const regex = /upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/;
    const match = url.match(regex);
    if(match && match[1]){
      const publicId = match[1];
      await cloudinary.uploader.destroy(
        publicId,{
          resource_type: "image"
        }
      )
    }
  }catch(error){
    console.error("Error deleting file from cloudinary", error);
    throw new AppError(status.NOT_FOUND, "Internal server error")
  }
}

export const cloudinaryUpload = cloudinary;