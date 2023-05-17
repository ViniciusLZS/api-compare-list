const db = require('../../database');

class ListRepository {
  async findAll({ id, orderBy = 'ASC' }) {
    const direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const rows = db.query(`
      SELECT *
      FROM lists
      WHERE user_id = $1 AND deleted_at IS NULL
      ORDER BY lists.name ${direction}
    `, [id]);

    return rows;
  }

  async findById(id) {
    const [row] = await db.query(`
      SELECT *
      FROM lists
      WHERE id = $1 AND deleted_at IS NULL
    `, [id]);

    return row;
  }

  async findUserId(userId) {
    const [row] = await db.query(`
    SELECT *
    FROM users
    WHERE id = $1 AND deleted_at IS NULL
  `, [userId]);

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

  async update(id, { name, estimated, user_id }) {
    const [row] = await db.query(`
      UPDATE lists
      SET name = $1, estimated = $2, user_id = $3
      WHERE id = $4 AND deleted_at IS NULL
    `, [name, estimated, user_id, id]);

    return row;
  }

  async delete(id) {
    const deleteList = await db.query(`
      UPDATE lists
      SET deleted_at = NOW()
      WHERE id = $1
    `, [id]);

    const deleteProduct = await db.query(`
      UPDATE products
      SET deleted_at = NOW()
      WHERE list_id = $1
    `, [id]);

    return { deleteList, deleteProduct };
  }
}

module.exports = new ListRepository();
