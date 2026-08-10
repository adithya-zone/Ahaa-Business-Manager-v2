const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const path = require("path");
const fs = require("fs");

let db = null;

async function initializeDatabase() {

    if (db) {
        return db;
    }

    try {

        const dbFolder = path.join(__dirname, "../../database");

        // Create database folder if it doesn't exist
        if (!fs.existsSync(dbFolder)) {
            fs.mkdirSync(dbFolder, { recursive: true });
            console.log("📁 Database folder created");
        }

        const dbPath = path.join(dbFolder, "ahaa.db");

        console.log("📂 Database Path:", dbPath);

        db = await open({

            filename: dbPath,

            driver: sqlite3.Database

        });

        console.log("✅ SQLite Connected");

        await db.exec("PRAGMA foreign_keys = ON;");

        // ==========================================
        // Products
        // ==========================================

        await db.exec(`
            CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                category TEXT,
                price REAL,
                stock INTEGER DEFAULT 0,
                status TEXT DEFAULT 'Active',
                createdAt TEXT
            );
        `);

        // ==========================================
        // Customers
        // ==========================================

        await db.exec(`
            CREATE TABLE IF NOT EXISTS customers (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                phone TEXT,
                email TEXT,
                city TEXT,
                address TEXT,
                status TEXT DEFAULT 'Active',
                createdAt TEXT
            );
        `);

        // ==========================================
        // Orders
        // ==========================================

        await db.exec(`
            CREATE TABLE IF NOT EXISTS orders (
                id TEXT PRIMARY KEY,
                customer TEXT,
                productId TEXT,
                productName TEXT,
                quantity INTEGER,
                total REAL,
                status TEXT,
                paymentMethod TEXT DEFAULT 'Cash',
                createdAt TEXT
            );
        `);

        // ==========================================
        // Settings
        // ==========================================

        await db.exec(`
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT
            );
        `);

        console.log("✅ Tables Created");
        console.log("🎉 Database Ready");

        return db;

    } catch (err) {

        console.error("❌ DATABASE ERROR");
        console.error(err);

        throw err;

    }

}

async function getDatabase() {

    if (!db) {

        await initializeDatabase();

    }

    return db;

}

module.exports = {

    initializeDatabase,

    getDatabase

};