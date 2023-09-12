import { useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [response, setResponse] = useState<Record<string, unknown> | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const makeRequest = async () => {
    setIsLoading(true);
    const res = await fetch("/api/user", {
      cache: "no-cache",
    });

    setResponse({
      status: res.status,
      body: await res.json(),
      limit: res.headers.get("X-RateLimit-Limit"),
      remaining: res.headers.get("X-RateLimit-Remaining"),
    });
    setIsLoading(false);
  };

  return (
    <main
      className={`${inter.className} py-16 px-8 max-w-3xl mx-auto text-lg flex flex-col gap-6`}
    >
      <h1 className="text-2xl font-bold">Next.js API Routes Rate Limiting</h1>
      <p>
        This example uses{" "}
        <code className="text-purple-600 whitespace-pre-wrap">lru-cache</code>{" "}
        to implement a simple rate limiter for API routes (Serverless
        Functions).
      </p>
      <div className="w-full">
        <button
          disabled={isLoading}
          onClick={() => makeRequest()}
          className={`rounded-lg px-4 py-2 text-white ${
            isLoading ? "bg-zinc-700" : "bg-zinc-950"
          }`}
        >
          {isLoading ? (
            <div className="inline-flex items-center gap-4">
              <span className="h-4 w-4">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  height="100%"
                  width="100%"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z">
                    <animateTransform
                      attributeName="transform"
                      attributeType="XML"
                      type="rotate"
                      dur="1s"
                      from="0 12 12"
                      to="360 12 12"
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>
              </span>
              <span>Sending</span>
            </div>
          ) : (
            "Make Request"
          )}
        </button>
      </div>
      {response && (
        <code className="block rounded-lg overflow-x-scroll p-4 w-full text-white bg-zinc-950">
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </code>
      )}
    </main>
  );
}
