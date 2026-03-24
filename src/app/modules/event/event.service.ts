/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from "../../lib/prisma";

const createEvent = async(payload:any)=>{
  const result = await prisma.event.create({
    data:{
      title: payload.title,
      type: payload.type,
      startDate: payload.startDate
    }
  });
  return result
}

export const EventService = {
  createEvent,
}