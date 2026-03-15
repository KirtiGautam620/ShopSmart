import express from "express";
import prisma from "../config/prisma.js";
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { name, price, category } = req.body;

        const product = await prisma.product.create({
            data: { name, price, category },
        });

        res.json(product);
    } catch (error) {
        console.error("Prisma error:", error);
        res.status(500).json({ error: "Error creating product" });
    }
});

router.get("/", async (req, res) => {
    try {
        const products = await prisma.product.findMany({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Error fetching products" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id: Number(id) },
        });

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Error fetching product" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category } = req.body;

        const product = await prisma.product.update({
            where: { id: Number(id) },
            data: { name, price, category },
        });

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Error updating product" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.product.delete({
            where: { id: Number(id) },
        });

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting product" });
    }
});

export default router;