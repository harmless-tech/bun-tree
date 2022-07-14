import { Hono } from "hono";
import { Cache } from "../cache";

const RULES = {
    maxLength: 20
};

const app = new Hono();

app.get("/:id", (c) => {
    const { id } = c.req.param();
    if(id.length > RULES.maxLength)
        return c.text("Improper Redirect Link", 400);

    const cached = Cache.get(id);
    if(cached)
        return c.redirect(cached, 302);
    else {
        //TODO Search perm redirects. Search db.
    }

    return c.text("No Redirect Found", 404);
});

export default app;
