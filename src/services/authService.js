const bcrypt = require("bcrypt");

const authRepository = require("../repositories/authRepository");

class AuthService {

    // ==========================================
    // Login
    // ==========================================

    async login(username, password) {

        const user = await authRepository.findByUsername(username);

        if (!user) {

            throw new Error("Invalid username or password.");

        }

        if (user.status !== "Active") {

            throw new Error("User account is inactive.");

        }

        const passwordMatch = await bcrypt.compare(

            password,

            user.password

        );

        if (!passwordMatch) {

            throw new Error("Invalid username or password.");

        }

        return {

            id: user.id,

            username: user.username,

            role: user.role

        };

    }

}

module.exports = new AuthService();