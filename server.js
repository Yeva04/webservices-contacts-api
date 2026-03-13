const express = require("express");
const cors = require("cors");
const { initDb } = require("./database/connection");

const contactsRoutes = require("./routes/contacts");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/contacts", contactsRoutes);

const PORT = process.env.PORT || 3000;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });