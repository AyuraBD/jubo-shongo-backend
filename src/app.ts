import express, { Application, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";

const app : Application = express()

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

app.post('/', async (req: Request, res: Response)=>{
  const result = await prisma.event.create({
    data:{
      title: "Football tournament",
      startDate: "2026-03-24T00:00:00Z",
      type: "SPORTS_TOURNAMENT"
    }
  });
  res.status(200).json({
    success: true,
    message:"API is working",
    data: result
  })
  res.send('Hello, TypeScript + Express!');
})

export default app;