/* eslint-disable no-restricted-syntax */
const { v4: uuidv4 } = require('uuid');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const { storage } = require('../data/storage');

const formatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function findProductById(products, id) {
  if (typeof id === 'string') {
    return products.find((p) => p.id === parseInt(id, 10));
  }
  return products.find((product) => product.id === id);
}

const formatPrice = (amount) => `$${formatter.format(amount)}`;

class Store {
  static async listProducts() {
    return storage.get('products');
  }

  static fetchProductById(productId) {
    const product = storage
      .get('products')
      .find({ id: Number(productId) });

    if (product) return product;

    throw new NotFoundError('No product found with that id.');
  }

  static purchaseProducts(cart, userInfo) {
    if (!cart || !Object.keys(cart).length) {
      throw new BadRequestError('No cart or items in cart found to checkout.');
    }

    if (!userInfo || !Object.keys(userInfo).length) {
      throw new BadRequestError('No user info found to checkout with.');
    }

    const products = storage.get('products');
    const subtotal = Store.calculateSubtotal(cart, products);
    const total = Store.totalWithTax(subtotal);

    const receipt = Store.createReceipt({
      cart, subtotal, total, products, userInfo,
    });

    const purchase = {
      id: uuidv4(),
      name: userInfo.name,
      email: userInfo.email,
      total,
      receipt,
    };

    storage.add('purchases', purchase);

    return purchase;
  }

  /**
   * Method that calculates the total cost of all items in the cart, before tax
   *
   * @returns number
   */
  static calculateSubtotal(cart, products) {
    return Object.entries(cart).reduce((prev, cartItem) => {
      // Find the product
      const product = findProductById(products, cartItem[0]);
      const quantity = cartItem[1];

      // Check that the product exists
      if (!product) {
        throw new BadRequestError(`Item ID: ${cartItem[0]} is not in the Student Store inventory.`);
      }

      // Calculate product total
      const productTotal = quantity * product.price;

      // Return sum
      return prev + productTotal;
    }, 0);
  }

  /**
   * Method used to return the total with 8.875% sales tax added on.
   *
   * @returns the cost with tax included
   */
  static totalWithTax(cost) {
    return cost + cost * Store.tax;
  }

  /**
   * Method that takes the current shopping cart and returns a receipt.
   *
   */
  static createReceipt({
    cart, subtotal, total, products, userInfo,
  }) {
    const productRows = Object.entries(cart).map((cartItem) => {
      const quantity = cartItem[1];
      const product = findProductById(products, cartItem[0]);

      return {
        ...product,
        quantity,
        totalPrice: quantity * product.price,
      };
    });

    const receiptLines = [
      `Showing receipt for ${userInfo.name} available at ${userInfo.email}:`,
      ...productRows.map(
        (product) => `${product.quantity} total ${product.name} purchased at a cost of ${formatPrice(
          product.price,
        )} for a total cost of ${formatPrice(product.totalPrice)}.`,
      ),
      `Before taxes, the subtotal was ${formatPrice(subtotal)}`,
      `After taxes and fees were applied, the total comes out to ${formatPrice(total)}`,
    ];

    return {
      userInfo,
      lines: receiptLines,
      productRows,
    };
  }

  /**
   * Method that fetches all the orders in the database
   *
   */
  static async fetchOrders() {
    return storage.get('purchases');
  }

  /**
   * Method that fetches an order from the database based on an order id
   *
   */
  static async fetchOrderById(id) {
    const order = storage.get('purchases').find((o) => o.id === id);
    return order;
  }
}

Store.tax = 0.0875;

module.exports = Store;
