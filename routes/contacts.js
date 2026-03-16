const express = require("express");
const router = express.Router();
const mongodb = require("../database/connection");
const { ObjectId } = require("mongodb");

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Contacts management endpoints
 */

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Retrieve all contacts
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: A list of contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id: { type: string }
 *                   firstName: { type: string }
 *                   lastName: { type: string }
 *                   email: { type: string }
 *                   favoriteColor: { type: string }
 *                   birthday: { type: string }
 */
router.get("/", async (req, res) => {
  const db = mongodb.getDb();
  const result = await db.collection("contacts").find();
  result.toArray().then((contacts) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(contacts);
  });
});

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Retrieve a single contact by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the contact
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single contact object
 *       400:
 *         description: Invalid ID supplied
 *       404:
 *         description: Contact not found
 */
router.get("/:id", async (req, res) => {
  const db = mongodb.getDb();
  const contactId = new ObjectId(req.params.id);

  const result = await db.collection("contacts").find({ _id: contactId });

  result.toArray().then((contacts) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(contacts[0]);
  });
});


/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               favoriteColor:
 *                 type: string
 *               birthday:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact created
 */
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

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Update an existing contact
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the contact to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               favoriteColor:
 *                 type: string
 *               birthday:
 *                 type: string
 *     responses:
 *       204:
 *         description: Contact successfully updated
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Contact not found
 */
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

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the contact to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Contact successfully deleted
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Contact not found
 */
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