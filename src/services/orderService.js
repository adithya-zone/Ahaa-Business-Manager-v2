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
    // ======================================

    async createOrder(data) {

        const product = await orderRepository.getProduct(data.productId);

        if (!product) {

            throw new Error("Product not found.");

        }

        if (Number(product.stock) < Number(data.quantity)) {

            throw new Error("Insufficient stock.");

        }

        // Get next Order ID
        const orders = await orderRepository.getAll();

        let nextNumber = 1;

        if (orders.length > 0) {

            const maxNumber = Math.max(

                ...orders.map(order => {

                    const parts = order.id.split("-");

                    return parseInt(parts[1], 10);

                })

            );

            nextNumber = maxNumber + 1;

        }

        const order = {

            id: `ORD-${String(nextNumber).padStart(6, "0")}`,

            customer: data.customer || "Walk-in Customer",

            productId: product.id,

            productName: product.name,

            quantity: Number(data.quantity),

            total: Number(product.price) * Number(data.quantity),

            status: data.status || "Pending",

            paymentMethod: data.paymentMethod || "Cash",

            createdAt: new Date().toISOString()

        };

        // Save Order
        await orderRepository.create(order);

        // Update Stock
        await orderRepository.updateStock(

            product.id,

            Number(product.stock) - Number(order.quantity)

        );

        return order;

    }

    // ======================================
    // Update Order
    // ======================================

    async updateOrder(id, data) {

        const existing = await orderRepository.getById(id);

        if (!existing) {

            throw new Error("Order not found.");

        }

        const oldProduct = await orderRepository.getProduct(existing.productId);

        if (oldProduct) {

            await orderRepository.updateStock(

                oldProduct.id,

                Number(oldProduct.stock) + Number(existing.quantity)

            );

        }

        const newProduct = await orderRepository.getProduct(data.productId);

        if (!newProduct) {

            throw new Error("Product not found.");

        }

        if (Number(newProduct.stock) < Number(data.quantity)) {

            throw new Error("Insufficient stock.");

        }

        const updatedOrder = {

            customer: data.customer,

            productId: newProduct.id,

            productName: newProduct.name,

            quantity: Number(data.quantity),

            total: Number(newProduct.price) * Number(data.quantity),

            status: data.status,

            paymentMethod: data.paymentMethod || "Cash"

        };

        await orderRepository.update(id, updatedOrder);

        await orderRepository.updateStock(

            newProduct.id,

            Number(newProduct.stock) - Number(data.quantity)

        );

        return await orderRepository.getById(id);

    }

    // ======================================
    // Delete Order
    // ======================================

    async deleteOrder(id) {

        const order = await orderRepository.getById(id);

        if (!order) {

            throw new Error("Order not found.");

        }

        const product = await orderRepository.getProduct(order.productId);

        if (product) {

            await orderRepository.updateStock(

                product.id,

                Number(product.stock) + Number(order.quantity)

            );

        }

        await orderRepository.delete(id);

        return true;

    }

}

module.exports = new OrderService();