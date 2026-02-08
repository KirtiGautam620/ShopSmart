import express from "express";
import prisma from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(requireAuth);

// GET /api/cart
router.get("/", async (req, res) => {
    try {
        const items = await prisma.cartItem.findMany({
            where: { userId: req.user.userId },
            include: { product: true },
        });
        res.json(items);
    } catch (_error) {
        console.error("Fetch cart error:", _error);
        res.status(500).json({ error: "Error fetching cart" });
    }
});

// POST /api/cart  { productId, quantity }
router.post("/", async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const existing = await prisma.cartItem.findFirst({
            where: { userId: req.user.userId, productId: Number(productId) },
        });
        if (existing) {
            const updated = await prisma.cartItem.update({
                where: { id: existing.id },
                data: { quantity: existing.quantity + (Number(quantity) || 1) },
                include: { product: true },
            });
            return res.json(updated);
        }
        const item = await prisma.cartItem.create({
            data: { userId: req.user.userId, productId: Number(productId), quantity: Number(quantity) || 1 },
            include: { product: true },
        });
        res.status(201).json(item);
    } catch (_error) {
        console.error("Add to cart error:", _error);
        res.status(500).json({ error: "Error adding to cart" });
    }
});

// PUT /api/cart/:id  { quantity }
router.put("/:id", async (req, res) => {
    try {
        const { quantity } = req.body;
        const item = await prisma.cartItem.update({
            where: { id: Number(req.params.id) },
            data: { quantity: Number(quantity) },
            include: { product: true },
        });
        res.json(item);
    } catch (_error) {
        console.error("Update cart error:", _error);
        res.status(500).json({ error: "Error updating cart item" });
    }
});

// DELETE /api/cart/:id
router.delete("/:id", async (req, res) => {
    try {
        await prisma.cartItem.delete({ where: { id: Number(req.params.id) } });
        res.json({ message: "Item removed from cart" });
    } catch (_error) {
        console.error("Remove from cart error:", _error);
        res.status(500).json({ error: "Error removing item" });
    }
});

export default router;
