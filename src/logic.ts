type Product = {
  name: string;
  price: number;
};

function filterAndSortProducts(products: Product[]): Product[] {
  const uniqueProducts = new Map<string, Product>();

  for (const product of products) {
    if (
      !uniqueProducts.has(product.name) ||
      product.price < uniqueProducts.get(product.name)!.price
    ) {
      uniqueProducts.set(product.name, product);
    }
  }

  return Array.from(uniqueProducts.values()).sort((a, b) => a.price - b.price);
}

module.exports = { filterAndSortProducts };
