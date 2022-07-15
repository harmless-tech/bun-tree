import { Hono } from "hono";
import { Cache } from "../cache";
import permRedirects from "./perm-redirects";
import utils from "../utils";
import { RedirectStore } from "../database";

const RULES = {
    defaultSize: 6,
    maxLength: 20,
};

//TODO Generates a redirect with provided name and url.
function genRedirect(name: string, url: string): boolean {
    return false;
}

//TODO Generate a random combo of chars and numbers, then assign url.
function genRandRedirect(size: number = RULES.defaultSize, url: string): void {
}

const app = new Hono();

app.get("/:id", (c) => {
    const { id } = c.req.param();
    if(id.length > RULES.maxLength)
        return c.text("Improper Redirect Link", utils.STATUS_BAD_REQUEST);

    // Check if there is a perm redirect that matches.
    if(permRedirects.has(id)) {
        RedirectStore.incrementPermRedirect(id);
        return c.redirect(permRedirects.get(id), utils.STATUS_FOUND);
    }

    const cached = Cache.get(id);
    if(cached)
        return c.redirect(cached);
    else {
        //TODO Search perm redirects. Search db.
    }

    return c.text("No Redirect Found", utils.STATUS_NOT_FOUND);
});

export default app;
