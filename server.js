require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("");

    console.log("====================================");

    console.log("🚀 Ahaa Business Manager ERP v2");

    console.log(`🌐 Server running at http://localhost:${PORT}`);

    console.log("====================================");

});