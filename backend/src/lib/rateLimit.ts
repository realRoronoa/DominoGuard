import { NextFunction, Request, Response } from "express";

interface Bucket {
  count: number;
  resetAt: number;
}

/**
 * Small in-memory fixed-window limiter. `/simulate` fans out to paid Bedrock
 * calls and a third-party OSINT API, so an unthrottled public endpoint is a
 * direct cost- and abuse-exposure. Per-instance state is sufficient for the
 * MVP's single App Runner container; move to a shared store if scaled out.
 */
export function rateLimit(options: { windowMs: number; max: number }) {
  const buckets = new Map<string, Bucket>();

  // Bound memory growth: drop expired buckets on a slow sweep.
  const sweep = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }, options.windowMs);
  sweep.unref?.();

  return function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + options.windowMs });
      return next();
    }

    bucket.count += 1;
    if (bucket.count > options.max) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfter));
      return res.status(429).json({
        error: `Too many simulations. Try again in ${retryAfter}s.`,
      });
    }

    next();
  };
}
