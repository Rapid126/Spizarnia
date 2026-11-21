const API_URL = "/api/products";

export async function fetchProducts({ category, status }) {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (status) params.append("status", status);

  const query = params.toString() ? `?${params.toString()}` : "";
  const response = await fetch(`${API_URL}${query}`);
  if (!response.ok) {
    throw new Error("Nie udało się pobrać listy produktów");
  }
  return response.json();
}

export async function createProduct(payload) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Błąd podczas dodawania produktu");
  }
  return data;
}

export async function updateProduct(id, payload) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Błąd podczas aktualizacji produktu");
  }
  return data;
}

export async function consumeProduct(id, amount = 1) {
  const response = await fetch(`${API_URL}/${id}/consume?amount=${amount}`, {
    method: "PATCH"
  });
  if (!response.ok) {
    throw new Error("Nie udało się zaktualizować ilości");
  }
  return response.json();
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
  if (!response.ok) {
    throw new Error("Nie udało się usunąć produktu");
  }
}

export async function lookupProductByEan(code) {
  const response = await fetch(`${API_URL}/ean/${encodeURIComponent(code)}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Nie znaleziono produktu o podanym kodzie EAN");
  }
  return data;
}