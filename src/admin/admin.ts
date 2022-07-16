import { Context, Hono, Next } from "hono";
import utils from "../utils";
import { html } from "hono/dist/middleware/html";
import { ADMIN_TOKEN } from "../database";

async function authed(c: Context, next: Next) {
    console.log("admin user middleware");
    c.res = Response.redirect("/admin/login", utils.STATUS_FORBIDDEN);
}

const app = new Hono();

// Login
app.get("/login", (c) => {
    if(c.req.cookie("ADMIN_TOKEN")) {
        return c.html(html`<!DOCTYPE html>
        <html lang="en">
            <head>
                <title>Admin</title>
            </head>
            <body>
                <h1>Logged in:</h1>
                <ul>
                    <li><a href="panel">Admin Panel</a></li>
                    <li><form action="logout" method="post"><a href="#" onclick="this.parentNode.submit()">Logout</a></form></li>
                </ul>
            </body>
        </html>
        `);
    }

    return c.html(html`<!DOCTYPE html>
    <html lang="en">
        <head>
            <title>Admin Login</title>
            <script>
                let params = new URLSearchParams(window.location.search);
                if(params.get("error") === "") {
                    window.addEventListener("load", () => document.getElementById("login-error").style.display = "block");
                }
            </script>
        </head>
        <body>
            <div id="login-error" style="color: red; display: none">
                <h1>Login Error</h1>
            </div>
            <form action="login" method="post">
                <input type="text" placeholder="Username:" name="username" required>
                <input type="password" placeholder="Password:" name="password" required>
                <button type="submit">Login</button>
            </form>
        </body>
    </html>
    `);
});
app.post("/login", async(c) => {
    const f = await c.req.text();
    const sp = f.split("&");
    if(sp.length == 2) {
    }

    return c.redirect("/admin/login\?error");
});
app.post("/logout", (c) => {
    c.cookie(ADMIN_TOKEN, undefined, {
        path: "*",
        expires: new Date(0)
    });
    return c.redirect("/admin/login");
});

app.use("*", authed);

// Logout
//TODO Should clear token.

// Display
app.get("/panel", (c) => {
    return c.text("No Build");
});

// API

export default app;
