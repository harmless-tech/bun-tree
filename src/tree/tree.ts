import { Context, Hono, Next } from "hono";

const app = new Hono();

async function authed(c: Context<string, Record<string, any>>, next: Next) {
    //TODO Check if user is logged in.
}

app.use("*", async (c, next) => {
    console.log(c.req.url);
    await next();
    console.log("done next");
});

// Login
app.get("/")

// Display
//TODO This will give a page with redirect links on it.
app.get("/:user", (c) => {
    return c.text("No Build");
});

// Editing
app.get("/:user/edit")

// Stats
app.get("/:user/stats")

export default app;
