import { useCallback, useEffect, useState } from "react";
import {
  consumeProduct,
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct
} from "./api/productApi.js";
import { ProductFilters } from "./components/ProductFilters.jsx";
import { ProductForm } from "./components/ProductForm.jsx";
import { ProductTable } from "./components/ProductTable.jsx";
import { SummaryCards } from "./components/SummaryCards.jsx";

export default function App() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  const loadProducts = useCallback(async () => {
    const data = await fetchProducts({
      category: categoryFilter,
      status: statusFilter
    });
    setProducts(data);
  }, [categoryFilter, statusFilter]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  async function handleSaveProduct(payload) {
    if (editingProduct) {
      await updateProduct(editingProduct.id, payload);
      setEditingProduct(null);
    } else {
      await createProduct(payload);
    }
    await loadProducts();
  }

  async function handleConsumeProduct(id) {
    await consumeProduct(id, 1);
    if (editingProduct?.id === id) {
      setEditingProduct(null);
    }
    await loadProducts();
  }

  async function handleDeleteProduct(id) {
    await deleteProduct(id);
    if (editingProduct?.id === id) {
      setEditingProduct(null);
    }
    await loadProducts();
  }

  const visibleProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <div className="container">
      <header className="app-header">
        <div>
          <h1>🥫 Domowa Spiżarnia</h1>
          <p>Kontroluj zapasy i nie marnuj jedzenia dzięki monitorowaniu dat ważności</p>
        </div>
      </header>

      <SummaryCards products={products} />

      <ProductForm
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
        onCancelEdit={() => setEditingProduct(null)}
      />

      <section className="card">
        <ProductFilters
          searchQuery={searchQuery}
          category={categoryFilter}
          status={statusFilter}
          onSearchChange={setSearchQuery}
          onCategoryChange={setCategoryFilter}
          onStatusChange={setStatusFilter}
        />
        <ProductTable
          products={visibleProducts}
          onConsume={handleConsumeProduct}
          onEdit={setEditingProduct}
          onDelete={handleDeleteProduct}
        />
      </section>
    </div>
  );
}