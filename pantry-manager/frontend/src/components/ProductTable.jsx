const CATEGORY_LABELS = {
  DAIRY: "🥛 Nabiał",
  MEAT: "🥩 Mięso",
  VEGETABLES: "🥦 Warzywa",
  FRUITS: "🍎 Owoce",
  GRAINS: "🌾 Zboża i makarony",
  BEVERAGES: "🥤 Napoje",
  SNACKS: "🍪 Przekąski",
  OTHER: "📦 Inne"
};

const STATUS_LABELS = {
  FRESH: "Świeży",
  EXPIRING_SOON: "Kończy się termin",
  EXPIRED: "Przeterminowany"
};

export function ProductTable({ products, onConsume, onEdit, onDelete }) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Produkt</th>
            <th>Kategoria</th>
            <th>Ilość</th>
            <th>Data ważności</th>
            <th>Status</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty-state">
                Brak produktów spełniających kryteria
              </td>
            </tr>
          ) : (
            products.map((product) => {
              const daysText =
                product.daysUntilExpiration < 0
                  ? `${Math.abs(product.daysUntilExpiration)} dni po terminie`
                  : product.daysUntilExpiration === 0
                  ? "upływa dzisiaj"
                  : `za ${product.daysUntilExpiration} dni`;

              return (
                <tr key={product.id} className={`row-${product.status}`}>
                  <td>
                    <strong>{product.name}</strong>
                  </td>
                  <td>{CATEGORY_LABELS[product.category] || product.category}</td>
                  <td>
                    <span className="quantity-pill">
                      {product.quantity} {product.unit}
                    </span>
                  </td>
                  <td>
                    <div>{product.expirationDate}</div>
                    <small className="days-hint">{daysText}</small>
                  </td>
                  <td>
                    <span className={`badge badge-${product.status}`}>
                      {STATUS_LABELS[product.status]}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-consume"
                      title="Zużyj 1 sztukę"
                      onClick={() => onConsume(product.id)}
                    >
                      -1
                    </button>
                    <button
                      className="btn-edit"
                      onClick={() => onEdit(product)}
                    >
                      Edytuj
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => onDelete(product.id)}
                    >
                      Usuń
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}