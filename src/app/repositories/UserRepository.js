const db = require('../../database');

class UserRepository {
  async findAll() {
    const rows = await db.query(`
      SELECT *
      FROM users
      WHERE deleted_at IS NULL
    `)
    return rows;
  }

  async findById(id) {
    const [row] = await db.query(`
      SELECT *
      FROM users
      WHERE id = $1 AND deleted_at IS NULL
    `, [id]);

    return row;
  }

  async findByEmail(email) {
    const [row] = await db.query(`
      SELECT *
      FROM users
      WHERE email = $1 AND deleted_at IS NULL
    `, [email]);

    return row;
  }

  async create({ photo, name, email, password }) {
    const [row] = await db.query(`
    INSERT INTO users(photo, name, email, password)
    VALUES($1, $2, $3, $4)
    RETURNING *
    `, [photo, name, email, password]);

    return row;
  }

  async update(id, { name, email, password }) {
    const [row] = await db.query(`
      UPDATE users
      SET name = $1, email = $2, password = $3
      WHERE id = $4 AND deleted_at IS NULL
    `, [name, email, password, id]);

    return row;
  }

  async updatePhoto(id, { photo }) {
    const [row] = await db.query(`
      UPDATE users
      SET photo = $1
      WHERE id = $2 AND deleted_at IS NULL
      RETURNING *
    `, [photo, id]);

    return row;
  }

  async delete(id) {
    const deleteUser = await db.query(`
      UPDATE users
      SET deleted_at = NOW()
      WHERE id = $1;
    `, [id]);

    const deleteList = await db.query(`
      UPDATE lists
      SET deleted_at = NOW()
      WHERE user_id = $1;
    `, [id])

    return { deleteUser, deleteList };
  }
}

module.exports = new UserRepository();
