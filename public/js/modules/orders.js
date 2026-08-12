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

        console.error(err);

        Toast.show(
            "Unable to load products.",
            "error"
        );

    }

}


// ==========================================
// Create Product Options
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

    if (!container) return;


    const row =
        document.createElement("div");

    row.className =
        "order-item-row";

    row.style.cssText = `
        display:grid;
        grid-template-columns:
            minmax(180px, 2fr)
            90px
            110px
            40px;
        gap:10px;
        align-items:center;
        margin-bottom:10px;
    `;


    const selectedProduct =
        item?.productId || "";


    const quantity =
        item?.quantity || 1;


    row.innerHTML = `

        <select
            class="order-item-product"
            required>

            ${getProductOptions(
                selectedProduct
            )}

        </select>


        <input
            type="number"
            class="order-item-quantity"
            min="1"
            value="${quantity}"
            required>


        <div
            class="order-item-total"
            style="
                text-align:right;
                font-weight:600;
            ">

            ₹0.00

        </div>


        <button
            type="button"
            class="btn-danger remove-order-item"
            title="Remove Product">

            <i class="fa-solid fa-trash"></i>

        </button>

    `;


    container.appendChild(row);


    const productSelect =
        row.querySelector(
            ".order-item-product"
        );

    const quantityInput =
        row.querySelector(
            ".order-item-quantity"
        );


    productSelect.addEventListener(
        "change",
        updateOrderItemRow
    );


    quantityInput.addEventListener(
        "input",
        updateOrderItemRow
    );


    const removeButton =
        row.querySelector(
            ".remove-order-item"
        );


    removeButton.addEventListener(
        "click",
        function () {

            const rows =
                container.querySelectorAll(
                    ".order-item-row"
                );

            // Keep at least one row

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

    if (!row) return;


    const productSelect =
        row.querySelector(
            ".order-item-product"
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


    const quantity =
        Number(
            quantityInput.value
        );


    if (!product || quantity <= 0) {

        totalElement.textContent =
            "₹0.00";

        updateOrderGrandTotal();

        return;

    }


    const total =
        Number(product.price || 0) *
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


    if (!container || !grandTotalElement) {

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


        const quantity =
            Number(
                quantityInput.value
            );


        if (product && quantity > 0) {

            grandTotal +=
                Number(product.price || 0) *
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


        const quantity =
            Number(
                row.querySelector(
                    ".order-item-quantity"
                ).value
            );


        if (productId && quantity > 0) {

            items.push({

                productId,

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


    if (!table) return;


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
                    ${order.productName}
                </td>


                <td>
                    ${order.quantity}
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


    // --------------------------------------
    // Edit Existing Order
    // --------------------------------------

    if (edit && order) {

        editingOrderId =
            order.id;


        document.getElementById(
            "orderCustomer"
        ).value =
            order.customer;


        document.getElementById(
            "orderStatus"
        ).value =
            order.status;


        /*
         * Existing orders currently contain
         * one product in the orders table.
         *
         * We load that product into one row.
         *
         * Later we can make editing retrieve
         * all order_items as well.
         */

        addOrderItemRow({

            productId:
                order.productId,

            quantity:
                order.quantity

        });

    }

    else {

        addOrderItemRow();

    }


    updateOrderGrandTotal();


    document.getElementById(
        "orderModal"
    ).style.display =
        "flex";

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


        // --------------------------------------
        // Validate
        // --------------------------------------

        if (!customer) {

            Toast.show(
                "Please enter customer name.",
                "warning"
            );

            return;

        }


        if (items.length === 0) {

            Toast.show(
                "Please add at least one product.",
                "warning"
            );

            return;

        }


        // --------------------------------------
        // Check duplicate products
        // --------------------------------------

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


        // --------------------------------------
        // Validate stock locally
        // --------------------------------------

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


        // --------------------------------------
        // Calculate total
        // --------------------------------------

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
                Number(item.quantity);

        });


        // --------------------------------------
        // Payload
        // --------------------------------------

        const payload = {

            customer,

            items,

            total,

            status

        };


        let result;


        // --------------------------------------
        // Update existing order
        // --------------------------------------

        if (editingOrderId) {

            /*
             * Current backend edit endpoint still
             * supports one product.
             *
             * Therefore, for now, only allow one
             * item when editing an old order.
             */

            if (items.length !== 1) {

                Toast.show(

                    "Editing multiple-product orders will be added next. Create a new order for multiple products.",

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

                        quantity:
                            item.quantity,

                        total,

                        status

                    }

                );

        }

        // --------------------------------------
        // Create new order
        // --------------------------------------

        else {

            result =
                await ApiService.post(

                    "/api/orders",

                    payload

                );

        }


        // --------------------------------------
        // API Result
        // --------------------------------------

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

        console.error(
            "Save Order Error:",
            err
        );


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
        // Close Modal
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
// Close Modal on Outside Click
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
// ESC Key Support
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
        allOrders.filter(order => {

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

                orderId.includes(keyword) ||

                customer.includes(keyword) ||

                productName.includes(keyword);


            const matchesStatus =

                status === "All" ||

                order.status === status;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    renderOrders(filtered);

}