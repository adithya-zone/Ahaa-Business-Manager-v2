// ==========================================
// Ahaa Business Manager ERP v2
// app.js
// ==========================================

// Current Page
let currentPage = "dashboard";

// ==========================================
// Load HTML Component
// ==========================================

async function loadComponent(id, file) {

    try {

        const response = await fetch(file);

        const html = await response.text();

        document.getElementById(id).innerHTML = html;

    } catch (err) {

        console.error("Component Load Error:", err);

    }

}

// ==========================================
// Load Page
// ==========================================

async function loadPage(page) {

    currentPage = page;

    try {

        const response = await fetch(`components/${page}.html`);

        const html = await response.text();

        document.getElementById("content").innerHTML = html;

        updateTitle(page);

        updateActiveMenu(page);

        switch (page) {

    case "dashboard":

        if (typeof loadDashboard === "function") {

            loadDashboard();

        }

        break;

    case "products":

        if (typeof loadProducts === "function") {

            loadProducts();

        }

        if (typeof bindProductEvents === "function") {

            bindProductEvents();

        }

        break;

case "orders":

    if (typeof initializeOrders === "function") {

        initializeOrders();

    }

    break;

    case "customers":

        if (typeof loadCustomers === "function") {

            loadCustomers();

        }

        break;

        case "reports":
        if (typeof loadReports === "function") {
            loadReports();
        }
        break;   

        case "settings":

    if (typeof loadSettings === "function") {

        loadSettings();

    }

    break;

}

    } catch (err) {

        console.error(err);

    }

}

// ==========================================
// Update Page Title
// ==========================================

function updateTitle(page) {

    const titles = {

        dashboard: "Dashboard",

        products: "Products",

        orders: "Orders",

        customers: "Customers",

        inventory: "Inventory",

        reports: "Reports",

        settings: "Settings"

    };

    document.getElementById("pageTitle").textContent =
        titles[page] || "Dashboard";

}

// ==========================================
// Active Sidebar Menu
// ==========================================

function updateActiveMenu(page) {

    document.querySelectorAll(".menu a").forEach(link => {

        link.classList.remove("active");

        if (link.dataset.page === page) {

            link.classList.add("active");

        }

    });

}

// ==========================================
// Menu Click Events
// ==========================================

function bindMenu() {

    document.querySelectorAll(".menu a").forEach(link => {

        link.addEventListener("click", (e) => {

            e.preventDefault();

            loadPage(link.dataset.page);

        });

    });

}

// ==========================================
// Initialize App
// ==========================================

async function init() {

    // Load saved theme first
    try {

        const result = await ApiService.get("/api/settings");

        if (result.success && result.data.theme === "dark") {

            document.body.classList.add("dark-theme");

        }

    } catch (err) {

        console.error("Theme Load Error:", err);

    }

    await loadComponent(
        "sidebar",
        "components/sidebar.html"
    );
    await loadComponent(
        "topbar",
        "components/topbar.html"
    );

    if (typeof bindLogoutButton === "function") {

    bindLogoutButton();

}
    await loadComponent(
        "modalContainer",
        "components/productModal.html"
    );

    // Customer Modal
    document.getElementById("modalContainer").innerHTML +=
        await (await fetch("components/customerModal.html")).text();

    // Order Modal
    await loadComponent(
        "orderModalContainer",
        "components/orderModal.html"
    );

    // Invoice Modal
    await loadComponent(
        "invoiceModalContainer",
        "components/invoiceModal.html"
    );

    bindMenu();

    loadPage("dashboard");

}

// ==========================================
// Application Startup
// ==========================================

async function startApplication() {

    const authenticated =
        await checkAuthentication();

    if (!authenticated) {

        await showLoginPage();

        return;

    }

    await loadERPApplication();

}

window.onload = startApplication;

// ==========================================
// Apply Theme
// ==========================================

function applyTheme(theme) {

    if (theme === "dark") {

        document.body.classList.add("dark-theme");

    } else {

        document.body.classList.remove("dark-theme");

    }

}
