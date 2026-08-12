const orderRepository = require("../repositories/orderRepository");

class OrderService {

    // ======================================
    // Get All Orders
    // ======================================

    async getOrders() {

        return await orderRepository.getAll();

    }

    // ======================================
    // Create Order
    // Supports Multiple Products
    // ======================================

    async createOrder(data) {

        const items = Array.isArray(data.items)
            ? data.items
            : [];

        if (items.length === 0) {

            throw new Error(
                "At least one product is required."
            );

        }

        // --------------------------------------
        // Validate all products and quantities
        // --------------------------------------

        const orderItems = [];

        for (const item of items) {

            const product =
                await orderRepository.getProduct(
                    item.productId
                );

            if (!product) {

                throw new Error(
                    `Product not found: ${item.productId}`
                );

            }

            const quantity =
                Number(item.quantity);

            if (!Number.isFinite(quantity) || quantity <= 0) {

                throw new Error(
                    `Invalid quantity for ${product.name}.`
                );

            }

            if (Number(product.stock) < quantity) {

                throw new Error(
                    `Insufficient stock for ${product.name}.`
                );

            }

            const price =
                Number(product.price) || 0;

            const total =
                price * quantity;

            orderItems.push({

                productId: product.id,

                productName: product.name,

                quantity,

                price,

                total

            });

        }

        // --------------------------------------
        // Get next Order ID
        // --------------------------------------

        const orders =
            await orderRepository.getAll();

        let nextNumber = 1;

        if (orders.length > 0) {

            const numbers = orders

                .map(order => {

                    const parts =
                        String(order.id).split("-");

                    return parseInt(
                        parts[1],
                        10
                    );

                })

                .filter(Number.isFinite);

            if (numbers.length > 0) {

                nextNumber =
                    Math.max(...numbers) + 1;

            }

        }

        const orderId =
            `ORD-${String(nextNumber).padStart(6, "0")}`;

        // --------------------------------------
        // Calculate combined order total
        // --------------------------------------

        const orderTotal =
            orderItems.reduce(

                (sum, item) =>
                    sum + item.total,

                0

            );

        // --------------------------------------
        // Keep old order columns populated
        // for compatibility with existing data/UI
        //
        // For multiple products:
        // productId/productName/quantity represent
        // the first item only.
        // The real item list is order_items.
        // --------------------------------------

        const firstItem =
            orderItems[0];

        const order = {

            id: orderId,

            customer:
                data.customer ||
                "Walk-in Customer",

            productId:
                firstItem.productId,

            productName:
                firstItem.productName,

            quantity:
                firstItem.quantity,

            total:
                orderTotal,

            status:
                data.status ||
                "Pending",

            paymentMethod:
                data.paymentMethod ||
                "Cash",

            createdAt:
                new Date().toISOString()

        };

        // --------------------------------------
        // Save order + items
        // --------------------------------------

        await orderRepository.createOrderWithItems(
            order,
            orderItems
        );

        // --------------------------------------
        // Update stock for every product
        // --------------------------------------

        for (const item of orderItems) {

            const product =
                await orderRepository.getProduct(
                    item.productId
                );

            await orderRepository.updateStock(

                item.productId,

                Number(product.stock) -
                    Number(item.quantity)

            );

        }

        return orderRepository.getById(orderId);

    }

    // ======================================
    // Update Order
    // ======================================

    async updateOrder(id, data) {

        const existing =
            await orderRepository.getById(id);

        if (!existing) {

            throw new Error(
                "Order not found."
            );

        }

        /*
         * For now, keep the existing single-product
         * edit behavior.
         *
         * New orders support multiple products.
         * We will upgrade editing after the new
         * order creation + invoice flow is tested.
         */

        const product =
            await orderRepository.getProduct(
                data.productId
            );

        if (!product) {

            throw new Error(
                "Product not found."
            );

        }

        const quantity =
            Number(data.quantity);

        if (!Number.isFinite(quantity) || quantity <= 0) {

            throw new Error(
                "Invalid quantity."
            );

        }

        // Return old product stock

        const oldProduct =
            await orderRepository.getProduct(
                existing.productId
            );

        if (oldProduct) {

            await orderRepository.updateStock(

                oldProduct.id,

                Number(oldProduct.stock) +
                    Number(existing.quantity)

            );

        }

        // Check new product stock

        const refreshedProduct =
            await orderRepository.getProduct(
                product.id
            );

        if (
            Number(refreshedProduct.stock) <
            quantity
        ) {

            // Restore old stock if validation fails

            if (oldProduct) {

                await orderRepository.updateStock(

                    oldProduct.id,

                    Number(refreshedProduct.stock) -
                        Number(existing.quantity)

                );

            }

            throw new Error(
                "Insufficient stock."
            );

        }

        const updatedOrder = {

            customer:
                data.customer,

            productId:
                product.id,

            productName:
                product.name,

            quantity,

            total:
                Number(product.price) *
                quantity,

            status:
                data.status,

            paymentMethod:
                data.paymentMethod ||
                "Cash"

        };

        await orderRepository.update(

            id,

            updatedOrder

        );

        await orderRepository.updateStock(

            product.id,

            Number(refreshedProduct.stock) -
                quantity

        );

        return orderRepository.getById(id);

    }

    // ======================================
    // Delete Order
    // ======================================

    async deleteOrder(id) {

        const order =
            await orderRepository.getById(id);

        if (!order) {

            throw new Error(
                "Order not found."
            );

        }

        // --------------------------------------
        // Get all items belonging to the order
        // --------------------------------------

        const items =
            await orderRepository.getOrderItems(id);

        // --------------------------------------
        // Restore stock for every item
        // --------------------------------------

        if (items.length > 0) {

            for (const item of items) {

                const product =
                    await orderRepository.getProduct(
                        item.productId
                    );

                if (product) {

                    await orderRepository.updateStock(

                        product.id,

                        Number(product.stock) +
                            Number(item.quantity)

                    );

                }

            }

        } else {

            // Backward compatibility for old orders

            const product =
                await orderRepository.getProduct(
                    order.productId
                );

            if (product) {

                await orderRepository.updateStock(

                    product.id,

                    Number(product.stock) +
                        Number(order.quantity)

                );

            }

        }

        // --------------------------------------
        // Delete order
        // --------------------------------------

        await orderRepository.delete(id);

        return true;

    }

}

module.exports = new OrderService();