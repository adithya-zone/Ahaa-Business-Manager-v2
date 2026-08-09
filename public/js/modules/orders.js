// ==========================================
// Orders Module
// ==========================================

async function loadOrders() {

    const result = await ApiService.get("/api/orders");

    const table = document.getElementById("orderTable");

    if (!table) return;

    table.innerHTML = "";

    const orders = result.data || [];

    if (orders.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    No orders available
                </td>
            </tr>
        `;

        return;

    }

    orders.forEach(order => {

        table.innerHTML += `
            <tr>

                <td>${order.id}</td>

                <td>${order.customer}</td>

                <td>₹${order.total}</td>

                <td>${order.status}</td>

                <td>${new Date(order.createdAt).toLocaleDateString()}</td>

            </tr>
        `;

    });

}