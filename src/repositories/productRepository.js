const BaseRepository = require("./baseRepository");

class ProductRepository extends BaseRepository {

    // ======================================
    // Get All Products
    // ======================================

    async getAll() {

        return await this.all(

            `SELECT *
             FROM products
             ORDER BY createdAt DESC`

        );

    }

    // ======================================
    // Get Product By ID
    // ======================================

    async getById(id) {

        return await this.get(

            `SELECT *
             FROM products
             WHERE id = ?`,

            [id]

        );

    }

    // ======================================
    // Get Last Product
    // ======================================

    async getLastProduct() {

        return await this.get(

            `SELECT id
             FROM products
             ORDER BY id DESC
             LIMIT 1`

        );

    }

    // ======================================
    // Search Products
    // ======================================

    async search(keyword) {

        return await this.all(

            `SELECT *
             FROM products
             WHERE
                 name LIKE ?
                 OR category LIKE ?
             ORDER BY name ASC`,

            [

                `%${keyword}%`,

                `%${keyword}%`

            ]

        );

    }

    // ======================================
    // Create Product
    // ======================================

    async create(product) {

        await this.run(

            `INSERT INTO products
            (
                id,
                name,
                category,
                price,
                stock,
                status,
                createdAt
            )
            VALUES
            (?, ?, ?, ?, ?, ?, ?)`,

            [

                product.id,

                product.name,

                product.category,

                product.price,

                product.stock,

                product.status,

                product.createdAt

            ]

        );

        return product;

    }

    // ======================================
    // Update Product
    // ======================================

    async update(id, product) {

        await this.run(

            `UPDATE products

            SET

                name=?,

                category=?,

                price=?,

                stock=?,

                status=?

            WHERE id=?`,

            [

                product.name,

                product.category,

                product.price,

                product.stock,

                product.status,

                id

            ]

        );

    }
// ======================================
// Update Product Stock
// ======================================

async updateStock(id, stock) {

    await this.run(

        `UPDATE products
         SET stock = ?
         WHERE id = ?`,

        [

            stock,

            id

        ]

    );

}
    // ======================================
    // Delete Product
    // ======================================

    async delete(id) {

        await this.run(

            `DELETE FROM products
             WHERE id=?`,

            [id]

        );

    }

}

module.exports = new ProductRepository();