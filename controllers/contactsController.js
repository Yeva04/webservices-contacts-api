const { getDb } = require("../database/connection");
const { ObjectId } = require("mongodb");

const getAll = async (req, res) => {
  const db = getDb();

  const result = await db.collection("contacts").find();

  const contacts = await result.toArray();

  res.json(contacts);
};

const getSingle = async (req, res) => {
  const db = getDb();

  const contactId = new ObjectId(req.params.id);

  const result = await db.collection("contacts").findOne({ _id: contactId });

  res.json(result);
};

module.exports = {
  getAll,
  getSingle
};