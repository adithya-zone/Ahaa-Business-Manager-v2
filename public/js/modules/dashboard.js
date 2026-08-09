// ==========================================
// Dashboard Module
// ==========================================

async function loadDashboard() {

    loadDashboardStats();

}

// ==========================================
// Dashboard Statistics
// ==========================================

async function loadDashboardStats() {

    const products = await ApiService.get("/api/products");

    const totalProducts = products.data.length;

    document.getElementById("totalProducts").textContent = totalProducts;

    document.getElementById("totalOrders").textContent = 0;

    document.getElementById("totalCustomers").textContent = 0;

    document.getElementById("totalRevenue").textContent = "₹0";

}