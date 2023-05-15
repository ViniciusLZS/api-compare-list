CREATE DATABASE comparelist;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS lists (
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  estimated INT NOT NULL,
  total DOUBLE PRECISION,
  user_id UUID,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS measurements (
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  value DOUBLE PRECISION NOT NULL,
  amount INT NOT NULL,
  measurement_id UUID,
  list_id UUID,
  FOREIGN KEY(list_id) REFERENCES lists(id),
  FOREIGN KEY(measurement_id) REFERENCES measurements(id)
);
