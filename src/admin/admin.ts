import { Context, Hono, Next } from "hono";

const app = new Hono();

async function authed(c: Context<string, Record<string, any>>, next: Next) {
    //TODO Check if admin is logged in.
}

// Login
app.get("/login")

// Display
app.get("/panel/:admin", (c) => {
    return c.text("No Build");
});

// API

export default app;
