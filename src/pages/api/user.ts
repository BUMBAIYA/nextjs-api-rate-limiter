import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import rateLimit from "@/utils/rateLimit";

const REQUEST_PER_HOUR = 5 as const;
const RATELIMIT_DURATION = 3600000 as const;
const MAX_USER_PER_SECOND = 100 as const;

const limiter = rateLimit({
  interval: RATELIMIT_DURATION,
  uniqueTokenPerInterval: MAX_USER_PER_SECOND,
  getUserId: (req: NextApiRequest, res: NextApiResponse) => {
    let userUuidToken = req.cookies.userUuid;
    if (!userUuidToken) {
      userUuidToken = uuidv4();
      res.setHeader(
        "Set-Cookie",
        `userUuid=${userUuidToken}; Max-Age=${60 * 60 * 24}; SameSite=Strict`
      );
    }
    return userUuidToken;
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await limiter.check(res, req, REQUEST_PER_HOUR);
    res
      .status(data.status)
      .json({ status: data.status, message: data.message });
  } catch (error: any) {
    if (error?.status === 429) {
      res.status(429).json({ status: 429, message: "Rate limit exceeded" });
    } else {
      res.status(500).json({ status: 500, message: error });
    }
  }
}
