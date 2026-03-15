import express from 'express';
import cors from 'cors';
import productRoutes from "./routes/product.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes)
app.get('/', (req, res) => {
  res.send('ShopSmart Backend');
});
export default app;
