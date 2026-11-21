export function ProductFilters({
  searchQuery,
  category,
  status,
  onSearchChange,
  onCategoryChange,
  onStatusChange
}) {
  return (
    <div className="filters">
      <h2>Lista produktów</h2>
      <div className="filter-controls">
        <input
          type="text"
          className="search-input"
          placeholder="Szukaj po nazwie..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
          <option value="">Wszystkie kategorie</option>
          <option value="DAIRY">Nabiał</option>
          <option value="MEAT">Mięso</option>
          <option value="VEGETABLES">Warzywa</option>
          <option value="FRUITS">Owoce</option>
          <option value="GRAINS">Zboża i makarony</option>
          <option value="BEVERAGES">Napoje</option>
          <option value="SNACKS">Przekąski</option>
          <option value="OTHER">Inne</option>
        </select>
        <select value={status} onChange={(e) => onStatusChange(e.target.value)}>
          <option value="">Wszystkie statusy</option>
          <option value="EXPIRED">Przeterminowane</option>
          <option value="EXPIRING_SOON">Kończy się termin</option>
          <option value="FRESH">Świeże</option>
        </select>
      </div>
    </div>
  );
}