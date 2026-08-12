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

        const result =
            await ApiService.get("/api/orders");

        if (!result.success) {

            Toast.show(
                result.message || "Unable to load orders.",
                "error"
            );

            return;

        }

        orders = result.data || [];

        allOrders = result.data || [];

        renderOrders(orders);

    }

    catch (err) {

        console.error("Load Orders Error:", err);

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

        const result =
            await ApiService.get("/api/products");

        if (!result.success) {

            Toast.show(
                result.message || "Unable to load products.",
                "error"
            );

            return;

        }

        products = result.data || [];

    }

    catch (err) {

        console.error("Load Products Error:", err);

        Toast.show(
            "Unable to load products.",
            "error"
        );

    }

}


// ==========================================
// Product Options
// ==========================================

function getProductOptions(selectedId = "") {

    let html = `
        <option value="">
            Select Product
        </option>
    `;

    products.forEach(product => {

        const selected =
            product.id === selectedId
                ? "selected"
                : "";

        html += `
            <option
                value="${product.id}"
                ${selected}>
                ${product.name}
            </option>
        `;

    });

    return html;

}


// ==========================================
// Add Product Row
// ==========================================

function addOrderItemRow(item = null) {

    const container =
        document.getElementById(
            "orderItemsContainer"
        );

    if (!container) {

        return;

    }


    // --------------------------------------
    // Create row
    // --------------------------------------

    const row =
        document.createElement("div");

    row.className =
        "order-item-row";


    row.style.cssText = `
        display:grid;
        grid-template-columns:
            minmax(160px, 2fr)
            120px
            100px
            120px
            45px;
        gap:8px;
        align-items:center;
        margin-bottom:10px;
    `;


    // --------------------------------------
    // Default values
    // --------------------------------------

    const selectedProduct =
        item?.productId || "";

    const weightKg =
        item?.weightKg !== undefined &&
        item?.weightKg !== null
            ? item.weightKg
            : 1;

    const quantity =
        item?.quantity !== undefined &&
        item?.quantity !== null
            ? item.quantity
            : 1;


    // --------------------------------------
    // Row HTML
    // --------------------------------------

    row.innerHTML = `

        <!-- Product -->

        <select
            class="order-item-product"
            title="Product"
            required>

            ${getProductOptions(
                selectedProduct
            )}

        </select>


        <!-- Weight -->

        <input
            type="number"
            class="order-item-weight"
            min="0.001"
            step="0.001"
            value="${weightKg}"
            placeholder="Weight KG"
            title="Weight in KG"
            required>


        <!-- Quantity -->

        <input
            type="number"
            class="order-item-quantity"
            min="1"
            step="1"
            value="${quantity}"
            placeholder="Quantity"
            title="Quantity"
            required>


        <!-- Amount -->

        <div
            class="order-item-total"
            style="
                text-align:right;
                font-weight:600;
                white-space:nowrap;
            ">

            ₹0.00

        </div>


        <!-- Delete -->

        <button
            type="button"
            class="btn-danger remove-order-item"
            title="Remove Product">

            <i class="fa-solid fa-trash"></i>

        </button>

    `;


    container.appendChild(row);


    // ======================================
    // Get Controls
    // ======================================

    const productSelect =
        row.querySelector(
            ".order-item-product"
        );

    const weightInput =
        row.querySelector(
            ".order-item-weight"
        );

    const quantityInput =
        row.querySelector(
            ".order-item-quantity"
        );

    const removeButton =
        row.querySelector(
            ".remove-order-item"
        );


    // ======================================
    // Events
    // ======================================

    productSelect.addEventListener(
        "change",
        function () {

            updateOrderItemRow.call(
                productSelect
            );

        }
    );


    weightInput.addEventListener(
        "input",
        function () {

            updateOrderItemRow.call(
                weightInput
            );

        }
    );


    quantityInput.addEventListener(
        "input",
        function () {

            updateOrderItemRow.call(
                quantityInput
            );

        }
    );


    removeButton.addEventListener(
        "click",
        function () {

            const rows =
                container.querySelectorAll(
                    ".order-item-row"
                );


            if (rows.length <= 1) {

                Toast.show(
                    "At least one product is required.",
                    "warning"
                );

                return;

            }


            row.remove();

            updateOrderGrandTotal();

        }
    );


    // ======================================
    // Calculate Initial Row Total
    // ======================================

    updateOrderItemRow.call(
        productSelect
    );

}


// ==========================================
// Update Product Row
// ==========================================

function updateOrderItemRow() {

    const row =
        this.closest(
            ".order-item-row"
        );

    if (!row) {

        return;

    }


    const productSelect =
        row.querySelector(
            ".order-item-product"
        );

    const weightInput =
        row.querySelector(
            ".order-item-weight"
        );

    const quantityInput =
        row.querySelector(
            ".order-item-quantity"
        );

    const totalElement =
        row.querySelector(
            ".order-item-total"
        );


    const product =
        products.find(
            p =>
                p.id ===
                productSelect.value
        );


    const weightKg =
        Number(
            weightInput.value
        );


    const quantity =
        Number(
            quantityInput.value
        );


    if (
        !product ||
        weightKg <= 0 ||
        quantity <= 0
    ) {

        totalElement.textContent =
            "₹0.00";

        updateOrderGrandTotal();

        return;

    }


    // --------------------------------------
    // Product price is per KG
    // --------------------------------------

    const total =
        Number(product.price || 0) *
        weightKg *
        quantity;


    totalElement.textContent =
        "₹" + total.toFixed(2);


    updateOrderGrandTotal();

}


// ==========================================
// Update Grand Total
// ==========================================

function updateOrderGrandTotal() {

    const container =
        document.getElementById(
            "orderItemsContainer"
        );

    const grandTotalElement =
        document.getElementById(
            "orderGrandTotal"
        );


    if (
        !container ||
        !grandTotalElement
    ) {

        return;

    }


    let grandTotal = 0;


    const rows =
        container.querySelectorAll(
            ".order-item-row"
        );


    rows.forEach(row => {

        const productSelect =
            row.querySelector(
                ".order-item-product"
            );

        const weightInput =
            row.querySelector(
                ".order-item-weight"
            );

        const quantityInput =
            row.querySelector(
                ".order-item-quantity"
            );


        const product =
            products.find(
                p =>
                    p.id ===
                    productSelect.value
            );


        const weightKg =
            Number(
                weightInput.value
            );


        const quantity =
            Number(
                quantityInput.value
            );


        if (
            product &&
            weightKg > 0 &&
            quantity > 0
        ) {

            grandTotal +=
                Number(product.price || 0) *
                weightKg *
                quantity;

        }

    });


    grandTotalElement.textContent =
        "₹" + grandTotal.toFixed(2);

}


// ==========================================
// Collect Order Items
// ==========================================

function collectOrderItems() {

    const container =
        document.getElementById(
            "orderItemsContainer"
        );

    if (!container) {

        return [];

    }


    const rows =
        container.querySelectorAll(
            ".order-item-row"
        );


    const items = [];


    rows.forEach(row => {

        const productId =
            row.querySelector(
                ".order-item-product"
            ).value;


        const weightKg =
            Number(
                row.querySelector(
                    ".order-item-weight"
                ).value
            );


        const quantity =
            Number(
                row.querySelector(
                    ".order-item-quantity"
                ).value
            );


        if (
            productId &&
            weightKg > 0 &&
            quantity > 0
        ) {

            items.push({

                productId,

                weightKg,

                quantity

            });

        }

    });


    return items;

}


// ==========================================
// Render Orders
// ==========================================

function renderOrders(data) {

    const table =
        document.getElementById(
            "orderTable"
        );

    if (!table) {

        return;

    }


    table.innerHTML = "";


    if (data.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="
                        text-align:center;
                        padding:30px;
                    ">

                    No orders available

                </td>

            </tr>

        `;

        return;

    }


    data.forEach(order => {

        table.innerHTML += `

            <tr>

                <td>
                    ${order.id}
                </td>


                <td>
                    ${order.customer}
                </td>


                <td>
                    ${order.productName || "-"}
                </td>


                <td>
                    ${order.quantity || 0}
                </td>


                <td>
                    ₹${Number(
                        order.total || 0
                    ).toFixed(2)}
                </td>


                <td>

                    <span class="order-status">

                        ${order.status}

                    </span>

                </td>


                <td>

                    ${new Date(
                        order.createdAt
                    ).toLocaleDateString()}

                </td>


                <td>

                    <div class="order-actions">

                        <button
                            class="btn-primary invoice-btn"
                            data-id="${order.id}">

                            <i
                                class="fa-solid fa-file-invoice">
                            </i>

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

async function openOrderModal(
    edit = false,
    order = null
) {

    editingOrderId = null;


    await loadOrderProducts();


    const form =
        document.getElementById(
            "orderForm"
        );


    if (form) {

        form.reset();

    }


    const container =
        document.getElementById(
            "orderItemsContainer"
        );


    if (container) {

        container.innerHTML = "";

    }


    // ======================================
    // Edit Existing Order
    // ======================================

    if (edit && order) {

        editingOrderId =
            order.id;


        const customerInput =
            document.getElementById(
                "orderCustomer"
            );

        if (customerInput) {

            customerInput.value =
                order.customer || "";

        }


        const statusInput =
            document.getElementById(
                "orderStatus"
            );

        if (statusInput) {

            statusInput.value =
                order.status || "Pending";

        }


        // Existing single-product order

        addOrderItemRow({

            productId:
                order.productId,

            weightKg:
                order.weightKg || 1,

            quantity:
                order.quantity || 1

        });

    }


    else {

        // New order starts with one product

        addOrderItemRow();

    }


    updateOrderGrandTotal();


    const modal =
        document.getElementById(
            "orderModal"
        );


    if (modal) {

        modal.style.display =
            "flex";

    }

}


// ==========================================
// Close Order Modal
// ==========================================

function closeOrderModal() {

    editingOrderId = null;


    const modal =
        document.getElementById(
            "orderModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }

}


// ==========================================
// Save Order
// ==========================================

async function saveOrder() {

    try {

        const customer =
            document.getElementById(
                "orderCustomer"
            ).value.trim();


        const status =
            document.getElementById(
                "orderStatus"
            ).value;


        const items =
            collectOrderItems();


        // ======================================
        // Validate Customer
        // ======================================

        if (!customer) {

            Toast.show(
                "Please enter customer name.",
                "warning"
            );

            return;

        }


        // ======================================
        // Validate Products
        // ======================================

        if (items.length === 0) {

            Toast.show(
                "Please add at least one product with valid weight and quantity.",
                "warning"
            );

            return;

        }


        // ======================================
        // Check Duplicate Products
        // ======================================

        const productIds =
            items.map(
                item =>
                    item.productId
            );


        const duplicateProducts =
            productIds.filter(
                (id, index) =>
                    productIds.indexOf(id) !== index
            );


        if (
            duplicateProducts.length > 0
        ) {

            Toast.show(
                "Please add each product only once.",
                "warning"
            );

            return;

        }


        // ======================================
        // Validate Products
        // ======================================

        for (const item of items) {

            const product =
                products.find(
                    p =>
                        p.id ===
                        item.productId
                );


            if (!product) {

                Toast.show(
                    "Product not found.",
                    "error"
                );

                return;

            }


            // ----------------------------------
            // Stock check
            // ----------------------------------

            if (
                Number(product.stock) <
                Number(item.quantity)
            ) {

                Toast.show(
                    `Insufficient stock for ${product.name}.`,
                    "error"
                );

                return;

            }

        }


        // ======================================
        // Calculate Total
        // ======================================

        let total = 0;


        items.forEach(item => {

            const product =
                products.find(
                    p =>
                        p.id ===
                        item.productId
                );


            total +=
                Number(product.price || 0) *
                Number(item.weightKg) *
                Number(item.quantity);

        });


        // ======================================
        // Payload
        // ======================================

        const payload = {

            customer,

            items,

            total,

            status

        };


        let result;


        // ======================================
        // Edit Existing Order
        // ======================================

        if (editingOrderId) {

            // Current backend update endpoint
            // supports the existing single-product
            // edit flow.

            if (items.length !== 1) {

                Toast.show(
                    "Editing multiple-product orders is not available yet. Create a new order instead.",
                    "warning"
                );

                return;

            }


            const item =
                items[0];


            result =
                await ApiService.put(

                    `/api/orders/${editingOrderId}`,

                    {

                        customer,

                        productId:
                            item.productId,

                        weightKg:
                            item.weightKg,

                        quantity:
                            item.quantity,

                        total,

                        status

                    }

                );

        }


        // ======================================
        // Create New Order
        // ======================================

        else {

            result =
                await ApiService.post(

                    "/api/orders",

                    payload

                );

        }


        // ======================================
        // API Result
        // ======================================

        if (!result.success) {

            Toast.show(
                result.message ||
                "Unable to save order.",
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

        console.error(
            "Save Order Error:",
            err
        );


        Toast.show(
            err.message ||
            "Unable to save order.",
            "error"
        );

    }

}


// ==========================================
// Edit Order
// ==========================================

function editOrder(id) {

    const order =
        orders.find(
            o =>
                o.id === id
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

        const result =
            await ApiService.delete(
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


        await loadOrders();

    }


    catch (err) {

        console.error(
            "Delete Order Error:",
            err
        );


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

        // --------------------------------------
        // Create Order
        // --------------------------------------

        if (
            e.target.closest(
                "#addOrderBtn"
            )
        ) {

            openOrderModal();

            return;

        }


        // --------------------------------------
        // Add Product
        // --------------------------------------

        if (
            e.target.closest(
                "#addOrderItemBtn"
            )
        ) {

            addOrderItemRow();

            return;

        }


        // --------------------------------------
        // Save Order
        // --------------------------------------

        if (
            e.target.closest(
                "#saveOrderBtn"
            )
        ) {

            saveOrder();

            return;

        }


        // --------------------------------------
        // Close Order Modal
        // --------------------------------------

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


        // --------------------------------------
        // Edit Order
        // --------------------------------------

        const editBtn =
            e.target.closest(
                ".edit-order-btn"
            );


        if (editBtn) {

            editOrder(
                editBtn.dataset.id
            );

            return;

        }


        // --------------------------------------
        // Delete Order
        // --------------------------------------

        const deleteBtn =
            e.target.closest(
                ".delete-order-btn"
            );


        if (deleteBtn) {

            deleteOrder(
                deleteBtn.dataset.id
            );

            return;

        }


        // --------------------------------------
        // Invoice
        // --------------------------------------

        const invoiceBtn =
            e.target.closest(
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
// Close Modal Outside Click
// ==========================================

window.addEventListener(
    "click",
    function (e) {

        const orderModal =
            document.getElementById(
                "orderModal"
            );


        if (
            orderModal &&
            e.target === orderModal
        ) {

            closeOrderModal();

        }

    }
);


// ==========================================
// ESC Key
// ==========================================

document.addEventListener(
    "keydown",
    function (e) {

        if (e.key === "Escape") {

            closeOrderModal();

        }

    }
);


// ==========================================
// Expose Functions
// ==========================================

if (
    typeof window !== "undefined"
) {

    window.loadOrders =
        loadOrders;

    window.initializeOrders =
        initializeOrders;

}


// ==========================================
// Search Orders
// ==========================================

function searchOrders() {

    filterOrders();

}


// ==========================================
// Filter Orders
// ==========================================

function filterOrders() {

    const searchInput =
        document.getElementById(
            "orderSearch"
        );


    const statusInput =
        document.getElementById(
            "orderStatusFilter"
        );


    const keyword =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const status =
        statusInput
            ? statusInput.value
            : "All";


    const filtered =
        allOrders.filter(
            order => {

                const orderId =
                    String(
                        order.id || ""
                    ).toLowerCase();


                const customer =
                    String(
                        order.customer || ""
                    ).toLowerCase();


                const productName =
                    String(
                        order.productName || ""
                    ).toLowerCase();


                const matchesSearch =

                    orderId.includes(
                        keyword
                    )

                    ||

                    customer.includes(
                        keyword
                    )

                    ||

                    productName.includes(
                        keyword
                    );


                const matchesStatus =

                    status === "All"

                    ||

                    order.status === status;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    renderOrders(filtered);

}