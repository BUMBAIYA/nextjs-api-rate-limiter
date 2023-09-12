import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import rateLimit from "@/utils/rateLimit";

const DEFAULT_TOKEN = "DEFAULT_TOKEN" as const;

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await limiter.check(res, 10, DEFAULT_TOKEN); // 10 requests per minute
    res.status(200).json({ id: uuidv4() });
  } catch {
    res.status(429).json({ error: "Rate limit exceeded" });
  }
}
