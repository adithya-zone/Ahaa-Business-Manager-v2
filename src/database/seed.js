const bcrypt = require("bcrypt");

// ==========================================
// Seed Database
// ==========================================

async function seedDatabase(db) {

    const username =
        process.env.ADMIN_USERNAME || "admin";

    const password =
        process.env.ADMIN_PASSWORD;

    if (!password) {

        throw new Error(
            "ADMIN_PASSWORD is not configured in .env"
        );

    }

    // ==========================================
    // Check Existing Admin
    // ==========================================

    const existingUser = await db.get(

        "SELECT * FROM users WHERE username = ?",

        [username]

    );

    if (existingUser) {

        return;

    }

    // ==========================================
    // Hash Password
    // ==========================================

    const hashedPassword = await bcrypt.hash(

        password,

        12

    );

    // ==========================================
    // Create Admin
    // ==========================================

    await db.run(

        `
        INSERT INTO users
        (
            id,
            username,
            password,
            role,
            status,
            createdAt
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        )
        `,

        [

            "USR-000001",

            username,

            hashedPassword,

            "Admin",

            "Active",

            new Date().toISOString()

        ]

    );

    console.log("✅ Default Admin Created");

}

module.exports = {

    seedDatabase

};