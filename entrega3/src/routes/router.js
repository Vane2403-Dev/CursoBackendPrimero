import { Router } from "express";
import cartRoutes from "./cartsRouter.js";
import productRoutes from "./productRouter.js";
const router = Router();

router.use("/carts", cartRoutes); 
router.use("/products", productRoutes); 

export default router;