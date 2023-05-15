const db = require('../../database');

class ListRepository {
  async findAll({ id, orderBy = 'ASC' }) {
    const direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const rows = db.query(`
      SELECT *
      FROM lists
      WHERE user_id = $1
      ORDER BY lists.name ${direction}
    `, [id]);

    return rows;
  }

  async findById(id) {
    const [row] = await db.query(`
      SELECT *
      FROM lists
      WHERE id = $1
    `, [id]);

    return row;
  }

  async create({ name, estimated, user_id }) {
    const [row] = await db.query(`
      INSERT INTO lists(name, estimated, user_id)
      VALUES($1, $2, $3)
      RETURNING *
    `, [name, estimated, user_id]);

    return row;
  }
}

module.exports = new ListRepository();
