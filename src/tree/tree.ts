import { Hono } from "hono";

const app = new Hono();

//TODO This will give a page with redirect links on it.
app.get("/", (c) => {
    return c.text("No Build");
});

export default app;
