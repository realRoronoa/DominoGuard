import "dotenv/config";
import express from "express";
import cors from "cors";
import { simulateRouter } from "./routes/simulateRoute";

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors({ origin: true }));
app.use(express.json({ limit: "64kb" }));

app.get("/health", (_req, res) => res.json({ ok: true, service: "dominoguard-backend" }));
app.use("/api/v1", simulateRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(400).json({ error: "Simulation request failed." });
});

app.listen(port, () => {
  console.log(`DominoGuard API listening on http://localhost:${port}`);
});
