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

                result.message,

                "error"

            );

            return;

        }

        currentInvoice = result.data;

        renderInvoice(currentInvoice);

        document.getElementById(

            "invoiceModal"

        ).style.display = "flex";

    }

    catch (err) {

        console.error(

            "INVOICE ERROR:",

            err

        );

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

    document.getElementById(

        "invoiceNumber"

    ).textContent = invoice.invoiceNo;

    document.getElementById(

        "invoiceDate"

    ).textContent = invoice.date;

    document.getElementById(

        "invoiceCustomer"

    ).textContent = invoice.customer;

    document.getElementById(

        "invoiceProduct"

    ).textContent = invoice.product;

    document.getElementById(

        "invoiceQty"

    ).textContent = invoice.quantity;

    document.getElementById(

        "invoicePrice"

    ).textContent =

        "₹" + invoice.price;

    document.getElementById(

        "invoiceTotal"

    ).textContent =

        "₹" + invoice.total;

    document.getElementById(

        "invoiceGrandTotal"

    ).textContent =

        "₹" + invoice.total;

}

// ==========================================
// Close Invoice
// ==========================================

function closeInvoice() {

    const modal = document.getElementById(

        "invoiceModal"

    );

    if (modal) {

        modal.style.display = "none";

    }

}
// ==========================================
// Print Invoice
// ==========================================

function printInvoice() {

    const content = document.getElementById(

        "invoiceContent"

    ).innerHTML;

    const printWindow = window.open(

        "",

        "_blank",

        "width=900,height=700"

    );

    printWindow.document.write(`

        <html>

        <head>

            <title>Invoice</title>

            <style>

                body{

                    font-family:Arial,sans-serif;

                    padding:30px;

                    color:#222;

                }

                h1{

                    text-align:center;

                    margin-bottom:5px;

                }

                table{

                    width:100%;

                    border-collapse:collapse;

                    margin-top:20px;

                }

                table,th,td{

                    border:1px solid #ccc;

                }

                th,td{

                    padding:10px;

                    text-align:left;

                }

                .invoice-grand-total{

                    margin-top:20px;

                    text-align:right;

                    font-size:18px;

                    font-weight:bold;

                }

                .invoice-footer{

                    margin-top:35px;

                    text-align:center;

                    font-size:14px;

                }

            </style>

        </head>

        <body>

            ${content}

        </body>

        </html>

    `);

    printWindow.document.close();

    printWindow.focus();

    printWindow.print();

}

// ==========================================
// Download PDF
// ==========================================

function downloadInvoice() {

    printInvoice();

}
// ==========================================
// Event Binding
// ==========================================

document.addEventListener("click", function (e) {

    // --------------------------------------
    // Invoice Button
    // --------------------------------------

    const invoiceBtn = e.target.closest(

        ".invoice-btn"

    );

    if (invoiceBtn) {

        openInvoice(

            invoiceBtn.dataset.id

        );

        return;

    }

    // --------------------------------------
    // Print
    // --------------------------------------

    if (

        e.target.closest(

            "#printInvoiceBtn"

        )

    ) {

        printInvoice();

        return;

    }

    // --------------------------------------
    // Download PDF
    // --------------------------------------

    if (

        e.target.closest(

            "#downloadInvoiceBtn"

        )

    ) {

        downloadInvoice();

        return;

    }

    // --------------------------------------
    // Close
    // --------------------------------------

    if (

        e.target.closest(

            "#closeInvoiceModal"

        )

        ||

        e.target.closest(

            "#cancelInvoiceBtn"

        )

    ) {

        closeInvoice();

        return;

    }

});
// ==========================================
// Auto Initialize
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("Invoice Module Loaded");

});

// ==========================================
// ESC Key Support
// ==========================================

document.addEventListener("keydown", function (e) {

    if (

        e.key === "Escape"

    ) {

        closeInvoice();

    }

});

// ==========================================
// Close When Clicking Outside Modal
// ==========================================

window.addEventListener("click", function (e) {

    const modal = document.getElementById(

        "invoiceModal"

    );

    if (

        e.target === modal

    ) {

        closeInvoice();

    }

});