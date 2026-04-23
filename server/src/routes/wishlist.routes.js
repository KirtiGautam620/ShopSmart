import express from "express";
import prisma from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(requireAuth);

// Get wishlist items
router.get("/", async (req, res) => {
    try {
        const items = await prisma.wishlistItem.findMany({
            where: { userId: req.user.userId },
            include: { product: true },
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: "Error fetching wishlist" });
    }
});

// Add to wishlist
router.post("/", async (req, res) => {
    try {
        const { productId } = req.body;
        
        // Check if already in wishlist
        const existing = await prisma.wishlistItem.findFirst({
            where: { userId: req.user.userId, productId: Number(productId) }
        });

        if (existing) {
            return res.json(existing);
        }

        const item = await prisma.wishlistItem.create({
            data: {
                userId: req.user.userId,
                productId: Number(productId)
            },
            include: { product: true }
        });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: "Error adding to wishlist" });
    }
});

// Remove from wishlist
router.delete("/:id", async (req, res) => {
    try {
        await prisma.wishlistItem.delete({
            where: { id: Number(req.params.id) }
        });
        res.json({ message: "Removed from wishlist" });
    } catch (error) {
        res.status(500).json({ error: "Error removing from wishlist" });
    }
});

export default router;
