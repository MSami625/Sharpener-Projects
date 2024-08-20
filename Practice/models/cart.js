
const Cart = require("../models/cart");


module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    Cart.create({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
   
  }

  static deleteProduct(id, productPrice) {
  
  }

  static getCart(cb) {
   
  }

};