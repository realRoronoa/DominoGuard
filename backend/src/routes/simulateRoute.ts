import { Router } from "express";
import { simulate } from "../controllers/simulateController";
import { rateLimit } from "../lib/rateLimit";

export const simulateRouter = Router();

// Each call fans out to paid Bedrock invocations and a third-party lookup.
simulateRouter.post(
  "/simulate",
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
    max: Number(process.env.RATE_LIMIT_MAX || 20),
  }),
  simulate
);
