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

            "Invoice Error:",

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

    // -------------------------
    // Company Details
    // -------------------------

    document.getElementById(

        "invoiceCompanyName"

    ).textContent =

        invoice.companyName;

    document.getElementById(

        "invoiceCompanyAddress"

    ).textContent =

        invoice.companyAddress;

    document.getElementById(

        "invoiceCompanyPhone"

    ).textContent =

        invoice.companyPhone;

    document.getElementById(

        "invoiceCompanyEmail"

    ).textContent =

        invoice.companyEmail;

    // -------------------------
    // Invoice Details
    // -------------------------

    document.getElementById(

        "invoiceNumber"

    ).textContent =

        invoice.invoiceNo;

    document.getElementById(

        "invoiceDate"

    ).textContent =

        invoice.date;

    document.getElementById(

        "invoiceCustomer"

    ).textContent =

        invoice.customer;

    document.getElementById(

        "invoiceProduct"

    ).textContent =

        invoice.product;

    document.getElementById(

        "invoiceQty"

    ).textContent =

        invoice.quantity;

    document.getElementById(

        "invoicePrice"

    ).textContent =

        "₹" + Number(invoice.price).toFixed(2);

    document.getElementById(

        "invoiceTotal"

    ).textContent =

        "₹" + Number(invoice.total).toFixed(2);

    document.getElementById(

        "invoiceTotalAmount"

    ).textContent =

        "₹" + Number(invoice.total).toFixed(2);

    document.getElementById(

        "invoiceGrandTotal"

    ).textContent =

        "₹" + Number(invoice.total).toFixed(2);

}

// ==========================================
// Close Invoice
// ==========================================

function closeInvoice() {

    document.getElementById(

        "invoiceModal"

    ).style.display = "none";

}

// ==========================================
// Print Invoice
// ==========================================

function printInvoice() {

    const content = document.getElementById(

        "invoiceContent"

    ).innerHTML;

    const win = window.open(

        "",

        "_blank",

        "width=900,height=700"

    );

    win.document.write(`

        <html>

        <head>

            <title>Invoice</title>

            <link rel="stylesheet" href="css/style.css">

            <style>

                body{

                    font-family:Poppins,Arial,sans-serif;

                    padding:30px;

                    color:#222;

                }

                table{

                    width:100%;

                    border-collapse:collapse;

                    margin-top:20px;

                }

                table,th,td{

                    border:1px solid #ddd;

                }

                th,td{

                    padding:10px;

                    text-align:left;

                }

                .invoice-header{

                    text-align:center;

                    margin-bottom:25px;

                }

                .invoice-footer{

                    margin-top:40px;

                    text-align:center;

                    color:#666;

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

    const element = document.getElementById(

        "invoiceContent"

    );

    html2pdf()

        .set({

            margin: 10,

            filename: `Invoice-${currentInvoice.invoiceNo}.pdf`,

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

        const invoiceBtn = e.target.closest(

            ".invoice-btn"

        );

        if (invoiceBtn) {

            openInvoice(

                invoiceBtn.dataset.id

            );

            return;

        }

        if (

            e.target.closest(

                "#closeInvoiceModal"

            )

        ) {

            closeInvoice();

            return;

        }

        if (

            e.target.closest(

                "#printInvoiceBtn"

            )

        ) {

            printInvoice();

            return;

        }

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
// ESC Key Support
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

        const modal = document.getElementById(

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

console.log("✅ Invoice Module Loaded");