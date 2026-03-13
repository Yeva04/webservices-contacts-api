const express = require("express");
const router = express.Router();
const mongodb = require("../database/connection");
const { ObjectId } = require("mongodb");

// GET all contacts
router.get("/", async (req, res) => {
  const db = mongodb.getDb();
  const result = await db.collection("contacts").find();
  result.toArray().then((contacts) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(contacts);
  });
});

// GET single contact
router.get("/:id", async (req, res) => {
  const db = mongodb.getDb();
  const contactId = new ObjectId(req.params.id);

  const result = await db.collection("contacts").find({ _id: contactId });

  result.toArray().then((contacts) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(contacts[0]);
  });
});

// POST create contact
router.post("/", async (req, res) => {
  const db = mongodb.getDb();

  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };

  const response = await db.collection("contacts").insertOne(contact);

  if (response.acknowledged) {
    res.status(201).json({ id: response.insertedId });
  } else {
    res.status(500).json(response.error || "Error creating contact");
  }
});

// PUT update contact
router.put("/:id", async (req, res) => {
  const db = mongodb.getDb();
  const contactId = new ObjectId(req.params.id);

  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };

  const response = await db.collection("contacts").replaceOne(
    { _id: contactId },
    contact
  );

  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || "Error updating contact");
  }
});

// DELETE contact
router.delete("/:id", async (req, res) => {
  const db = mongodb.getDb();
  const contactId = new ObjectId(req.params.id);

  const response = await db.collection("contacts").deleteOne({
    _id: contactId
  });

  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || "Error deleting contact");
  }
});

module.exports = router;