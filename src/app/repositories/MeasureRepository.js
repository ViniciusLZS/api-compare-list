const db = require('../../database');

class MeasureRepository {
  async findAll() {
    const rows = await db.query(`
      SELECT *
      FROM measures
      WHERE deleted_at IS NULL
    `);

    return rows;
  }

  async findById(id) {
    const [row] = await db.query(`
      SELECT *
      FROM measures
      WHERE id = $1 AND deleted_at IS NULL
    `, [id]);

    return row;
  }

  async findByName(name) {
    const [row] = await db.query(`
      SELECT *
      FROM measures
      WHERE name = $1
    `, [name]);

    return row;
  }

  async create({ nameLowerCase }) {
    const [row] = await db.query(`
      INSERT INTO measures(name)
      VALUES($1)
      RETURNING *
    `, [nameLowerCase]);

    return row;
  }

  async update(id, { nameLowerCase }) {
    const [row] = await db.query(`
      UPDATE measures
      SET name = $1
      WHERE id = $2 AND deleted_at IS NULL
    `, [nameLowerCase, id]);

    return row;
  }

  async delete(id) {
    const deleteMeasure = await db.query(`
      UPDATE measures
      SET deleted_at = NOW()
      WHERE id = $1;
    `, [id]);

    return deleteMeasure;
  }
}

module.exports = new MeasureRepository();
