export function SummaryCards({ products }) {
  const total = products.length;
  const fresh = products.filter((p) => p.status === "FRESH").length;
  const expiringSoon = products.filter((p) => p.status === "EXPIRING_SOON").length;
  const expired = products.filter((p) => p.status === "EXPIRED").length;

  return (
    <section className="summary-grid">
      <div className="summary-card summary-total">
        <span className="summary-label">Wszystkie produkty</span>
        <strong className="summary-value">{total}</strong>
      </div>
      <div className="summary-card summary-fresh">
        <span className="summary-label">Świeże</span>
        <strong className="summary-value">{fresh}</strong>
      </div>
      <div className="summary-card summary-soon">
        <span className="summary-label">Kończy się termin</span>
        <strong className="summary-value">{expiringSoon}</strong>
      </div>
      <div className="summary-card summary-expired">
        <span className="summary-label">Przeterminowane</span>
        <strong className="summary-value">{expired}</strong>
      </div>
    </section>
  );
}