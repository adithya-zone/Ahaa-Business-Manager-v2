const express = require("express");
const cors = require("cors");
const path = require("path");

const dashboardRoutes = require("./src/routes/dashboardRoutes");
const productRoutes = require("./src/routes/productRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const customerRoutes = require("./src/routes/customerRoutes");
const settingsRoutes = require("./src/routes/settingsRoutes");
const invoiceRoutes = require("./src/routes/invoiceRoutes");
const reportRoutes = require("./src/routes/reportRoutes");

const app = express();

// ======================================
// Middleware
// ======================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ======================================
// Static Files
// ======================================

app.use(express.static(path.join(__dirname, "public")));

// ======================================
// API Routes
// ======================================

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/customers", customerRoutes);

app.use("/api/settings", settingsRoutes);

app.use("/api/invoice", invoiceRoutes);

app.use("/api/reports", reportRoutes);

// ======================================
// Default Route
// ======================================

app.get("/", (req, res) => {

    res.sendFile(

        path.join(__dirname, "public", "index.html")

    );

});

// ======================================
// Export
// ======================================

module.exports = app;