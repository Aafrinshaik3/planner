import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { publicPlatformScript } from "./publicConfig";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/api/platform/config.js", (_req, res) => {
    res.set("Cache-Control", "no-store").type("application/javascript").send(publicPlatformScript());
  });
  app.post("/api/ideas", async (req, res) => {
    const { title, type, date, location, guests, budget, theme, preferences, prompt } = req.body ?? {};
    const fallback = [
      {
        title: "A welcome ritual with a local touch",
        description: `Open ${title || "the event"} with a small shared gesture: a seasonal bite, a neighborhood story, or one song everyone can add to.`,
        tag: "Guest experience",
        why: `It creates a point of view without asking the ${budget ? `$${Number(budget).toLocaleString()}` : "event"} budget to do more.`,
        effort: "Low lift",
      },
      {
        title: "One beautiful thing, done well",
        description: `Choose a single visual anchor for ${theme || "the celebration"}: a flower cloud, a painted menu, or a room-sized ribbon moment.`,
        tag: "Design",
        why: "A focused visual cue makes the room feel intentional while keeping the rest simple.",
        effort: "Medium lift",
      },
      {
        title: "The 15-minute neighborhood moment",
        description: `Invite a maker, musician, or storyteller to share one short, memorable moment for ${guests || "your guests"} people to gather around.`,
        tag: "Personal touch",
        why: "It gives the event a memorable signature and helps the schedule breathe.",
        effort: "Medium lift",
      },
    ];

    const apiUrl = process.env.MANUS_API_URL;
    const apiKey = process.env.MANUS_API_KEY;
    if (!apiUrl || !apiKey) return res.json({ ideas: fallback, source: "fallback" });

    try {
      const response = await fetch(`${apiUrl}/v1/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a thoughtful event planner. Return exactly 3 JSON objects in an array called ideas. Each object must have title, description, tag, why, and effort. Keep ideas practical, vivid, and matched to the budget. No markdown." },
            { role: "user", content: JSON.stringify({ title, type, date, location, guests, budget, theme, preferences, prompt }) },
          ],
          response_format: { type: "json_object" },
        }),
      });
      if (!response.ok) throw new Error(`LLM request failed with ${response.status}`);
      const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
      const content = payload.choices?.[0]?.message?.content;
      if (!content) throw new Error("LLM returned no content");
      const parsed = JSON.parse(content) as { ideas?: unknown };
      if (!Array.isArray(parsed.ideas) || parsed.ideas.length < 3) throw new Error("LLM returned an invalid shape");
      return res.json({ ideas: parsed.ideas.slice(0, 3), source: "managed-llm" });
    } catch (error) {
      console.warn("[Ideas] Falling back to local recommendations:", error);
      return res.json({ ideas: fallback, source: "fallback" });
    }
  });
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = Number(process.env.PORT || "3000");
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid PORT");
  server.on("error", error => { console.error("Server failed:", error.message); process.exit(1); });
  server.listen(port, "0.0.0.0", () => console.log(`Server listening on port ${port}`));
}

startServer().catch(error => { console.error(error); process.exit(1); });
