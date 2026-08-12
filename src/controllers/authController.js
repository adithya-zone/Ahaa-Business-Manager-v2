const authService = require("../services/authService");

// ==========================================
// Login
// ==========================================

async function login(req, res) {

    try {

        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {

            return res.status(400).json({

                success: false,

                message: "Username and password are required."

            });

        }

        // Authenticate user
        const user = await authService.login(

            username.trim(),

            password

        );

        // Create server-side session
        req.session.user = {

            id: user.id,

            username: user.username,

            role: user.role

        };

        return res.json({

            success: true,

            message: "Login successful.",

            data: {

                id: user.id,

                username: user.username,

                role: user.role

            }

        });

    }

    catch (err) {

        console.error("Login Error:", err.message);

        return res.status(401).json({

            success: false,

            message: err.message || "Invalid username or password."

        });

    }

}

// ==========================================
// Current User
// ==========================================

function getCurrentUser(req, res) {

    if (!req.session.user) {

        return res.status(401).json({

            success: false,

            message: "Not authenticated."

        });

    }

    return res.json({

        success: true,

        data: req.session.user

    });

}

// ==========================================
// Logout
// ==========================================

function logout(req, res) {

    req.session.destroy((err) => {

        if (err) {

            console.error("Logout Error:", err);

            return res.status(500).json({

                success: false,

                message: "Unable to logout."

            });

        }

        res.clearCookie("connect.sid");

        return res.json({

            success: true,

            message: "Logout successful."

        });

    });

}

module.exports = {

    login,

    getCurrentUser,

    logout

};