const db = require('../../database');

class ProductRepository {

  async findAll({ id, orderBy = 'ASC' }) {
    const direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const rows = db.query(`
      SELECT *
      FROM products
      WHERE list_id = $1 AND deleted_at IS NULL
      ORDER BY products.name ${direction}
    `, [id]);

    return rows;
  }

  async findById(id) {
    const [row] = await db.query(`
      SELECT *
      FROM products
      WHERE id = $1 AND deleted_at IS NULL
    `, [id]);

    return row;
  }

  async findByMeasureId(measure_id) {
    const [row] = await db.query(`
      SELECT *
      FROM measures
      WHERE id = $1 AND deleted_at IS NULL
    `, [measure_id]);

    return row;
  }

  async findByListId(list_id) {
    const [row] = await db.query(`
      SELECT *
      FROM lists
      WHERE id = $1 AND deleted_at IS NULL
    `, [list_id]);

    return row;
  }

  async create({ name, value, amount, measure_id, list_id }) {
    const [row] = await db.query(`
      INSERT INTO products(name, value, amount, measure_id, list_id)
      VALUES($1, $2, $3, $4, $5)
      RETURNING *
    `, [name, value, amount, measure_id, list_id]);

    return row;
  }

  async update(id, { name, value, amount, measure_id, list_id }) {
    const [row] = await db.query(`
      UPDATE products
      SET name = $1,
          value = $2,
          amount = $3,
          measure_id = $4,
          list_id = $5
      WHERE id = $6 AND deleted_at IS NULL
    `, [name, value, amount, measure_id, list_id, id]);

    return row;
  }

  async delete(id) {
    const deleteProduct = await db.query(`
      UPDATE products
      SET deleted_at = NOW()
      WHERE id = $1;
    `, [id]);

    return deleteProduct;
  }
}

module.exports = new ProductRepository();
