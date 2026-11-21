export class ProductController {
  constructor(productService, eanLookupService) {
    this.productService = productService;
    this.eanLookupService = eanLookupService;
  }

  getAll = (req, res, next) => {
    try {
      const { category, status } = req.query;
      const products = this.productService.getAllProducts({ category, status });
      res.json(products);
    } catch (error) {
      next(error);
    }
  };

  getById = (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const product = this.productService.getProductById(id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  };

  lookupByEan = async (req, res, next) => {
    try {
      const productInfo = await this.eanLookupService.lookupByEan(req.params.code);
      res.json(productInfo);
    } catch (error) {
      next(error);
    }
  };

  create = (req, res, next) => {
    try {
      const created = this.productService.addProduct(req.body);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  };

  update = (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const updated = this.productService.updateProduct(id, req.body);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  };

  consume = (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const amount = req.query.amount ? Number(req.query.amount) : 1;
      const updated = this.productService.consumeProduct(id, amount);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  };

  remove = (req, res, next) => {
    try {
      const id = Number(req.params.id);
      this.productService.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}