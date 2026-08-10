// ==========================================
// Inventory Module
// ==========================================

let inventoryItems = [];
let inventoryAction = "stock-in";

// ==========================================
// Load Inventory
// ==========================================

async function loadInventory() {

    try {

        const result = await ApiService.get("/api/inventory");

        if (!result.success) {

            Toast.show(result.message, "error");

            return;

        }

        inventoryItems = result.data || [];

        renderInventory(inventoryItems);

    }

    catch (err) {

        console.error(err);

        Toast.show("Unable to load inventory.", "error");

    }

}

// ==========================================
// Render Inventory
// ==========================================

function renderInventory(items) {

    const table = document.getElementById("inventoryTable");

    if (!table) return;

    table.innerHTML = "";

    if (items.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;padding:30px;">
                    No inventory available
                </td>
            </tr>
        `;

        return;

    }

    items.forEach(item => {

        table.innerHTML += `

        <tr>

            <td>${item.id}</td>

            <td>${item.name}</td>

            <td>${item.category}</td>

            <td>${item.stock}</td>

            <td>₹${item.price}</td>

            <td>₹${item.value}</td>

            <td>

                <span class="order-status">

                    ${item.lowStock ? "Low Stock" : "Healthy"}

                </span>

            </td>

            <td>

                <div class="order-actions">

                    <button
                        class="btn-primary stock-in-btn"
                        data-id="${item.id}">

                        + Stock

                    </button>

                    <button
                        class="btn-danger stock-out-btn"
                        data-id="${item.id}">

                        - Stock

                    </button>

                </div>

            </td>

        </tr>

        `;

    });

}

// ==========================================
// Open Inventory Modal
// ==========================================

function openInventoryModal(id, action) {

    inventoryAction = action;

    const item = inventoryItems.find(

        p => p.id === id

    );

    if (!item) return;

    document.getElementById("inventoryProductId").value = item.id;

    document.getElementById("inventoryProductName").value = item.name;

    document.getElementById("currentStock").value = item.stock;

    document.getElementById("inventoryQuantity").value = 1;

    document.getElementById("inventoryRemarks").value = "";

    document.getElementById("inventoryModalTitle").textContent =

        action === "stock-in"

            ? "Stock In"

            : "Stock Out";

    document.getElementById("saveInventoryBtn").textContent =

        action === "stock-in"

            ? "Add Stock"

            : "Remove Stock";

    document.getElementById("inventoryModal").style.display = "flex";

}

// ==========================================
// Close Modal
// ==========================================

function closeInventoryModal() {

    document.getElementById("inventoryModal").style.display = "none";

}
// ==========================================
// Save Inventory
// ==========================================

async function saveInventory() {

    try {

        const productId = document.getElementById(
            "inventoryProductId"
        ).value;

        const quantity = Number(
            document.getElementById(
                "inventoryQuantity"
            ).value
        );

        if (quantity <= 0) {

            Toast.show(
                "Quantity must be greater than zero.",
                "warning"
            );

            return;

        }

        const endpoint = inventoryAction === "stock-in"

            ? `/api/inventory/${productId}/stock-in`

            : `/api/inventory/${productId}/stock-out`;

        const result = await ApiService.post(

            endpoint,

            {

                quantity,

                remarks: document
                    .getElementById("inventoryRemarks")
                    .value
                    .trim()

            }

        );

        if (!result.success) {

            Toast.show(

                result.message,

                "error"

            );

            return;

        }

        Toast.show(

            inventoryAction === "stock-in"

                ? "Stock added successfully."

                : "Stock removed successfully.",

            "success"

        );

        closeInventoryModal();

        await refreshInventory();

    }

    catch (err) {

        console.error(err);

        Toast.show(

            "Unable to update inventory.",

            "error"

        );

    }

}

// ==========================================
// Refresh Inventory
// ==========================================

async function refreshInventory() {

    await loadInventory();

    if (typeof loadProducts === "function") {

        await loadProducts();

    }

    if (typeof loadDashboard === "function") {

        await loadDashboard();

    }

}
// ==========================================
// Event Binding
// ==========================================

document.addEventListener("click", async function (e) {

    // --------------------------------------
    // Stock In
    // --------------------------------------

    const stockInBtn = e.target.closest(".stock-in-btn");

    if (stockInBtn) {

        openInventoryModal(

            stockInBtn.dataset.id,

            "stock-in"

        );

        return;

    }

    // --------------------------------------
    // Stock Out
    // --------------------------------------

    const stockOutBtn = e.target.closest(".stock-out-btn");

    if (stockOutBtn) {

        openInventoryModal(

            stockOutBtn.dataset.id,

            "stock-out"

        );

        return;

    }

    // --------------------------------------
    // Save Inventory
    // --------------------------------------

    if (e.target.closest("#saveInventoryBtn")) {

        await saveInventory();

        return;

    }

    // --------------------------------------
    // Close Modal
    // --------------------------------------

    if (

        e.target.closest("#cancelInventoryBtn") ||

        e.target.closest("#closeInventoryModal")

    ) {

        closeInventoryModal();

        return;

    }

});
// ==========================================
// Search Inventory
// ==========================================

function searchInventory(keyword) {

    keyword = keyword.toLowerCase();

    const filtered = inventoryItems.filter(item =>

        item.name.toLowerCase().includes(keyword) ||

        item.category.toLowerCase().includes(keyword) ||

        item.id.toLowerCase().includes(keyword)

    );

    renderInventory(filtered);

}

// ==========================================
// Auto Initialize
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("inventoryTable")) {

        loadInventory();

    }

});