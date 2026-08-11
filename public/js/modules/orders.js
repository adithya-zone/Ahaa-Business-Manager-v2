// ==========================================
// Orders Module
// ==========================================

let orders = [];

let products = [];

let editingOrderId = null;

let allOrders = [];

// ==========================================
// Load Orders
// ==========================================

async function loadOrders() {

    try {

        const result = await ApiService.get("/api/orders");

        if (!result.success) {

            Toast.show(

                result.message,

                "error"

            );

            return;

        }

        orders = result.data || [];

        allOrders = result.data || [];

        renderOrders(orders);

    }

    catch (err) {

        console.error(err);

        Toast.show(

            "Unable to load orders.",

            "error"

        );

    }

}

// ==========================================
// Load Products
// ==========================================

async function loadOrderProducts() {

    try {

        const result = await ApiService.get(

            "/api/products"

        );

        if (!result.success) return;

        products = result.data || [];

        const select = document.getElementById(

            "orderProduct"

        );

        if (!select) return;

        select.innerHTML =

            '<option value="">Select Product</option>';

        products.forEach(product => {

            select.innerHTML += `

                <option value="${product.id}">

                    ${product.name}

                </option>

            `;

        });

    }

    catch (err) {

        console.error(err);

    }

}

// ==========================================
// Render Orders
// ==========================================

function renderOrders(data) {

    const table = document.getElementById(

        "orderTable"

    );

    if (!table) return;

    table.innerHTML = "";

    if (data.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="8"

                    style="text-align:center;padding:30px;">

                    No orders available

                </td>

            </tr>

        `;

        return;

    }

    data.forEach(order => {

        table.innerHTML += `

        <tr>

            <td>${order.id}</td>

            <td>${order.customer}</td>

            <td>${order.productName}</td>

            <td>${order.quantity}</td>

            <td>₹${order.total}</td>

            <td>

                <span class="order-status">

                    ${order.status}

                </span>

            </td>

            <td>

                ${new Date(order.createdAt)

                    .toLocaleDateString()}

            </td>

            <td>

                <div class="order-actions">

                    <button

                        class="btn-primary invoice-btn"

                        data-id="${order.id}">

                        <i class="fa-solid fa-file-invoice"></i>

                        Invoice

                    </button>

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

async function openOrderModal(edit = false, order = null) {

    editingOrderId = null;

    await loadOrderProducts();

    document.getElementById("orderForm").reset();

    if (edit && order) {

        editingOrderId = order.id;

        document.getElementById("orderCustomer").value =
            order.customer;

        document.getElementById("orderProduct").value =
            order.productId;

        document.getElementById("orderQuantity").value =
            order.quantity;

        document.getElementById("orderStatus").value =
            order.status;

    }

    document.getElementById("orderModal").style.display =
        "flex";

}

// ==========================================
// Close Order Modal
// ==========================================

function closeOrderModal() {

    editingOrderId = null;

    document.getElementById("orderModal").style.display =
        "none";

}

// ==========================================
// Save Order
// ==========================================

async function saveOrder() {

    try {

        const productId =
            document.getElementById("orderProduct").value;

        const quantity = Number(
            document.getElementById("orderQuantity").value
        );

        const customer =
            document.getElementById("orderCustomer").value;

        const status =
            document.getElementById("orderStatus").value;

        if (!productId || quantity <= 0) {

            Toast.show(
                "Please complete the form.",
                "warning"
            );

            return;

        }

        const product = products.find(

            p => p.id === productId

        );

        if (!product) {

            Toast.show(
                "Product not found.",
                "error"
            );

            return;

        }

        const payload = {

            customer,

            productId,

            quantity,

            total: quantity * Number(product.price),

            status

        };

        let result;

        if (editingOrderId) {

            result = await ApiService.put(

                `/api/orders/${editingOrderId}`,

                payload

            );

        } else {

            result = await ApiService.post(

                "/api/orders",

                payload

            );

        }

        if (!result.success) {

            Toast.show(
                result.message,
                "error"
            );

            return;

        }

        Toast.show(

            editingOrderId

                ? "Order Updated"

                : "Order Created",

            "success"

        );

        closeOrderModal();

        await loadOrders();

    }

    catch (err) {

        console.error(err);

        Toast.show(
            "Unable to save order.",
            "error"
        );

    }

}
// ==========================================
// Edit Order
// ==========================================

function editOrder(id) {

    const order = orders.find(

        o => o.id === id

    );

    if (!order) {

        Toast.show(

            "Order not found.",

            "error"

        );

        return;

    }

    openOrderModal(

        true,

        order

    );

}

// ==========================================
// Delete Order
// ==========================================

async function deleteOrder(id) {

    if (

        !confirm(

            "Delete this order?"

        )

    ) {

        return;

    }

    try {

        const result = await ApiService.delete(

            `/api/orders/${id}`

        );

        if (!result.success) {

            Toast.show(

                result.message,

                "error"

            );

            return;

        }

        Toast.show(

            "Order Deleted",

            "success"

        );

        loadOrders();

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

document.addEventListener(

    "click",

    function (e) {

        // -----------------------------
        // Create Order
        // -----------------------------

        if (

            e.target.closest(

                "#addOrderBtn"

            )

        ) {

            openOrderModal();

            return;

        }

        // -----------------------------
        // Save Order
        // -----------------------------

        if (

            e.target.closest(

                "#saveOrderBtn"

            )

        ) {

            saveOrder();

            return;

        }

        // -----------------------------
        // Close Modal
        // -----------------------------

        if (

            e.target.closest(

                "#closeOrderModal"

            )

            ||

            e.target.closest(

                "#cancelOrderBtn"

            )

        ) {

            closeOrderModal();

            return;

        }

        // -----------------------------
        // Edit Order
        // -----------------------------

        const editBtn = e.target.closest(

            ".edit-order-btn"

        );

        if (editBtn) {

            editOrder(

                editBtn.dataset.id

            );

            return;

        }

        // -----------------------------
        // Delete Order
        // -----------------------------

        const deleteBtn = e.target.closest(

            ".delete-order-btn"

        );

        if (deleteBtn) {

            deleteOrder(

                deleteBtn.dataset.id

            );

            return;

        }

        // -----------------------------
        // Invoice
        // -----------------------------

        const invoiceBtn = e.target.closest(

            ".invoice-btn"

        );

        if (invoiceBtn) {

            openInvoice(

                invoiceBtn.dataset.id

            );

            return;

        }

    }

);
// ==========================================
// Initialize Orders Module
// ==========================================

function initializeOrders() {

    loadOrders();

}

// ==========================================
// Close Modal on Outside Click
// ==========================================

window.addEventListener("click", function (e) {

    const orderModal = document.getElementById("orderModal");

    if (orderModal && e.target === orderModal) {

        closeOrderModal();

    }

});

// ==========================================
// ESC Key Support
// ==========================================

document.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {

        closeOrderModal();

    }

});

// ==========================================
// Auto Initialize When Orders Page Loads
// ==========================================

if (typeof window !== "undefined") {

    window.loadOrders = loadOrders;

    window.initializeOrders = initializeOrders;

}
// ==========================================
// Search Orders
// ==========================================

function searchOrders() {

    const keyword = document
        .getElementById("orderSearch")
        .value
        .toLowerCase();

    const filtered = allOrders.filter(order =>

        order.id.toLowerCase().includes(keyword) ||

        order.customer.toLowerCase().includes(keyword) ||

        order.productName.toLowerCase().includes(keyword)

    );

    renderOrders(filtered);

}