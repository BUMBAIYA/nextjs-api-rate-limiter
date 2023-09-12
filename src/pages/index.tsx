import { useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [response, setResponse] = useState<Record<string, unknown> | null>(
    null
  );

  const makeRequest = async () => {
    const res = await fetch("/api/user");

    setResponse({
      status: res.status,
      body: await res.json(),
      limit: res.headers.get("X-RateLimit-Limit"),
      remaining: res.headers.get("X-RateLimit-Remaining"),
    });
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
          onClick={() => makeRequest()}
          className="bg-zinc-950 rounded-lg px-4 py-2 text-white"
        >
          Make Request
        </button>
      </div>
      {response && (
        <code className="block rounded-lg p-4 w-full text-white bg-zinc-950">
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </code>
      )}
    </main>
  );
}
