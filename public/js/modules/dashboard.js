// ==========================================
// Dashboard Module
// ==========================================

async function loadDashboard() {

    // Dashboard page not loaded
    if (!document.getElementById("totalProducts")) {

        return;

    }

    await loadDashboardStats();

}

// ==========================================
// Dashboard Statistics
// ==========================================

async function loadDashboardStats() {

    try {

        // Dashboard page not loaded
        if (!document.getElementById("totalProducts")) {

            return;

        }

        const result = await ApiService.get("/api/dashboard");

        if (!result.success) {

            Toast.show(result.message, "error");

            return;

        }

        const data = result.data;

        const setText = (id, value) => {

            const element = document.getElementById(id);

            if (element) {

                element.textContent = value;

            }

        };

        setText(

            "totalProducts",

            data.totalProducts

        );

        setText(

            "totalOrders",

            data.totalOrders

        );

        setText(

            "totalCustomers",

            data.totalCustomers

        );

        setText(

            "totalRevenue",

            `₹${Number(data.totalRevenue).toLocaleString()}`

        );

        setText(

            "todaySales",

            `₹${Number(data.todaySales).toLocaleString()}`

        );

        setText(

            "monthlySales",

            `₹${Number(data.monthlySales).toLocaleString()}`

        );

    }

    catch (err) {

        console.error(err);

        Toast.show(

            "Unable to load dashboard.",

            "error"

        );

    }

}