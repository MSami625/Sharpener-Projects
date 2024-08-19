const db = require("../util/database");

const Cart = require("./cart");

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    db.execute(
      "insert into products (title,price,imageUrl,description) values(?,?,?,?)",
      [this.title, this.price, this.imageUrl, this.description]
    );
  }

  static deleteById(id) {
    db.execute("delete from products where products.id=?",[id]);
  }

  static fetchAll(cb) {
    return db.execute("select * from products");
  }
  static findById(id) {
   return db.execute("select * from products where products.id=?", [id]);  
  }
};
