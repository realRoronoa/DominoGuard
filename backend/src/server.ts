import "dotenv/config";
import express from "express";
import cors from "cors";
import { simulateRouter } from "./routes/simulateRoute";
import { modelId, useBedrock } from "./config/aws";

const app = express();
const port = Number(process.env.PORT || 4000);

// Comma-separated exact origins, e.g. "https://main.d123.amplifyapp.com".
// Unset keeps the permissive default that local development and the hackathon
// demo rely on; set it in production so the API is not callable from any page.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.set("trust proxy", 1); // App Runner / Amplify sit behind a proxy; needed for req.ip.

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    methods: ["GET", "POST"],
  })
);
app.use(express.json({ limit: "64kb" }));

app.get("/health", (_req, res) =>
  res.json({
    ok: true,
    service: "dominoguard-backend",
    bedrockEnabled: useBedrock,
    modelId,
  })
);

app.use("/api/v1", simulateRouter);

app.use((_req, res) => res.status(404).json({ error: "Not found." }));

// Express only treats a 4-arg function as the error handler; `next` must stay.
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // A malformed JSON body surfaces here rather than in the controller.
  if (err && typeof err === "object" && "type" in err && err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Request body must be valid JSON." });
  }
  console.error("[server] unhandled error:", err);
  res.status(500).json({ error: "Something went wrong." });
});

app.listen(port, "0.0.0.0", () => {
  console.log(
    `DominoGuard API listening on port ${port} | bedrock=${useBedrock ? modelId : "disabled"} | ` +
      `cors=${allowedOrigins.length ? allowedOrigins.join(",") : "any origin"}`
  );
});
