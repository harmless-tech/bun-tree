import { Hono } from "hono";

const app = new Hono();

app.use("*", async (c, next) => {
    console.log(c.req.url);
    await next();
    console.log("done next");
});

//TODO This will give a page with redirect links on it.
app.get("/", (c) => {
    return c.text("No Build");
});

export default app;
