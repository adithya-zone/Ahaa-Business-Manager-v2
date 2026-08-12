// ==========================================
// Settings Module
// ==========================================

async function loadSettings() {

    try {

        const result = await ApiService.get("/api/settings");

        if (!result.success) {

            Toast.show(result.message, "error");

            return;

        }

        const settings = result.data || {};

        document.getElementById("themeSelect").value =
            settings.theme || "light";

        document.getElementById("themeColor").value =
            settings.themeColor || "#2563eb";

        document.getElementById("companyName").value =
            settings.companyName || "Ahaa Business Manager";

        document.getElementById("companyPhone").value =
            settings.companyPhone || "";

        document.getElementById("companyEmail").value =
            settings.companyEmail || "";

        document.getElementById("companyAddress").value =
            settings.companyAddress || "";

        // Apply saved theme immediately
        if (typeof applyTheme === "function") {

            applyTheme(settings.theme || "light");

        }

    }

    catch (err) {

        console.error(err);

        Toast.show("Unable to load settings.", "error");

    }

}

// ==========================================
// Save Settings
// ==========================================

async function saveSettings() {

    try {

        const payload = {

            theme:
                document.getElementById("themeSelect").value,

            themeColor:
                document.getElementById("themeColor").value,

            companyName:
                document.getElementById("companyName").value,

            companyPhone:
                document.getElementById("companyPhone").value,

            companyEmail:
                document.getElementById("companyEmail").value,

            companyAddress:
                document.getElementById("companyAddress").value

        };

        const result = await ApiService.post(

            "/api/settings",

            payload

        );

        if (!result.success) {

            Toast.show(result.message, "error");

            return;

        }

        // Apply theme instantly
        if (typeof applyTheme === "function") {

            applyTheme(payload.theme);

        }

        Toast.show(

            "Settings saved successfully.",

            "success"

        );

    }

    catch (err) {

        console.error(err);

        Toast.show(

            "Unable to save settings.",

            "error"

        );

    }

}

// ==========================================
// Events
// ==========================================

document.addEventListener("click", function (e) {

    if (e.target.closest("#saveSettingsBtn")) {

        saveSettings();

    }

});