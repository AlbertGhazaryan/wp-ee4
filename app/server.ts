import express from "express";
import { createRequestHandler } from "@react-router/express";
import path from "path";

const app = express();

// 🚨 Render provides PORT dynamically
const port = process.env.PORT || 3000;

// Serve static build assets
app.use(
  "/assets",
  express.static(path.join(process.cwd(), "build/client/assets"))
);

// React Router handler (your built app)
app.all(
  "*",
  createRequestHandler({
    build: await import("./build/server/index.js"),
  })
);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});