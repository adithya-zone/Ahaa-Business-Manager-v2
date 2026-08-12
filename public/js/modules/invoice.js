// ==========================================
// Invoice Module
// ==========================================

let currentInvoice = null;

// ==========================================
// Open Invoice
// ==========================================

async function openInvoice(orderId) {

    try {

        const result = await ApiService.get(
            `/api/invoice/${orderId}`
        );

        if (!result.success) {

            Toast.show(
                result.message || "Unable to load invoice.",
                "error"
            );

            return;

        }

        currentInvoice = result.data;

        renderInvoice(currentInvoice);

        const modal =
            document.getElementById("invoiceModal");

        if (modal) {

            modal.style.display = "flex";

        }

    }

    catch (err) {

        console.error("Invoice Error:", err);

        Toast.show(
            "Unable to load invoice.",
            "error"
        );

    }

}

// ==========================================
// Render Invoice
// ==========================================

function renderInvoice(invoice) {

    // --------------------------------------
    // Company Details
    // --------------------------------------

    document.getElementById(
        "invoiceCompanyName"
    ).textContent =
        invoice.companyName || "AHAA BUSINESS MANAGER";

    document.getElementById(
        "invoiceCompanyAddress"
    ).textContent =
        invoice.companyAddress || "";

    document.getElementById(
        "invoiceCompanyPhone"
    ).textContent =
        invoice.companyPhone || "";

    document.getElementById(
        "invoiceCompanyEmail"
    ).textContent =
        invoice.companyEmail || "";

    // --------------------------------------
    // Invoice Details
    // --------------------------------------

    document.getElementById(
        "invoiceNumber"
    ).textContent =
        invoice.invoiceNo || "";

    document.getElementById(
        "invoiceDate"
    ).textContent =
        invoice.date || "";

    document.getElementById(
        "invoiceCustomer"
    ).textContent =
        invoice.customer || "Walk-in Customer";

    document.getElementById(
        "invoiceStatus"
    ).textContent =
        invoice.status || "Pending";

    // --------------------------------------
    // Products
    // --------------------------------------

    const tbody =
        document.getElementById("invoiceItems");

    if (!tbody) {

        console.error(
            "Invoice items table body not found."
        );

        return;

    }

    tbody.innerHTML = "";

    const items =
        Array.isArray(invoice.items)
            ? invoice.items
            : [];

    if (items.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    style="text-align:center;padding:20px;">

                    No products found.

                </td>

            </tr>

        `;

    }

    else {

        items.forEach((item, index) => {

            const quantity =
                Number(item.quantity) || 0;

            const price =
                Number(item.price) || 0;

            const total =
                Number(item.total) ||
                quantity * price;

            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td>
                    ${index + 1}.
                    ${item.product || "Product"}
                </td>

                <td>
                    ${quantity}
                </td>

                <td>
                    ₹${price.toFixed(2)}
                </td>

                <td>
                    ₹${total.toFixed(2)}
                </td>

            `;

            tbody.appendChild(row);

        });

    }

    // --------------------------------------
    // Totals
    // --------------------------------------

    const subtotal =
        Number(invoice.subtotal) || 0;

    const gst =
        Number(invoice.gst) || 0;

    const grandTotal =
        Number(invoice.grandTotal) || subtotal;

    document.getElementById(
        "invoiceTotalAmount"
    ).textContent =
        `₹${subtotal.toFixed(2)}`;

    document.getElementById(
        "invoiceGST"
    ).textContent =
        `₹${gst.toFixed(2)}`;

    document.getElementById(
        "invoiceGrandTotal"
    ).textContent =
        `₹${grandTotal.toFixed(2)}`;

}

// ==========================================
// Close Invoice
// ==========================================

function closeInvoice() {

    const modal =
        document.getElementById("invoiceModal");

    if (modal) {

        modal.style.display = "none";

    }

}

// ==========================================
// Print Invoice
// ==========================================

function printInvoice() {

    if (!currentInvoice) {

        Toast.show(
            "No invoice loaded.",
            "error"
        );

        return;

    }

    const content =
        document.getElementById(
            "invoiceContent"
        ).innerHTML;

    const win =
        window.open(
            "",
            "_blank",
            "width=900,height=700"
        );

    if (!win) {

        Toast.show(
            "Please allow popups to print the invoice.",
            "warning"
        );

        return;

    }

    win.document.write(`

        <html>

        <head>

            <title>
                Invoice-${currentInvoice.invoiceNo}
            </title>

            <style>

                body {

                    font-family:
                        Arial,
                        sans-serif;

                    padding: 30px;

                    color: #222;

                }

                table {

                    width: 100%;

                    border-collapse: collapse;

                    margin-top: 20px;

                }

                table,
                th,
                td {

                    border: 1px solid #ddd;

                }

                th,
                td {

                    padding: 10px;

                    text-align: left;

                }

                th {

                    background: #f5f5f5;

                }

                .invoice-company {

                    text-align: center;

                    margin-bottom: 20px;

                }

                .invoice-company h1 {

                    margin-bottom: 5px;

                }

                .invoice-footer {

                    margin-top: 40px;

                    text-align: center;

                    color: #666;

                }

                .grand-total {

                    font-weight: bold;

                    font-size: 18px;

                }

            </style>

        </head>

        <body>

            ${content}

        </body>

        </html>

    `);

    win.document.close();

    win.focus();

    win.print();

}

// ==========================================
// Download PDF
// ==========================================

function downloadInvoice() {

    if (!currentInvoice) {

        Toast.show(
            "No invoice loaded.",
            "error"
        );

        return;

    }

    const element =
        document.getElementById(
            "invoiceContent"
        );

    html2pdf()

        .set({

            margin: 10,

            filename:
                `Invoice-${currentInvoice.invoiceNo}.pdf`,

            image: {

                type: "jpeg",

                quality: 1

            },

            html2canvas: {

                scale: 2

            },

            jsPDF: {

                unit: "mm",

                format: "a4",

                orientation: "portrait"

            }

        })

        .from(element)

        .save();

}

// ==========================================
// Event Binding
// ==========================================

document.addEventListener(
    "click",
    function (e) {

        // Invoice button

        const invoiceBtn =
            e.target.closest(".invoice-btn");

        if (invoiceBtn) {

            openInvoice(
                invoiceBtn.dataset.id
            );

            return;

        }

        // Close

        if (
            e.target.closest(
                "#closeInvoiceModal"
            )
        ) {

            closeInvoice();

            return;

        }

        // Print

        if (
            e.target.closest(
                "#printInvoiceBtn"
            )
        ) {

            printInvoice();

            return;

        }

        // Download PDF

        if (
            e.target.closest(
                "#downloadInvoiceBtn"
            )
        ) {

            downloadInvoice();

            return;

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

            closeInvoice();

        }

    }
);

// ==========================================
// Click Outside Modal
// ==========================================

window.addEventListener(
    "click",
    function (e) {

        const modal =
            document.getElementById(
                "invoiceModal"
            );

        if (
            modal &&
            e.target === modal
        ) {

            closeInvoice();

        }

    }
);

console.log(
    "✅ Invoice Module Loaded"
);