import { useEffect, useState } from "react";
import { lookupProductByEan } from "../api/productApi.js";

const INITIAL_FORM = {
  name: "",
  category: "DAIRY",
  quantity: 1,
  unit: "szt.",
  expirationDate: ""
};

export function ProductForm({ onSave, editingProduct, onCancelEdit }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [eanCode, setEanCode] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        category: editingProduct.category,
        quantity: editingProduct.quantity,
        unit: editingProduct.unit,
        expirationDate: editingProduct.expirationDate
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setError("");
  }, [editingProduct]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value
    }));
  }

  async function handleEanLookup() {
    if (!eanCode.trim()) return;
    setError("");
    setIsLookingUp(true);
    try {
      const productInfo = await lookupProductByEan(eanCode.trim());
      setFormData((prev) => ({
        ...prev,
        name: productInfo.name,
        category: productInfo.category,
        unit: productInfo.unit || prev.unit
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLookingUp(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      await onSave(formData);
      setFormData(INITIAL_FORM);
      setEanCode("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className={`card ${editingProduct ? "card-editing" : ""}`}>
      <div className="card-header">
        <h2>{editingProduct ? `Edytuj produkt: ${editingProduct.name}` : "Dodaj nowy produkt"}</h2>
        {editingProduct && (
          <button type="button" className="btn-secondary" onClick={onCancelEdit}>
            Anuluj edycję
          </button>
        )}
      </div>

      {!editingProduct && (
        <div className="ean-bar">
          <input
            type="text"
            placeholder="Wpisz kod EAN (np. 3017620422003)"
            value={eanCode}
            onChange={(e) => setEanCode(e.target.value)}
          />
          <button
            type="button"
            className="btn-secondary"
            onClick={handleEanLookup}
            disabled={isLookingUp}
          >
            {isLookingUp ? "Szukam..." : "🔍 Pobierz dane z EAN"}
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-grid">
        <input
          type="text"
          name="name"
          placeholder="Nazwa produktu (np. Mleko)"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="DAIRY">🥛 Nabiał</option>
          <option value="MEAT">🥩 Mięso</option>
          <option value="VEGETABLES">🥦 Warzywa</option>
          <option value="FRUITS">🍎 Owoce</option>
          <option value="GRAINS">🌾 Zboża i makarony</option>
          <option value="BEVERAGES">🥤 Napoje</option>
          <option value="SNACKS">🍪 Przekąski</option>
          <option value="OTHER">📦 Inne</option>
        </select>
        <input
          type="number"
          name="quantity"
          min="1"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="unit"
          placeholder="Jednostka"
          value={formData.unit}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="expirationDate"
          value={formData.expirationDate}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn-primary">
          {editingProduct ? "Zapisz zmiany" : "+ Dodaj"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </section>
  );
}