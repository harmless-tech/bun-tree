import { Context, Hono, Next } from "hono";
import utils from "../utils";

async function authed(c: Context, next: Next) {
    console.log("middleware");
    c.res = Response.redirect("/admin/login", utils.STATUS_FORBIDDEN);
}

const app = new Hono();

// Login
app.get("/login", (c) => {
    console.log("login");
    return c.text("hwuvbr");
});
app.post("/login", (c) => {
    console.log("login-post");
    return c.text("hwuvbr");
});

app.use("*", authed);

// Logout
//TODO Should clear token.

// Display
app.get("/panel/:admin", (c) => {
    return c.text("No Build");
});

// API

export default app;
