// ==========================================
// Customers Module
// ==========================================

let customers = [];
let editingCustomer = null;

// ==========================================
// Load Customers
// ==========================================

async function loadCustomers() {

    try {

        const result = await ApiService.get("/api/customers");

        if (!result.success) {

            Toast.show(result.message, "error");

            return;

        }

        customers = result.data || [];

        renderCustomers(customers);

    }

    catch (err) {

        console.error(err);

        Toast.show("Unable to load customers.", "error");

    }

}

// ==========================================
// Render Customers
// ==========================================

function renderCustomers(data) {

    const table = document.getElementById("customerTable");

    if (!table) return;

    table.innerHTML = "";

    if (data.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;padding:30px;">
                    No customers available
                </td>
            </tr>
        `;

        return;

    }

    data.forEach(customer => {

        table.innerHTML += `

        <tr>

            <td>${customer.id}</td>

            <td>${customer.name}</td>

            <td>${customer.phone}</td>

            <td>${customer.email || "-"}</td>

            <td>${customer.city || "-"}</td>

            <td>

                <span class="order-status">

                    ${customer.status}

                </span>

            </td>

            <td>

                <div class="order-actions">

                    <button
                        class="btn-primary edit-customer-btn"
                        data-id="${customer.id}">

                        Edit

                    </button>

                    <button
                        class="btn-danger delete-customer-btn"
                        data-id="${customer.id}">

                        Delete

                    </button>

                </div>

            </td>

        </tr>

        `;

    });

}

// ==========================================
// Open Customer Modal
// ==========================================

function openCustomerModal() {

    editingCustomer = null;

    document.getElementById("customerModalTitle").textContent =
        "Add Customer";

    document.getElementById("saveCustomerBtn").textContent =
        "Save Customer";

    document.getElementById("customerNameInput").value = "";

    document.getElementById("customerPhone").value = "";

    document.getElementById("customerEmail").value = "";

    document.getElementById("customerCity").value = "";

    document.getElementById("customerAddress").value = "";

    document.getElementById("customerModal").style.display =
        "flex";

}

// ==========================================
// Close Customer Modal
// ==========================================

function closeCustomerModal() {

    document.getElementById("customerModal").style.display =
        "none";

}
// ==========================================
// Save Customer
// ==========================================

async function saveCustomer() {

    try {

        const customer = {

            name: document.getElementById("customerNameInput").value.trim(),

            phone: document.getElementById("customerPhone").value.trim(),

            email: document.getElementById("customerEmail").value.trim(),

            city: document.getElementById("customerCity").value.trim(),

            address: document.getElementById("customerAddress").value.trim(),

            status: "Active"

        };

        // Validation
        if (!customer.name) {

            Toast.show("Customer name is required.", "warning");

            return;

        }

        if (!customer.phone) {

            Toast.show("Phone number is required.", "warning");

            return;

        }

        let result;

        // Update
        if (editingCustomer) {

            result = await ApiService.put(

                `/api/customers/${editingCustomer.id}`,

                customer

            );

        }

        // Create
        else {

            result = await ApiService.post(

                "/api/customers",

                customer

            );

        }

        if (!result.success) {

            Toast.show(result.message, "error");

            return;

        }

        Toast.show(

            editingCustomer
                ? "Customer updated successfully."
                : "Customer created successfully.",

            "success"

        );

        closeCustomerModal();

        editingCustomer = null;

        await loadCustomers();

        // Refresh Dashboard if available
        if (typeof loadDashboard === "function") {

            await loadDashboard();

        }

    }

    catch (err) {

        console.error(err);

        Toast.show("Unable to save customer.", "error");

    }

}
// ==========================================
// Edit Customer
// ==========================================

function editCustomer(id) {

    editingCustomer = customers.find(

        customer => customer.id === id

    );

    if (!editingCustomer) {

        Toast.show("Customer not found.", "error");

        return;

    }

    document.getElementById("customerModalTitle").textContent =
        "Edit Customer";

    document.getElementById("saveCustomerBtn").textContent =
        "Update Customer";

    document.getElementById("customerNameInput").value =
        editingCustomer.name || "";

    document.getElementById("customerPhone").value =
        editingCustomer.phone || "";

    document.getElementById("customerEmail").value =
        editingCustomer.email || "";

    document.getElementById("customerCity").value =
        editingCustomer.city || "";

    document.getElementById("customerAddress").value =
        editingCustomer.address || "";

    document.getElementById("customerModal").style.display =
        "flex";

}

// ==========================================
// Delete Customer
// ==========================================

async function deleteCustomer(id) {

    if (!confirm("Are you sure you want to delete this customer?")) {

        return;

    }

    try {

        const result = await ApiService.delete(

            `/api/customers/${id}`

        );

        if (!result.success) {

            Toast.show(result.message, "error");

            return;

        }

        Toast.show(

            "Customer deleted successfully.",

            "success"

        );

        await loadCustomers();

        if (typeof loadDashboard === "function") {

            await loadDashboard();

        }

    }

    catch (err) {

        console.error(err);

        Toast.show("Unable to delete customer.", "error");

    }

}
// ==========================================
// Event Binding
// ==========================================

document.addEventListener("click", async function (e) {

    // Add Customer
    if (e.target.closest("#addCustomerBtn")) {

        openCustomerModal();

        return;

    }

    // Save Customer
    if (e.target.closest("#saveCustomerBtn")) {

        await saveCustomer();

        return;

    }

    // Close Modal
    if (

        e.target.closest("#cancelCustomerBtn") ||

        e.target.closest("#closeCustomerModal")

    ) {

        closeCustomerModal();

        return;

    }

    // Edit Customer
    const editBtn = e.target.closest(".edit-customer-btn");

    if (editBtn) {

        editCustomer(editBtn.dataset.id);

        return;

    }

    // Delete Customer
    const deleteBtn = e.target.closest(".delete-customer-btn");

    if (deleteBtn) {

        await deleteCustomer(deleteBtn.dataset.id);

        return;

    }

});

// ==========================================
// Refresh
// ==========================================

async function refreshCustomers() {

    await loadCustomers();

    if (typeof loadDashboard === "function") {

        await loadDashboard();

    }

}

// ==========================================
// Auto Initialize
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("customerTable")) {

        loadCustomers();

    }

});