import { Database, SQLQueryBindings, Statement } from "bun:sqlite";
import { Cache } from "./cache";

function createTableQuery(table: string, cols: string): string {
    return `CREATE TABLE IF NOT EXISTS ${table} (${cols})`;
}

abstract class Store {
    private static readonly db = new Database("bt-data.sqlite", { readwrite: true, create: true });

    public static run(query: string, bindings?: SQLQueryBindings): void {
        if(bindings)
            this.db.run(query, bindings);
        else
            this.db.run(query);
    }

    public static query(query: string): Statement {
        return this.db.query(query);
    }

    public static close(): void {
        this.db.close();
    }
}

//TODO Stats should only be inserted every few seconds.
export abstract class RedirectStore {
    private static readonly TABLE_REDIRECTS = "t_redirects";
    private static readonly TABLE_STATS = "t_redirects_stats";
    private static readonly TABLE_PERM_STATS = "t_perm_redirects_stats";

    private static statCmdQueue: string[] = []; //TODO Should this move to a better system where a reduced amount of calls are needed?

    public static init() {
        Store.run(createTableQuery(this.TABLE_REDIRECTS, "id INTEGER PRIMARY KEY AUTOINCREMENT, r_key CHARACTER(25) UNIQUE NOT NULL, url CHARACTER(512) NOT NULL"));
        Store.run(createTableQuery(this.TABLE_STATS, "id INTEGER PRIMARY KEY, r_amount INTEGER"));
        Store.run(createTableQuery(this.TABLE_PERM_STATS, "id INTEGER PRIMARY KEY AUTOINCREMENT, r_key TEXT UNIQUE NOT NULL, r_amount INTEGER"));

        // Stats are not pushed live. (Pushed every 30 secs)
        setInterval(() => {
            let q;
            while(q = this.statCmdQueue.pop())
                Store.run(q);
        }, 30_000);
    }

    public static incrementPermRedirect(id: string) {
        this.statCmdQueue.push(`INSERT OR IGNORE INTO ${this.TABLE_PERM_STATS} (r_key, r_amount) VALUES ('${id}', 1)`)
        this.statCmdQueue.push(`UPDATE ${this.TABLE_PERM_STATS} SET r_amount=r_amount + 1 WHERE r_key='${id}'`)
    }
}

export abstract class TreeStore {
    private static readonly TABLE_TREE_USERS = "tree_users";
    private static readonly TABLE_TREE = "tree";
    private static readonly TABLE_STATS = "tree_stats";
    private static readonly TABLE_TOKENS = "tree_tokens";

    public static init() {
        Store.run(createTableQuery(this.TABLE_TREE_USERS, "id INTEGER PRIMARY KEY AUTOINCREMENT, user CHARACTER(50) UNIQUE NOT NULL, hashed_password CHARACTER(1024), salt TEXT"));
        Store.run(createTableQuery(this.TABLE_TREE, "id INTEGER PRIMARY KEY, tree_data TEXT, custom_icon_url CHARACTER(512), custom_css TEXT"));
        Store.run(createTableQuery(this.TABLE_STATS, "id INTEGER PRIMARY KEY, service CHARACTER(50) NOT NULL, r_amount INTEGER"));
        Store.run(createTableQuery(this.TABLE_TOKENS, "id INTEGER PRIMARY KEY, token TEXT UNIQUE NOT NULL, expiry TEXT NOT NULL"));
    }
}

export const ADMIN_TOKEN = "ADMIN_TOKEN";
export abstract class AdminStore {
    // private static readonly TABLE_ADMIN = "admin_users"; // Not needed only one admin currently.
    private static readonly TABLE_TOKENS = "admin_tokens";

    private static readonly TOKEN_QUERY = Store.query(`SELECT * FROM ${this.TABLE_TOKENS} WHERE token = ?`);
    private static readonly TOKEN_DELETE_QUERY = Store.query(`DELETE FROM ${this.TABLE_TOKENS} WHERE token = ?`);

    public static init() {
        // Store.run(createTableQuery(this.TABLE_ADMIN, "id INTEGER PRIMARY KEY AUTOINCREMENT, admin CHARACTER(50) UNIQUE NOT NULL, hashed_password CHARACTER(1024) NOT NULL, salt TEXT NOT NULL"));
        Store.run(createTableQuery(this.TABLE_TOKENS, "id INTEGER PRIMARY KEY AUTOINCREMENT, token TEXT UNIQUE NOT NULL, expiry TEXT NOT NULL"));
    }

    public static isAdmin(token: string): boolean {
        if(token.length < 1024) {
            const cached = Cache.get(ADMIN_TOKEN);
            if(cached)
                return token === cached;
            else {
                let result = this.TOKEN_QUERY.get(token);
                if(result) {
                    if(Date.now() < new Date(result.expiry).getUTCMilliseconds()) {
                        Cache.set(ADMIN_TOKEN, result.token);
                        return true;
                    }
                    else {
                        this.TOKEN_DELETE_QUERY.run(token);
                        Cache.delete(ADMIN_TOKEN);
                    }
                }
            }
        }
        return false;
    }

    public static removeAdminToken(token: string): void {
        if(token.length < 1024) {
            let result = this.TOKEN_QUERY.get(token);
            if(result) {
                Cache.delete(ADMIN_TOKEN);
                this.TOKEN_DELETE_QUERY.run(token);
            }
        }
    }
}
