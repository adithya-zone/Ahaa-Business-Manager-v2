const express = require("express");
const cors = require("cors");
const path = require("path");

const dashboardRoutes = require("./src/routes/dashboardRoutes");
const productRoutes = require("./src/routes/productRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const customerRoutes = require("./src/routes/customerRoutes");
const invoiceRoutes = require("./src/routes/invoiceRoutes");

const app = express();

// ==========================================
// Middleware
// ==========================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ==========================================
// Static Files
// ==========================================

app.use(express.static(path.join(__dirname, "public")));

// ==========================================
// API Routes
// ==========================================

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/customers", customerRoutes);

app.use("/api/invoice", invoiceRoutes);

// ==========================================
// Health Check
// ==========================================

app.get("/api/health", (req, res) => {

    res.json({

        success: true,

        message: "Ahaa Business Manager ERP v2 is running.",

        database: "SQLite"

    });

});

// ==========================================
// Home
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(

        path.join(

            __dirname,

            "public",

            "index.html"

        )

    );

});

// ==========================================
// 404 Handler
// ==========================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "Route not found."

    });

});

module.exports = app;