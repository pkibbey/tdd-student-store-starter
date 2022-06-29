/* eslint-disable import/prefer-default-export */

export function findProductById(products, id) {
  if (typeof id === 'string') {
    return products.find((p) => p.id === parseInt(id, 10));
  }
  return products.find((p) => p.id === id);
}
