import { AppError } from "./productService.js";

const OPEN_FOOD_FACTS_URL = "https://world.openfoodfacts.org/api/v2/product";

function mapOpenFoodFactsCategory(categoriesTags = []) {
  const joined = categoriesTags.join(" ").toLowerCase();

  if (joined.includes("dairy") || joined.includes("milk") || joined.includes("cheese") || joined.includes("yogurt")) {
    return "DAIRY";
  }
  if (joined.includes("meat") || joined.includes("poultry") || joined.includes("fish")) {
    return "MEAT";
  }
  if (joined.includes("vegetable")) {
    return "VEGETABLES";
  }
  if (joined.includes("fruit")) {
    return "FRUITS";
  }
  if (joined.includes("cereal") || joined.includes("pasta") || joined.includes("bread") || joined.includes("grain")) {
    return "GRAINS";
  }
  if (joined.includes("beverage") || joined.includes("drink") || joined.includes("juice") || joined.includes("water")) {
    return "BEVERAGES";
  }
  if (joined.includes("snack") || joined.includes("chocolate") || joined.includes("sweet") || joined.includes("spread")) {
    return "SNACKS";
  }
  return "OTHER";
}

export class EanLookupService {
  constructor(fetchClient = fetch) {
    this.fetchClient = fetchClient;
  }

  async lookupByEan(eanCode) {
    const cleanedCode = String(eanCode || "").trim();
    if (!/^\d{8,14}$/.test(cleanedCode)) {
      throw new AppError("EAN code must contain between 8 and 14 digits", 400);
    }

    const response = await this.fetchClient(`${OPEN_FOOD_FACTS_URL}/${cleanedCode}.json`);
    if (!response.ok) {
      throw new AppError("Failed to fetch product data from Open Food Facts", 502);
    }

    const data = await response.json();
    if (data.status !== 1 || !data.product) {
      throw new AppError(`Product with EAN ${cleanedCode} was not found`, 404);
    }

    const product = data.product;
    const name = product.product_name_pl || product.product_name || "Nieznany produkt";
    const category = mapOpenFoodFactsCategory(product.categories_tags);

    return {
      ean: cleanedCode,
      name: name.trim(),
      category,
      unit: "szt."
    };
  }
}