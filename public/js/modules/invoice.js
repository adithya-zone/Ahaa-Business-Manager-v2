// ==========================================
// Invoice Module
// ==========================================

let currentInvoice = null;


// ==========================================
// Open Invoice
// ==========================================

async function openInvoice(orderId) {

    try {

        const result =
            await ApiService.get(
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


        renderInvoice(
            currentInvoice
        );


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

    // ======================================
    // Company Details
    // ======================================

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


    // ======================================
    // Invoice Information
    // ======================================

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
        "invoiceStatus"
    ).textContent =
        invoice.status || "Pending";


    // ======================================
    // Products
    // ======================================

    const tbody =
        document.getElementById(
            "invoiceItemsBody"
        );


    tbody.innerHTML = "";


    const items =
        invoice.items || [];


    if (items.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:15px;
                    "
                >

                    No products found

                </td>

            </tr>

        `;

    }


    // ======================================
    // Render Every Product
    // ======================================

    items.forEach((item, index) => {

        const product =
            item.product || "Unknown Product";


        const weight =
            Number(
                item.weightKg || 0
            );


        const quantity =
            Number(
                item.quantity || 0
            );


        const price =
            Number(
                item.price || 0
            );


        const total =
            Number(
                item.total || 0
            );


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                ${index + 1}.
                ${product}

            </td>


            <td>

                ${weight.toFixed(3)} KG

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


    // ======================================
    // Totals
    // ======================================

    const subtotal =
        Number(
            invoice.subtotal || 0
        );


    const gst =
        Number(
            invoice.gst || 0
        );


    const grandTotal =
        Number(
            invoice.grandTotal ||
            subtotal + gst
        );


    document.getElementById(
        "invoiceTotalAmount"
    ).textContent =
        "₹" + subtotal.toFixed(2);


    document.getElementById(
        "invoiceGst"
    ).textContent =
        "₹" + gst.toFixed(2);


    document.getElementById(
        "invoiceGrandTotal"
    ).textContent =
        "₹" + grandTotal.toFixed(2);

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


    win.document.write(`

        <html>

        <head>

            <title>Invoice</title>

            <style>

                body {

                    font-family:
                        Poppins,
                        Arial,
                        sans-serif;

                    padding:30px;

                    color:#222;

                }


                table {

                    width:100%;

                    border-collapse:
                        collapse;

                    margin-top:20px;

                }


                table,
                th,
                td {

                    border:
                        1px solid #ddd;

                }


                th,
                td {

                    padding:10px;

                    text-align:left;

                }


                .invoice-header {

                    text-align:center;

                    margin-bottom:25px;

                }


                .invoice-footer {

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

    const element =
        document.getElementById(
            "invoiceContent"
        );


    if (!currentInvoice) {

        Toast.show(
            "Invoice data not available.",
            "error"
        );

        return;

    }


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

        // -----------------------------
        // Invoice Button
        // -----------------------------

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


        // -----------------------------
        // Close Invoice
        // -----------------------------

        if (

            e.target.closest(
                "#closeInvoiceModal"
            )

        ) {

            closeInvoice();

            return;

        }


        // -----------------------------
        // Print
        // -----------------------------

        if (

            e.target.closest(
                "#printInvoiceBtn"
            )

        ) {

            printInvoice();

            return;

        }


        // -----------------------------
        // Download PDF
        // -----------------------------

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