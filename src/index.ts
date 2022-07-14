import { Hono } from "hono";

const app = new Hono();
const port = process.env.PORT || 3000;

// Home
app.get("/", (c) => c.json({
  name: "Bun Tree",
  id: "bun-tree",
  version: "0.0.1",
  author: "harmless-tech",
  license: "MIT",
  git: "https://github.com/harmless-tech/bun-tree"
}));

console.log(`Running at http://localhost:${port}`);
export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
