import type { NextApiRequest, NextApiResponse } from "next";
import { LRUCache } from "lru-cache";

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
  getUserId: (req: NextApiRequest, res: NextApiResponse) => string;
};

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  return {
    check: (res: NextApiResponse, req: NextApiRequest, limit: number) => {
      return new Promise<{ status: number; message: string }>(
        async (resolve, reject) => {
          try {
            const userId = options?.getUserId(req, res);
            if (!userId) {
              reject({ status: 400, message: "Token missing" });
              return;
            }
            const token = `user:${userId}`;
            const tokenCount = (tokenCache.get(token) as number[]) || [0];
            if (tokenCount[0] === 0) {
              tokenCache.set(token, tokenCount);
            }
            tokenCount[0] += 1;

            const currentUsage = tokenCount[0];
            const isRateLimited = currentUsage >= limit;
            res.setHeader("X-RateLimit-Limit", limit);
            res.setHeader(
              "X-RateLimit-Remaining",
              isRateLimited ? 0 : limit - currentUsage
            );

            if (isRateLimited) {
              reject({ status: 429, message: "Rate limit exceeded" });
            } else {
              resolve({ status: 200, message: "Success" });
            }
          } catch {
            reject({ status: 500, message: "Internal server error" });
          }
        }
      );
    },
  };
}
