async function createSchema(db) {

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
    // Order Items
    // Supports multiple products in one order
    // ==========================================

    await db.exec(`
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            orderId TEXT NOT NULL,
            productId TEXT NOT NULL,
            productName TEXT NOT NULL,
            weightKg REAL,
            quantity REAL NOT NULL,
            price REAL NOT NULL,
            total REAL NOT NULL,

            FOREIGN KEY (orderId)
                REFERENCES orders(id)
                ON DELETE CASCADE
        );
    `);

// ==========================================
// Add Weight Column To Existing Orders
// ==========================================

try {

    const columns = await db.all(
        `PRAGMA table_info(order_items)`
    );

    const hasWeightColumn = columns.some(
        column => column.name === "weightKg"
    );

    if (!hasWeightColumn) {

        await db.exec(
            `ALTER TABLE order_items
             ADD COLUMN weightKg REAL`
        );

        console.log(
            "✅ Added weightKg column to order_items"
        );

    }

}
catch (err) {

    console.error(
        "❌ Failed to add weightKg column:",
        err
    );

}
    // ==========================================
    // Settings
    // ==========================================

    await db.exec(`
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        );
    `);

    // ==========================================
    // Users
    // ==========================================

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'Admin',
            status TEXT DEFAULT 'Active',
            createdAt TEXT
        );
    `);

}

module.exports = {
    createSchema
};