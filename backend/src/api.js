const db = require("./db");
const slugify = require("slugify");
const config = require("../config");

class api {

  /*
  getInitalData
  return  department & category & attributes & shipping
  */
  getInitalData() {
    return new Promise((resolve, reject) => {
      db.getConnection()
        .then(cnx => {
          Promise.all([
            cnx
              .query("SELECT * FROM department")
              .then(rows => ({ departments: rows })),
            cnx
              .query("SELECT * FROM category")
              .then(rows => ({ categorys: rows })),
            cnx
              .query("SELECT * FROM attribute")
              .then(rows => ({ attributes: rows })),
            cnx
              .query("SELECT * FROM shipping_region")
              .then(rows => ({ shippings: rows })),
            cnx
              .query("SELECT * FROM shipping")
              .then(rows => ({ shippinglist: rows })),
            cnx
              .query("SELECT * FROM attribute_value")
              .then(rows => ({ attribute_values: rows }))
          ])
            .then(rep => rep.reduce((data, item) => ({ ...data, ...item }), {}))
            .then(data => {
              data.departments = data.departments.map(department => {
                department.url =
                  "/tshirt/" + slugify(department.name, { lower: true });
                return department;
              });
              data.categorys = data.categorys.map(category => {
                category.url =
                  (
                    data.departments.find(
                      elm => elm.department_id === category.department_id
                    ) || { url: "/tshirt/tshirt" }
                  ).url +
                  "/" +
                  slugify(category.name, { lower: true });
                return category;
              });
              data.attributes = data.attributes.map(attribute => {
                attribute.values = data.attribute_values.filter(
                  elm => elm.attribute_id === attribute.attribute_id
                );
                return attribute;
              });
              data.shippings = data.shippings.map(shipping => {
                shipping.values = data.shippinglist.filter(
                  elm => elm.shipping_region_id === shipping.shipping_region_id
                );
                return shipping;
              });
              delete data.attribute_values;
              delete data.shippinglist;
              return data;
            })
            .then(resolve)
            .catch(reject)
            .finally(() => cnx.connection.release());
        })
        .catch(reject);
    });
  }



  /*

  products

  filter.q 
  filter.category_id
  filter.department_id
  filter.attribute_value_ids
  filter.price_min
  filter.price_max
  filter.page
  filter.limit

  */
  products(filter) {
    let dataQuery = [];
    let whereStmt = [];

    if ("q" in filter && filter.q && filter.q != "") {
      dataQuery.push("%" + filter.q.trim().replace(/\s+/g, "%") + "%");
      whereStmt.push(`name like ?`);
    }

    if ("category_id" in filter && parseInt(filter.category_id) > 0) {
      dataQuery.push(parseInt(filter.category_id));
      whereStmt.push(`product_id in (
				SELECT product_id 
				FROM product_category 
				WHERE category_id = ?
			)`);
    }

    if ("department_id" in filter && parseInt(filter.department_id) > 0) {
      dataQuery.push(parseInt(filter.department_id));
      whereStmt.push(`product_id in (
				SELECT product_id 
				FROM product_category pc 
				LEFT JOIN category c 
				ON pc.category_id=c.category_id 
				WHERE c.department_id = ?
			)`);
    }
    if ("attribute_value_ids" in filter && filter.attribute_value_ids) {
      let ids = filter.attribute_value_ids.split(",");
      let listIds = ids.filter(val => parseInt(val) > 0);
      let nbr_attribute_required = listIds.length;
      if (nbr_attribute_required) {
        listIds = listIds.join(",");
        whereStmt.push(`product_id in (
                    SELECT product_id 
                    FROM ( 
                            SELECT  product_id, 
                                    count(attribute_value_id) as nbr_attribute_found
                            FROM 	product_attribute
                            WHERE 	attribute_value_id in (${listIds})
                            GROUP BY product_id
                        ) t1
                    WHERE nbr_attribute_found = ${nbr_attribute_required}
                )`);
      }
    }
    if ("price_min" in filter && parseFloat(filter.price_min) > 0) {
      dataQuery.push(parseFloat(filter.price_min));
      whereStmt.push(`IF(discounted_price>0,discounted_price,price) >= ?`);
    }
    if ("price_max" in filter && parseFloat(filter.price_max) > 0) {
      dataQuery.push(parseFloat(filter.price_max));
      whereStmt.push(`IF(discounted_price>0,discounted_price,price) <= ?`);
    }

    if (whereStmt.length) {
      whereStmt = "WHERE " + whereStmt.join(" AND ");
    } else {
      whereStmt = "";
    }
    let page = 1;
    let limit = 12;
    if ("page" in filter && parseInt(filter.page) > 0) {
      page = parseInt(filter.page);
    }
    if ("limit" in filter && parseInt(filter.limit) > 0) {
      limit = parseInt(filter.limit);
    }
    let start = (page - 1) * limit;
    let sql = `
            SELECT 
                product_id,
                name,
                description,
                IF(discounted_price>0,price,0) as price_before_discount,
                IF(discounted_price>0,discounted_price,price) as price,
                CONCAT('${config.IMAGES_DIR}',image) as image,
                CONCAT('${config.IMAGES_DIR}',image_2) as image_2,
                CONCAT('${config.IMAGES_DIR}',thumbnail) as thumbnail,
                display 
            FROM product ${whereStmt}
        `;
    return new Promise((resolve, reject) => {
      db.getConnection()
        .then(cnx => {
          Promise.all([
            cnx
              .query(`SELECT count(*) as count from (${sql}) t`, dataQuery)
              .then(rows => ({
                count: rows && rows.length ? rows[0].count : 0
              })),
            cnx
              .query(`${sql} LIMIT ${start},${limit}`, dataQuery)
              .then(rows => ({ rows }))
          ])
            .then(rep => rep.reduce((data, item) => ({ ...data, ...item }), {}))
            .then(data => {
              data.page = page;
              data.limit = limit;
              data.nbrPages = Math.ceil(data.count / limit);
              data.rows = data.rows.map(row => {
                row.url =
                  "/tshirt-" +
                  slugify(row.name, { lower: true }) +
                  "-" +
                  row.product_id;
                return row;
              });
              return data;
            })
            .then(resolve)
            .catch(reject)
            .finally(() => cnx.connection.release());
        })
        .catch(reject);
    });
  }




  getProductDetail(id) {
    let sql = `
			SELECT 
				product_id,
				name,
				description,
				IF(discounted_price>0,price,0) as price_before_discount,
				IF(discounted_price>0,discounted_price,price) as price,
				CONCAT('${config.IMAGES_DIR}',image) as image,
				CONCAT('${config.IMAGES_DIR}',image_2) as image_2,
				CONCAT('${config.IMAGES_DIR}',thumbnail) as thumbnail,
				display 
			FROM product where product_id = ?
        `;
    return new Promise((resolve, reject) => {
      db.getConnection()
        .then(cnx => {
          Promise.all([
            cnx.query(sql, [id]).then(rows => ({
              product: rows && rows.length ? rows[0] : false
            })),
            cnx
              .query(
                `
                SELECT a.attribute_id, max(a.name) as name
                FROM
                    (
                        product_attribute pa 
                        LEFT JOIN attribute_value av 
                        ON pa.attribute_value_id = av.attribute_value_id
                    )
                    LEFT JOIN attribute a 
                    ON av.attribute_id = a.attribute_id
                WHERE pa.product_id = ?
                GROUP BY a.attribute_id
            `,
                [id]
              )
              .then(rows => ({ attributes: rows })),
            cnx
              .query(
                `
                SELECT attribute_id, attribute_value_id, value 
                FROM attribute_value av
                WHERE av.attribute_value_id in
                (
                    SELECT attribute_value_id 
                    FROM product_attribute pa 
                    WHERE product_id = ?
                )
            `,
                [id]
              )
              .then(rows => ({ attribute_values: rows }))
          ])
            .then(rep => rep.reduce((data, item) => ({ ...data, ...item }), {}))
            .then(data => {
              if (!data.product) return { found: false };
              data.product.found = true;
              data.product.url =
                "/tshirt-" +
                slugify(data.product.name, { lower: true }) +
                "-" +
                data.product.product_id;
              data.product.attributes = data.attributes;
              data.product.attributes = data.product.attributes.map(
                attribute => {
                  attribute.values = data.attribute_values.filter(
                    val => val.attribute_id === attribute.attribute_id
                  );
                  return attribute;
                }
              );
              return data.product;
            })
            .then(resolve)
            .catch(reject)
            .finally(() => cnx.connection.release());
        })
        .catch(reject);
    });
  }
  paiement({ token, shipping_id, products }) {
    return new Promise((resolve, reject) => {
      let ids = products.map(product => product.product_id);
      ids = ids.filter((v, i) => ids.indexOf(v) === i);
      let productsList = ids.map(id => {
        return products.reduce((obj, product) => {
          if (product.product_id === id) {
            obj.qte += product.qte;
          }
          return obj;
        }, { product_id: id, qte: 0 });
      });
      let sql = "SELECT product_id,name,IF(discounted_price>0,discounted_price,price) as price FROM product where product_id in (" + ids.join(",") + ")";
      db.getConnection()
        .then(cnx => {
          return Promise.all([
            cnx
              .query(sql)
              .then(rows => ({ products: rows })),
            cnx
              .query("SELECT shipping_cost FROM shipping WHERE shipping_id=?", [shipping_id])
              .then(rows => ({ shipping: rows.shift() })),
            cnx
              .query("SELECT * FROM tax where tax_percentage>0 limit 0,1")
              .then(rows => ({ tax: rows.shift() }))
          ])
            .then(rep => rep.reduce((data, item) => ({ ...data, ...item }), {}))
            .then(data => {
              let total = 0;
              productsList.map(product => {
                let price = data.products.find(p => p.product_id === product.product_id).price;
                total += (price * product.qte).toFixed(2) * 1;
              });
              if (data.shipping) {
                total += data.shipping.shipping_cost * 1;
              }
              if (data.tax) {
                total = (total * (1 + data.tax.tax_percentage * 1 / 100)).toFixed(2) * 1;;
              }
              data.total = total;
              var stripe = require("stripe")(config.STRIPE_SK);
              var charge = (async () => {
                return await stripe.charges.create({
                  amount: total.toFixed(2) * 100,
                  currency: 'usd',
                  description: 'Tshirtshop order',
                  source: token,
                  metadata: {
                    order_id: 0
                  }
                });
              })();
              data.charge = charge;
              resolve(data);
            })
            .catch(reject)
            .finally(() => cnx.connection.release());
        })
        .catch(reject)
        ;
    });
  }
  stripeHook(data) {

  }
}

module.exports = new api();
