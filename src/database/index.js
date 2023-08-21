const { Client } = require('pg');
const DATABASE_URL = process.env.DATABASE_URL;
const client = new Client({
  host: DATABASE_URL,
  port: 5432,
  user: 'root',
  password: 'root',
  database: 'compare_list',
});

client.connect();

exports.query = async (query, values) => {
  const {rows} = await client.query(query, values);
  return rows;
}
