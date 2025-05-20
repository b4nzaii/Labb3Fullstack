import Database from "better-sqlite3"
import path from "path"

const db = new Database(path.join(__dirname, "../tabell.sqlite"));

export default db;