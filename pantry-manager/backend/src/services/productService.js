import {
  calculateDaysUntilExpiration,
  determineExpirationStatus
} from "../domain/expirationCalculator.js";

const VALID_CATEGORIES = [
  "DAIRY",
  "MEAT",
  "VEGETABLES",
  "FRUITS",
  "GRAINS",
  "BEVERAGES",
  "SNACKS",
  "OTHER"
];

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ProductService {
  constructor(productRepository, getCurrentDate = () => new Date()) {
    this.productRepository = productRepository;
    this.getCurrentDate = getCurrentDate;
  }

  getAllProducts({ category, status } = {}) {
    return this.productRepository
      .findAll()
      .filter((product) => !category || product.category === category)
      .map((product) => this.enrichWithStatus(product))
      .filter((product) => !status || product.status === status)
      .sort((a, b) => a.expirationDate.localeCompare(b.expirationDate));
  }

  getProductById(id) {
    const product = this.findOrThrow(id);
    return this.enrichWithStatus(product);
  }

  addProduct(payload) {
    const validated = this.validateProductPayload(payload);
    const created = this.productRepository.create(validated);
    return this.enrichWithStatus(created);
  }

  updateProduct(id, payload) {
    this.findOrThrow(id);
    const validated = this.validateProductPayload(payload);
    const updated = this.productRepository.update(id, validated);
    return this.enrichWithStatus(updated);
  }

  consumeProduct(id, amount = 1) {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new AppError("Consumed amount must be a positive integer", 400);
    }

    const product = this.findOrThrow(id);
    if (amount > product.quantity) {
      throw new AppError("Cannot consume more than available quantity", 400);
    }

    const remainingQuantity = product.quantity - amount;
    if (remainingQuantity === 0) {
      this.productRepository.delete(id);
      return this.enrichWithStatus({ ...product, quantity: 0 });
    }

    const updated = this.productRepository.update(id, {
      name: product.name,
      category: product.category,
      quantity: remainingQuantity,
      unit: product.unit,
      expirationDate: product.expirationDate
    });

    return this.enrichWithStatus(updated);
  }

  deleteProduct(id) {
    this.findOrThrow(id);
    this.productRepository.delete(id);
  }

  findOrThrow(id) {
    const product = this.productRepository.findById(id);
    if (!product) {
      throw new AppError(`Product with id ${id} was not found`, 404);
    }
    return product;
  }

  validateProductPayload(payload) {
    const { name, category, quantity, unit, expirationDate } = payload || {};

    if (!name || typeof name !== "string" || !name.trim()) {
      throw new AppError("Product name is required", 400);
    }
    if (!VALID_CATEGORIES.includes(category)) {
      throw new AppError("Valid product category is required", 400);
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new AppError("Quantity must be an integer greater than or equal to 1", 400);
    }
    if (!unit || typeof unit !== "string" || !unit.trim()) {
      throw new AppError("Unit is required", 400);
    }
    if (!expirationDate || !/^\d{4}-\d{2}-\d{2}$/.test(expirationDate)) {
      throw new AppError("Expiration date must be in YYYY-MM-DD format", 400);
    }

    return {
      name: name.trim(),
      category,
      quantity,
      unit: unit.trim(),
      expirationDate
    };
  }

  enrichWithStatus(product) {
    const now = this.getCurrentDate();
    return {
      ...product,
      status: determineExpirationStatus(product.expirationDate, now),
      daysUntilExpiration: calculateDaysUntilExpiration(product.expirationDate, now)
    };
  }
}