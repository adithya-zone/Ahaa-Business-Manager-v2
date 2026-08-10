const fs = require("fs");
const path = require("path");

const { initializeDatabase } = require("../src/config/database");

const productsPath = path.join(__dirname, "../data/products.json");
const customersPath = path.join(__dirname, "../data/customers.json");
const ordersPath = path.join(__dirname, "../data/orders.json");

function readJson(file) {

    if (!fs.existsSync(file)) {

        return [];

    }

    return JSON.parse(

        fs.readFileSync(file, "utf8")

    );

}

async function migrateProducts(db) {

    const products = readJson(productsPath);

    console.log(`\nMigrating ${products.length} Products...`);

    for (const product of products) {

        const exists = await db.get(

            "SELECT id FROM products WHERE id=?",

            [product.id]

        );

        if (exists) {

            continue;

        }

        await db.run(

            `INSERT INTO products
            (
                id,
                name,
                category,
                price,
                stock,
                status,
                createdAt
            )
            VALUES
            (?, ?, ?, ?, ?, ?, ?)`,

            [

                product.id,

                product.name,

                product.category,

                product.price,

                product.stock,

                product.status || "Active",

                product.createdAt

            ]

        );

    }

    console.log("✅ Products migrated");

}

async function migrateCustomers(db) {

    const customers = readJson(customersPath);

    console.log(`\nMigrating ${customers.length} Customers...`);

    for (const customer of customers) {

        const exists = await db.get(

            "SELECT id FROM customers WHERE id=?",

            [customer.id]

        );

        if (exists) {

            continue;

        }

        await db.run(

            `INSERT INTO customers
            (
                id,
                name,
                phone,
                email,
                city,
                address,
                status,
                createdAt
            )
            VALUES
            (?, ?, ?, ?, ?, ?, ?, ?)`,

            [

                customer.id,

                customer.name,

                customer.phone,

                customer.email,

                customer.city,

                customer.address,

                customer.status || "Active",

                customer.createdAt

            ]

        );

    }

    console.log("✅ Customers migrated");

}

async function migrateOrders(db) {

    const orders = readJson(ordersPath);

    console.log(`\nMigrating ${orders.length} Orders...`);

    for (const order of orders) {

        const exists = await db.get(

            "SELECT id FROM orders WHERE id=?",

            [order.id]

        );

        if (exists) {

            continue;

        }

        await db.run(

            `INSERT INTO orders
            (
                id,
                customer,
                productId,
                productName,
                quantity,
                total,
                status,
                paymentMethod,
                createdAt
            )
            VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?)`,

            [

                order.id,

                order.customer,

                order.productId,

                order.productName,

                order.quantity,

                order.total,

                order.status,

                order.paymentMethod || "Cash",

                order.createdAt

            ]

        );

    }

    console.log("✅ Orders migrated");

}

async function migrate() {

    try {

        const db = await initializeDatabase();

        console.log("");

        console.log("====================================");

        console.log("Starting JSON → SQLite Migration");

        console.log("====================================");

        await migrateProducts(db);

        await migrateCustomers(db);

        await migrateOrders(db);

        console.log("");

        console.log("====================================");

        console.log("🎉 Migration Completed Successfully");

        console.log("====================================");

        process.exit(0);

    }

    catch (err) {

        console.error(err);

        process.exit(1);

    }

}

migrate();