import { Router } from "express";
import { simulate } from "../controllers/simulateController";

export const simulateRouter = Router();
simulateRouter.post("/simulate", simulate);
