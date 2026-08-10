require("dotenv").config();

const app = require("./app");
const { initializeDatabase } = require("./src/config/database");

const PORT = process.env.PORT || 3000;

async function startServer() {

    try {

        await initializeDatabase();

        app.listen(PORT, () => {

            console.log("");
            console.log("====================================");
            console.log("🚀 Ahaa Business Manager ERP v2");
            console.log("🗄️ SQLite Connected");
            console.log(`🌐 Server running at http://localhost:${PORT}`);
            console.log("====================================");

        });

    } catch (err) {

        console.error("❌ Failed to initialize database");
        console.error(err);
        process.exit(1);

    }

}

startServer();