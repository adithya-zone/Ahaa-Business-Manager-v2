const BaseRepository = require("./baseRepository");

class AuthRepository extends BaseRepository {

    constructor() {

        super("users");

    }

    // ==========================================
    // Find User By Username
    // ==========================================

    async findByUsername(username) {

        return await this.get(

            `SELECT * FROM users WHERE username = ?`,

            [username]

        );

    }

    // ==========================================
    // Find User By ID
    // ==========================================

    async findById(id) {

        return await this.get(

            `SELECT * FROM users WHERE id = ?`,

            [id]

        );

    }

    // ==========================================
    // Create User
    // ==========================================

    async create(user) {

        await this.run(

            `
            INSERT INTO users
            (
                id,
                username,
                password,
                role,
                status,
                createdAt
            )
            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
            )
            `,
            [

                user.id,

                user.username,

                user.password,

                user.role,

                user.status,

                user.createdAt

            ]

        );

        return user;

    }

}

module.exports = new AuthRepository();