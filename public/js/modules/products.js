// ==========================================
// Products Module
// ==========================================

let editingProductId = null;

// ==========================================
// Load Products
// ==========================================

async function loadProducts() {

    try {

        const result = await ApiService.get("/api/products");

        const table = document.getElementById("productTable");

        if (!table) return;

        table.innerHTML = "";

        const products = result.data || [];

        if (products.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center;padding:25px;">
                        No products available
                    </td>
                </tr>
            `;

            return;

        }

        products.forEach(product => {

            table.innerHTML += `
                <tr>

                    <td>${product.id}</td>

                    <td>${product.name}</td>

                    <td>${product.category}</td>

                    <td>₹${product.price}</td>

                    <td>${product.stock}</td>

                    <td>

                        <span class="status-badge">

                            ${product.status || "Active"}

                        </span>

                    </td>

                    <td>

                        <button
                            class="action-btn edit-btn"
                            onclick="editProduct('${product.id}')">

                            <i class="fa-solid fa-pen"></i>

                        </button>

                        <button
                            class="action-btn delete-btn"
                            onclick="deleteProduct('${product.id}')">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </td>

                </tr>
            `;

        });

    } catch (err) {

        console.error(err);

        Toast.show("Unable to load products.", "error");

    }

}

// ==========================================
// Open Modal
// ==========================================

function openProductModal() {

    editingProductId = null;

    clearProductForm();

    document.getElementById("saveBtn").textContent = "Save Product";

    document.getElementById("productModal").style.display = "flex";

}

// ==========================================
// Close Modal
// ==========================================

function closeProductModal() {

    document.getElementById("productModal").style.display = "none";

    editingProductId = null;

    clearProductForm();

    document.getElementById("saveBtn").textContent = "Save Product";

}

// ==========================================
// Clear Form
// ==========================================

function clearProductForm() {

    document.getElementById("productName").value = "";

    document.getElementById("productCategory").value = "";

    document.getElementById("productPrice").value = "";

    document.getElementById("productStock").value = "";

    document.getElementById("productStatus").value = "Active";

}

// ==========================================
// Save Product
// ==========================================

async function saveProduct() {

    const product = {

        name: document.getElementById("productName").value.trim(),

        category: document.getElementById("productCategory").value.trim(),

        price: Number(document.getElementById("productPrice").value),

        stock: Number(document.getElementById("productStock").value),

        status: document.getElementById("productStatus").value

    };

    if (
        !product.name ||
        !product.category ||
        product.price <= 0 ||
        product.stock < 0
    ) {

        Toast.show("Please fill all fields correctly.", "warning");

        return;

    }

    try {

        let result;

        if (editingProductId) {

            result = await ApiService.put(

                `/api/products/${editingProductId}`,

                product

            );

        } else {

            result = await ApiService.post(

                "/api/products",

                product

            );

        }

        if (result.success) {

            Toast.show(

                editingProductId
                    ? "Product updated successfully."
                    : "Product saved successfully."

            );

            closeProductModal();

            loadProducts();

        } else {

            Toast.show(result.message, "error");

        }

    } catch (err) {

        console.error(err);

        Toast.show("Something went wrong.", "error");

    }

}

// ==========================================
// Edit Product
// ==========================================

async function editProduct(id) {

    try {

        const result = await ApiService.get(

            `/api/products/${id}`

        );

        if (!result.success) {

            Toast.show("Product not found.", "error");

            return;

        }

        const product = result.data;

        editingProductId = product.id;

        document.getElementById("productName").value = product.name;

        document.getElementById("productCategory").value = product.category;

        document.getElementById("productPrice").value = product.price;

        document.getElementById("productStock").value = product.stock;

        document.getElementById("productStatus").value = product.status;

        document.getElementById("saveBtn").textContent = "Update Product";

        document.getElementById("productModal").style.display = "flex";

    } catch (err) {

        console.error(err);

        Toast.show("Unable to load product.", "error");

    }

}

// ==========================================
// Delete Product
// ==========================================

async function deleteProduct(id) {

    if (!confirm("Delete this product?")) {

        return;

    }

    try {

        const result = await ApiService.delete(

            `/api/products/${id}`

        );

        if (result.success) {

            Toast.show("Product deleted successfully.");

            loadProducts();

        } else {

            Toast.show(result.message, "error");

        }

    } catch (err) {

        console.error(err);

        Toast.show("Unable to delete product.", "error");

    }

}

// ==========================================
// Bind Events
// ==========================================

function bindProductEvents() {

    const addBtn = document.getElementById("addProductBtn");

    if (addBtn) {

        addBtn.onclick = openProductModal;

    }

    const closeBtn = document.getElementById("closeModal");

    if (closeBtn) {

        closeBtn.onclick = closeProductModal;

    }

    const cancelBtn = document.getElementById("cancelBtn");

    if (cancelBtn) {

        cancelBtn.onclick = closeProductModal;

    }

    const saveBtn = document.getElementById("saveBtn");

    if (saveBtn) {

        saveBtn.onclick = saveProduct;

    }

}