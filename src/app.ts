import express, { Application, Request, Response } from "express";
import { IndexRoutes } from "./app/routes";
import path from "path";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import cors from "cors";
import { EnvVars } from "./config/env";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";

const app : Application = express()

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`));

app.use('/api/auth', toNodeHandler(auth));

app.use(cors({
  origin: [EnvVars.FRONTEND_URL, EnvVars.BETTER_AUTH_URL, "http://localhost:5000", "http://localhost:5000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-type", "Authorization"]
}));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.use('/api/v1', IndexRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;