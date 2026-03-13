const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGODB_URI);

let database;

const initDb = async () => {
  try {
    await client.connect();
    database = client.db(process.env.DB_NAME);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
};

const getDb = () => {
  return database;
};

module.exports = { initDb, getDb };