// ==========================================
// Orders Module
// ==========================================

let orderProducts = [];
let selectedProduct = null;
let editingOrder = null;

// ==========================================
// Load Orders
// ==========================================

async function loadOrders() {

    try {

        const result = await ApiService.get("/api/orders");

        if (!result.success) {

            Toast.show(result.message, "error");
            return;

        }

        renderOrders(result.data || []);

    } catch (err) {

        console.error(err);

        Toast.show("Unable to load orders.", "error");

    }

}

// ==========================================
// Render Orders
// ==========================================

function renderOrders(orders) {

    const table = document.getElementById("orderTable");

    if (!table) return;

    table.innerHTML = "";

    if (orders.length === 0) {

        table.innerHTML = `
        <tr>
            <td colspan="8" style="text-align:center;padding:25px;">
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

            <td>${order.productName || "-"}</td>

            <td>${order.quantity}</td>

            <td>₹${order.total}</td>

            <td>

                <span class="order-status">

                    ${order.status}

                </span>

            </td>

            <td>

                ${new Date(order.createdAt).toLocaleDateString()}

            </td>

            <td>

                <div class="order-actions">

                    <button
                        class="btn-primary edit-order-btn"
                        data-id="${order.id}">

                        Edit

                    </button>

                    <button
                        class="btn-danger delete-order-btn"
                        data-id="${order.id}">

                        Delete

                    </button>

                </div>

            </td>

        </tr>

        `;

    });

}

// ==========================================
// Open Order Modal
// ==========================================

async function openOrderModal() {

    editingOrder = null;

    const modal = document.getElementById("orderModal");

    modal.style.display = "flex";

    document.getElementById("customerName").value =
        "Walk-in Customer";

    document.getElementById("orderQty").value = 1;

    document.getElementById("orderTotal").value = "";

    const btn = document.getElementById("saveOrderBtn");

    btn.textContent = "Save Order";

    await loadProductsForOrder();

}

// ==========================================
// Close Modal
// ==========================================

function closeOrderModal() {

    document.getElementById("orderModal").style.display =
        "none";

}
// ==========================================
// Load Products for Order
// ==========================================

async function loadProductsForOrder() {

    try {

        const result = await ApiService.get("/api/products");

        if (!result.success) {

            Toast.show("Unable to load products.", "error");

            return;

        }

        orderProducts = result.data || [];

        const select = document.getElementById("orderProduct");

        select.innerHTML = "";

        if (orderProducts.length === 0) {

            select.innerHTML = `
                <option value="">
                    No Products Available
                </option>
            `;

            return;

        }

        orderProducts.forEach(product => {

            select.innerHTML += `
                <option value="${product.id}">
                    ${product.name} (₹${product.price})
                </option>
            `;

        });

        if (editingOrder) {

            select.value = editingOrder.productId;

            selectedProduct = orderProducts.find(
                p => p.id === editingOrder.productId
            );

        } else {

            selectedProduct = orderProducts[0];

        }

        calculateOrderTotal();

    }

    catch (err) {

        console.error(err);

        Toast.show("Unable to load products.", "error");

    }

}

// ==========================================
// Product Changed
// ==========================================

function onProductChanged() {

    const id = document.getElementById("orderProduct").value;

    selectedProduct = orderProducts.find(

        p => p.id === id

    );

    calculateOrderTotal();

}

// ==========================================
// Quantity Changed
// ==========================================

function onQuantityChanged() {

    calculateOrderTotal();

}

// ==========================================
// Calculate Total
// ==========================================

function calculateOrderTotal() {

    if (!selectedProduct) return;

    let qty = Number(
        document.getElementById("orderQty").value
    );

    if (qty <= 0) {

        qty = 1;

        document.getElementById("orderQty").value = 1;

    }

    if (qty > selectedProduct.stock) {

        Toast.show(
            `Only ${selectedProduct.stock} item(s) available.`,
            "warning"
        );

        qty = selectedProduct.stock;

        document.getElementById("orderQty").value = qty;

    }

    const total = qty * Number(selectedProduct.price);

    document.getElementById("orderTotal").value = total;

}

// ==========================================
// Reset Form
// ==========================================

function resetOrderForm() {

    document.getElementById("customerName").value =
        "Walk-in Customer";

    document.getElementById("orderQty").value = 1;

    document.getElementById("orderTotal").value = "";

    editingOrder = null;

}
// ==========================================
// Save / Update Order
// ==========================================

async function saveOrder() {

    try {

        if (!selectedProduct) {

            Toast.show("Please select a product.", "warning");
            return;

        }

        const customer = document
            .getElementById("customerName")
            .value
            .trim() || "Walk-in Customer";

        const quantity = Number(
            document.getElementById("orderQty").value
        );

        if (quantity <= 0) {

            Toast.show(
                "Quantity must be greater than zero.",
                "warning"
            );

            return;

        }

        const order = {

            customer,

            productId: selectedProduct.id,

            quantity,

            total: Number(
                document.getElementById("orderTotal").value
            ),

            status: "Pending"

        };

        let result;

        if (editingOrder) {

            result = await ApiService.put(
                `/api/orders/${editingOrder.id}`,
                order
            );

        } else {

            result = await ApiService.post(
                "/api/orders",
                order
            );

        }

        if (!result.success) {

            Toast.show(result.message, "error");
            return;

        }

        Toast.show(
            editingOrder
                ? "Order updated successfully."
                : "Order created successfully.",
            "success"
        );

        closeOrderModal();

        resetOrderForm();

        await loadOrders();

        if (typeof loadProducts === "function") {

            await loadProducts();

        }

        if (typeof loadDashboard === "function") {

            await loadDashboard();

        }

    }

    catch (err) {

        console.error(err);

        Toast.show("Unable to save order.", "error");

    }

}

// ==========================================
// Edit Order
// ==========================================

async function editOrder(id) {

    try {

        const result = await ApiService.get("/api/orders");

        const orders = result.data || [];

        editingOrder = orders.find(o => o.id === id);

        if (!editingOrder) {

            Toast.show("Order not found.", "error");

            return;

        }

        document.getElementById("customerName").value =
            editingOrder.customer;

        document.getElementById("orderQty").value =
            editingOrder.quantity;

        await openOrderModal();

        document.getElementById("orderProduct").value =
            editingOrder.productId;

        onProductChanged();

        document.getElementById("saveOrderBtn").textContent =
            "Update Order";

    }

    catch (err) {

        console.error(err);

        Toast.show("Unable to load order.", "error");

    }

}

// ==========================================
// Delete Order
// ==========================================

async function deleteOrder(id) {

    if (!confirm("Delete this order?")) {

        return;

    }

    try {

        const result = await ApiService.delete(
            `/api/orders/${id}`
        );

        if (!result.success) {

            Toast.show(result.message, "error");

            return;

        }

        Toast.show(
            "Order deleted successfully.",
            "success"
        );

        await loadOrders();

        if (typeof loadProducts === "function") {

            await loadProducts();

        }

        if (typeof loadDashboard === "function") {

            await loadDashboard();

        }

    }

    catch (err) {

        console.error(err);

        Toast.show(
            "Unable to delete order.",
            "error"
        );

    }

}
// ==========================================
// Event Binding
// ==========================================

document.addEventListener("change", function (e) {

    if (e.target.id === "orderProduct") {

        onProductChanged();

    }

});

document.addEventListener("input", function (e) {

    if (e.target.id === "orderQty") {

        onQuantityChanged();

    }

});

document.addEventListener("click", function (e) {

    // Create Order
    if (e.target.closest("#addOrderBtn")) {

        openOrderModal();

    }

    // Save / Update Order
    if (e.target.closest("#saveOrderBtn")) {

        saveOrder();

    }

    // Close Modal
    if (
        e.target.closest("#cancelOrderBtn") ||
        e.target.closest("#closeOrderModal")
    ) {

        closeOrderModal();

    }

    // Edit Order
    if (e.target.closest(".edit-order-btn")) {

        const id = e.target
            .closest(".edit-order-btn")
            .dataset.id;

        editOrder(id);

    }

    // Delete Order
    if (e.target.closest(".delete-order-btn")) {

        const id = e.target
            .closest(".delete-order-btn")
            .dataset.id;

        deleteOrder(id);

    }

});

// ==========================================
// Refresh Helpers
// ==========================================

async function refreshModules() {

    await loadOrders();

    if (typeof loadProducts === "function") {

        await loadProducts();

    }

    if (typeof loadDashboard === "function") {

        await loadDashboard();

    }

}

// ==========================================
// Initialize
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("orderTable")) {

        loadOrders();

    }

});