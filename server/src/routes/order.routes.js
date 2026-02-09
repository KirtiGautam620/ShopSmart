import express from "express";
import prisma from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(requireAuth);
router.post("/", async (req, res) => {
    try {
        const cartItems = await prisma.cartItem.findMany({
            where: { userId: req.user.userId },
            include: { product: true },
        });

        if (cartItems.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        const total = cartItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );
        const order = await prisma.order.create({
            data: {
                userId: req.user.userId,
                total,
                items: {
                    create: cartItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                    })),
                },
            },
            include: { items: { include: { product: true } } },
        });
        await prisma.cartItem.deleteMany({ where: { userId: req.user.userId } });

        res.status(201).json(order);
    } catch (_error) {
        console.error("Place order error:", _error);
        res.status(500).json({ error: "Error placing order" });
    }
});
router.get("/", async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user.userId },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: "desc" },
        });
        res.json(orders);
    } catch (_error) {
        console.error("Fetch orders error:", _error);
        res.status(500).json({ error: "Error fetching orders" });
    }
});

export default router;
