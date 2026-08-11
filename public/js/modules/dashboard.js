// ==========================================
// Dashboard Module
// ==========================================

async function loadDashboard() {

    await loadDashboardStats();

}

// ==========================================
// Dashboard Statistics
// ==========================================

async function loadDashboardStats() {

    try {

        const result = await ApiService.get("/api/dashboard");

        if (!result.success) {

            Toast.show(result.message, "error");

            return;

        }

        const data = result.data;

        document.getElementById("totalProducts").textContent =
            data.totalProducts;

        document.getElementById("totalOrders").textContent =
            data.totalOrders;

        document.getElementById("totalCustomers").textContent =
            data.totalCustomers;

        document.getElementById("totalRevenue").textContent =
            `₹${Number(data.totalRevenue).toLocaleString()}`;

        document.getElementById("todaySales").textContent =
            `₹${Number(data.todaySales).toLocaleString()}`;

        document.getElementById("monthlySales").textContent =
            `₹${Number(data.monthlySales).toLocaleString()}`;

    }

    catch (err) {

        console.error(err);

        Toast.show("Unable to load dashboard.", "error");

    }

}