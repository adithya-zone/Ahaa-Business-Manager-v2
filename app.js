const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);

// ==========================================
// Routes
// ==========================================

const dashboardRoutes = require("./src/routes/dashboardRoutes");
const productRoutes = require("./src/routes/productRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const customerRoutes = require("./src/routes/customerRoutes");
const settingsRoutes = require("./src/routes/settingsRoutes");
const invoiceRoutes = require("./src/routes/invoiceRoutes");
const reportRoutes = require("./src/routes/reportRoutes");
const authRoutes = require("./src/routes/authRoutes");

const app = express();

// ==========================================
// Trust Railway Reverse Proxy
// ==========================================

app.set("trust proxy", 1);

// ==========================================
// Middleware
// ==========================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ==========================================
// Session Configuration
// ==========================================

if (!process.env.SESSION_SECRET) {

    throw new Error(
        "SESSION_SECRET is not configured in .env"
    );

}

app.use(

    session({

        store: new SQLiteStore({

            db: "sessions.sqlite",

            dir:
                process.env.SESSION_DB_DIR ||
                (
                    process.env.NODE_ENV === "production"
                        ? "/data"
                        : path.join(__dirname, "database")
                )

        }),

        secret: process.env.SESSION_SECRET,

        resave: false,

        saveUninitialized: false,

        cookie: {

            httpOnly: true,

            secure:
                process.env.NODE_ENV === "production",

            sameSite: "lax",

            maxAge: 1000 * 60 * 60 * 8

        }

    })

);

// ==========================================
// Static Files
// ==========================================

app.use(

    express.static(

        path.join(__dirname, "public")

    )

);

// ==========================================
// Authentication Routes
// ==========================================

app.use(

    "/api/auth",

    authRoutes

);

// ==========================================
// API Routes
// ==========================================

app.use(

    "/api/dashboard",

    dashboardRoutes

);

app.use(

    "/api/products",

    productRoutes

);

app.use(

    "/api/orders",

    orderRoutes

);

app.use(

    "/api/customers",

    customerRoutes

);

app.use(

    "/api/settings",

    settingsRoutes

);

app.use(

    "/api/invoice",

    invoiceRoutes

);

app.use(

    "/api/reports",

    reportRoutes

);

// ==========================================
// Default Route
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
// Export
// ==========================================

module.exports = app;