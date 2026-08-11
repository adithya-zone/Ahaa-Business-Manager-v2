// ==========================================
// Reports Module
// ==========================================

async function loadReports() {

    try {

        const result = await ApiService.get(

            "/api/reports"

        );

        if (!result.success) {

            Toast.show(

                result.message,

                "error"

            );

            return;

        }

        const report = result.data;

        loadSummary(

            report.summary

        );

        loadSalesTable(

            report.sales

        );

    }

    catch (err) {

        console.error(err);

        Toast.show(

            "Unable to load reports.",

            "error"

        );

    }

}

// ==========================================
// Summary Cards
// ==========================================

function loadSummary(summary) {

    document.getElementById(

        "todaySales"

    ).textContent =

        "₹" + Number(summary.todaySales).toLocaleString();

    document.getElementById(

        "monthlySales"

    ).textContent =

        "₹" + Number(summary.monthlySales).toLocaleString();

    document.getElementById(

        "reportOrders"

    ).textContent =

        summary.totalOrders;

    document.getElementById(

        "reportRevenue"

    ).textContent =

        "₹" + Number(summary.totalRevenue).toLocaleString();

}

// ==========================================
// Sales Table
// ==========================================

function loadSalesTable(sales) {

    const table = document.getElementById(

        "reportTable"

    );

    if (!table) return;

    table.innerHTML = "";

    if (sales.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="7"
                    style="text-align:center;padding:30px;">

                    No sales available

                </td>

            </tr>

        `;

        return;

    }

    sales.forEach(order => {

        table.innerHTML += `

            <tr>

                <td>

                    ${new Date(order.createdAt).toLocaleDateString()}

                </td>

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

                    ₹${Number(order.total).toLocaleString()}

                </td>

                <td>

                    <span class="status-badge">

                        ${order.status}

                    </span>

                </td>

            </tr>

        `;

    });

}

// ==========================================
// Auto Initialize
// ==========================================

document.addEventListener(

    "DOMContentLoaded",

    () => {

        if (

            document.getElementById(

                "reportTable"

            )

        ) {

            loadReports();

        }

    }

);