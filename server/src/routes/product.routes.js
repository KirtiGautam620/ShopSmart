import express from "express";
import prisma from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.middleware.js";
const router = express.Router();
router.get("/", async (req, res) => {
    try {
        const { category, search } = req.query;
        const where = {};
        if (category) where.category = category;
        if (search) where.name = { contains: search };
        const products = await prisma.product.findMany({ where, orderBy: { createdAt: "desc" } });
        res.json(products);
    } catch (_error) {
        console.error("Fetch products error:", _error);
        res.status(500).json({ error: "Error fetching products" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: Number(req.params.id) },
        });
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (_error) {
        console.error("Fetch product error:", _error);
        res.status(500).json({ error: "Error fetching product" });
    }
});

router.post("/", requireAuth, async (req, res) => {
    try {
        const { name, price, category, description, image, stock } = req.body;
        const product = await prisma.product.create({
            data: {
                name,
                price: Number(price),
                category,
                description: description || "",
                image: image || "",
                stock: Number(stock) || 100,
            },
        });
        res.status(201).json(product);
    } catch (_error) {
        console.error("Create product error:", _error);
        res.status(500).json({ error: "Error creating product" });
    }
});

router.put("/:id", requireAuth, async (req, res) => {
    try {
        const { name, price, category, description, image, stock } = req.body;
        const product = await prisma.product.update({
            where: { id: Number(req.params.id) },
            data: { name, price: Number(price), category, description, image, stock: Number(stock) },
        });
        res.json(product);
    } catch (_error) {
        console.error("Update product error:", _error);
        res.status(500).json({ error: "Error updating product" });
    }
});

router.delete("/:id", requireAuth, async (req, res) => {
    try {
        await prisma.product.delete({ where: { id: Number(req.params.id) } });
        res.json({ message: "Product deleted successfully" });
    } catch (_error) {
        console.error("Delete product error:", _error);
        res.status(500).json({ error: "Error deleting product" });
    }
});

export default router;