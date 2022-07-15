import { Hono } from "hono";
import { logger } from "hono/logger";
import redirect from "./redirect/redirect";
import tree from "./tree/tree";
import { AdminStore, RedirectStore, TreeStore } from "./database";
import admin from "./admin/admin";

const app = new Hono();
const port = process.env.PORT || 3000;

const LICENSE_FILE = await Bun.file("LICENSE").text();

// DB Init
AdminStore.init();
TreeStore.init();
RedirectStore.init();

// Home
app.use('*', logger());
app.get("/", (c) => c.json({
    name: "Bun Tree",
    id: "bun-tree",
    version: "0.0.1",
    desc: "Bun tree is a basic redirect server with redirect tree support. Built using Bun and Hono.",
    author: "harmless-tech",
    license: `${c.req.url}license`,
    git: "https://github.com/harmless-tech/bun-tree",
    issues: "https://github.com/harmless-tech/bun-tree/issues"
}));
app.get("license", (c) => c.text(LICENSE_FILE));
app.notFound((c) => c.text("Not Found", 404))

// Routes
app.route("/admin", admin);
app.route("/tree", tree);
app.route("/", redirect);

// Start
console.log(`Running at http://localhost:${port}`);
export default {
    port: process.env.PORT || 3000,
    fetch: app.fetch,
};
