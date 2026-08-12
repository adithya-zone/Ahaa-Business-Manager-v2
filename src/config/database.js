const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const path = require("path");
const fs = require("fs");

const { createSchema } = require("../database/schema");
const { seedDatabase } = require("../database/seed");

let db = null;

// ==========================================
// Database Directory
// ==========================================

function getDatabaseFolder() {

    // If SQLITE_DB_DIR is provided, use it.
    if (process.env.SQLITE_DB_DIR) {

        return process.env.SQLITE_DB_DIR;

    }

    // Production
    if (process.env.NODE_ENV === "production") {

        return "/data";

    }

    // Local development
    return path.join(
        __dirname,
        "../../database"
    );

}


// ==========================================
// Initialize Database
// ==========================================

async function initializeDatabase() {

    if (db) {

        return db;

    }

    try {

        const dbFolder =
            getDatabaseFolder();

        // Create database directory
        // if it doesn't already exist.

        if (!fs.existsSync(dbFolder)) {

            fs.mkdirSync(
                dbFolder,
                {
                    recursive: true
                }
            );

            console.log(
                "📁 Database folder created:",
                dbFolder
            );

        }

        // ==========================================
        // Database File
        // ==========================================

        const dbPath = path.join(
            dbFolder,
            "ahaa.db"
        );

        console.log(
            "📂 Database Path:",
            dbPath
        );

        // ==========================================
        // Connect SQLite
        // ==========================================

        db = await open({

            filename: dbPath,

            driver: sqlite3.Database

        });

        console.log(
            "✅ SQLite Connected"
        );

        // ==========================================
        // Foreign Keys
        // ==========================================

        await db.exec(
            "PRAGMA foreign_keys = ON;"
        );

        // ==========================================
        // Create Schema
        // ==========================================

        await createSchema(db);

        console.log(
            "✅ Tables Created"
        );

        // ==========================================
        // Seed Database
        // ==========================================

        await seedDatabase(db);

        console.log(
            "🎉 Database Ready"
        );

        return db;

    }

    catch (err) {

        console.error(
            "❌ DATABASE ERROR"
        );

        console.error(err);

        throw err;

    }

}


// ==========================================
// Get Database
// ==========================================

async function getDatabase() {

    if (!db) {

        await initializeDatabase();

    }

    return db;

}


// ==========================================
// Export
// ==========================================

module.exports = {

    initializeDatabase,

    getDatabase

};