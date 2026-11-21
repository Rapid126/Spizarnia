export class ProductRepository {
  constructor() {
    this.products = [];
    this.nextId = 1;
  }

  findAll() {
    return [...this.products];
  }

  findById(id) {
    return this.products.find((product) => product.id === id) || null;
  }

  create(productData) {
    const newProduct = { id: this.nextId++, ...productData };
    this.products.push(newProduct);
    return newProduct;
  }

  update(id, updatedData) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      return null;
    }
    this.products[index] = { id, ...updatedData };
    return this.products[index];
  }

  delete(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      return false;
    }
    this.products.splice(index, 1);
    return true;
  }

  clear() {
    this.products = [];
    this.nextId = 1;
  }
}