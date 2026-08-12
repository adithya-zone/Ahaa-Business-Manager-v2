// ==========================================
// Authentication Module
// ==========================================

let loginInitialized = false;


// ==========================================
// Show Login Page
// ==========================================

async function showLoginPage() {

    const loginContainer =
        document.getElementById("loginContainer");

    const app =
        document.getElementById("app");

    if (!loginContainer) {

        console.error("Login container not found.");

        return;

    }

    if (app) {

        app.style.display = "none";

    }

    loginContainer.style.display = "flex";

    try {

        const response =
            await fetch("components/login.html");

        if (!response.ok) {

            throw new Error(
                "Unable to load login page."
            );

        }

        const html =
            await response.text();

        loginContainer.innerHTML = html;

        loginInitialized = false;

        bindLoginEvents();

    }

    catch (err) {

        console.error(
            "Login Page Error:",
            err
        );

    }

}


// ==========================================
// Hide Login Page
// ==========================================

function hideLoginPage() {

    const loginContainer =
        document.getElementById("loginContainer");

    const app =
        document.getElementById("app");

    if (loginContainer) {

        loginContainer.style.display = "none";

    }

    if (app) {

        app.style.display = "flex";

    }

}


// ==========================================
// Bind Login Events
// ==========================================

function bindLoginEvents() {

    const form =
        document.getElementById("loginForm");

    const togglePassword =
        document.getElementById("togglePassword");

    if (!form) {

        return;

    }

    if (loginInitialized) {

        return;

    }

    loginInitialized = true;


    // Login submit

    form.addEventListener(
        "submit",
        handleLogin
    );


    // Password visibility

    if (togglePassword) {

        togglePassword.addEventListener(
            "click",
            () => {

                const password =
                    document.getElementById(
                        "loginPassword"
                    );

                const icon =
                    togglePassword.querySelector("i");

                if (password.type === "password") {

                    password.type = "text";

                    icon.className =
                        "fa-solid fa-eye-slash";

                }

                else {

                    password.type = "password";

                    icon.className =
                        "fa-solid fa-eye";

                }

            }
        );

    }

}


// ==========================================
// Handle Login
// ==========================================

async function handleLogin(e) {

    e.preventDefault();

    const username =
        document
            .getElementById("loginUsername")
            .value
            .trim();

    const password =
        document
            .getElementById("loginPassword")
            .value;

    const loginBtn =
        document.getElementById("loginBtn");

    const loginBtnText =
        document.getElementById("loginBtnText");

    const loginLoading =
        document.getElementById("loginLoading");


    if (!username || !password) {

        showLoginError(
            "Please enter your username and password."
        );

        return;

    }


    loginBtn.disabled = true;

    loginBtnText.style.display = "none";

    loginLoading.style.display = "inline";


    try {

        const result =
            await ApiService.post(
                "/api/auth/login",
                {
                    username,
                    password
                }
            );


        if (!result.success) {

            throw new Error(
                result.message ||
                "Invalid username or password."
            );

        }


        hideLoginPage();

        loginInitialized = false;

        await loadERPApplication();

    }

    catch (err) {

        console.error(
            "Login Error:",
            err
        );

        showLoginError(
            err.message ||
            "Unable to login."
        );

    }

    finally {

        loginBtn.disabled = false;

        loginBtnText.style.display = "inline";

        loginLoading.style.display = "none";

    }

}


// ==========================================
// Login Error
// ==========================================

function showLoginError(message) {

    const errorElement =
        document.getElementById("loginError");

    if (!errorElement) {

        return;

    }

    errorElement.textContent = message;

    errorElement.style.display = "block";

}


// ==========================================
// Check Authentication
// ==========================================

async function checkAuthentication() {

    try {

        const result =
            await ApiService.get(
                "/api/auth/me"
            );

        return (
            result.success &&
            result.data
        );

    }

    catch (err) {

        return false;

    }

}


// ==========================================
// Logout
// ==========================================

async function logout() {

    try {

        const result =
            await ApiService.post(
                "/api/auth/logout",
                {}
            );

        if (!result.success) {

            throw new Error(
                result.message ||
                "Logout failed."
            );

        }

        // Session has been destroyed.
        // Reload so the startup authentication
        // check sends the user back to login.

        window.location.href = "/";

    }

    catch (err) {

        console.error(
            "Logout Error:",
            err
        );

        alert(
            err.message ||
            "Unable to logout."
        );

    }

}


// ==========================================
// Bind Logout Button
// ==========================================

function bindLogoutButton() {

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (!logoutBtn) {

        console.warn(
            "Logout button not found."
        );

        return;

    }


    // Prevent duplicate listeners

    if (
        logoutBtn.dataset.bound === "true"
    ) {

        return;

    }

    logoutBtn.dataset.bound = "true";


    logoutBtn.addEventListener(
        "click",
        async function () {

            const confirmed =
                window.confirm(
                    "Are you sure you want to logout?"
                );

            if (!confirmed) {

                return;

            }

            logoutBtn.disabled = true;

            await logout();

        }
    );

}


// ==========================================
// Load ERP Application
// ==========================================

async function loadERPApplication() {

    const loginContainer =
        document.getElementById(
            "loginContainer"
        );

    if (loginContainer) {

        loginContainer.style.display = "none";

    }

    const app =
        document.getElementById("app");

    if (app) {

        app.style.display = "flex";

    }

    if (typeof init === "function") {

        await init();

    }

}


// ==========================================
// Expose Functions
// ==========================================

window.showLoginPage =
    showLoginPage;

window.hideLoginPage =
    hideLoginPage;

window.checkAuthentication =
    checkAuthentication;

window.logout =
    logout;

window.loadERPApplication =
    loadERPApplication;

window.bindLogoutButton =
    bindLogoutButton;