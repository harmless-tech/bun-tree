import { Database, SQLQueryBindings } from "bun:sqlite";

// function str(inject: string): string {
//     return `SELECT name FROM sqlite_master WHERE type='table' AND name='${inject}'`;
// }

export abstract class Store {
    private static readonly db = new Database("bt-data.sqlite", { readwrite: true, create: true });

    public static init(): void {
        // console.log(str("foo'; INSERT INTO foo (info) VALUES '($info)"));
        // const info = this.db.query(str("foo'; INSERT INTO foo (info) VALUES '($info)"));
        // console.log(info.all());

        // this.db.run("DROP TABLE 'foo'");

        // this.db.run("CREATE TABLE foo (id INTEGER PRIMARY KEY AUTOINCREMENT, info TEXT)");

        this.db.run("CREATE TABLE IF NOT EXISTS foo (id INTEGER PRIMARY KEY AUTOINCREMENT, f_name TEXT, l_name TEXT)");
    }

    public static run(query: string, bindings: SQLQueryBindings): void {
        this.db.run(query, bindings);
    }

    public static close(): void {
        this.db.close();
    }
}
