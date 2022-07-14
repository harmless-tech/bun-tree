import { Hono } from "hono";
import { logger } from "hono/logger";
import redirect from "./redirect/redirect";
import tree from "./tree/tree";
import { Store } from "./database";

const app = new Hono();
const port = process.env.PORT || 3000;

const LICENSE_FILE = await Bun.file("LICENSE").text();

// DB Init
Store.init();
Store.run("INSERT INTO foo (info) VALUES ($info)", {
    $info: "This is info, yep!",
});

// Home
app.use('*', logger());
app.get("/", (c) => c.json({
    name: "Bun Tree",
    id: "bun-tree",
    version: "0.0.1",
    author: "harmless-tech",
    license: `https://${c.req.headers.get("host")}/license`,
    git: "https://github.com/harmless-tech/bun-tree",
    issues: "https://github.com/harmless-tech/bun-tree/issues"
}));
app.get("license", (c) => c.text(LICENSE_FILE));
app.notFound((c) => c.text("Not Found", 404))

// Routes
app.route("/tree", tree);
app.route("/", redirect);

// Start
console.log(`Running at http://localhost:${port}`);
export default {
    port: process.env.PORT || 3000,
    fetch: app.fetch,
};
