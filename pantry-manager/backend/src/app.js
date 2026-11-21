import cors from "cors";
import express from "express";
import { ProductController } from "./controllers/productController.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { ProductRepository } from "./repositories/productRepository.js";
import { createProductRouter } from "./routes/productRoutes.js";
import { EanLookupService } from "./services/eanLookupService.js";
import { ProductService } from "./services/productService.js";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const productRepository = new ProductRepository();
  const productService = new ProductService(productRepository);
  const eanLookupService = new EanLookupService();
  const productController = new ProductController(productService, eanLookupService);

  app.use("/api/products", createProductRouter(productController));
  app.use(errorHandler);

  return app;
}