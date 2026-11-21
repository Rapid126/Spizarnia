import { Router } from "express";

export function createProductRouter(productController) {
  const router = Router();

  router.get("/", productController.getAll);
  router.get("/ean/:code", productController.lookupByEan);
  router.get("/:id", productController.getById);
  router.post("/", productController.create);
  router.put("/:id", productController.update);
  router.patch("/:id/consume", productController.consume);
  router.delete("/:id", productController.remove);

  return router;
}