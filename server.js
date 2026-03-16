const express = require("express");
const cors = require("cors");
const { initDb } = require("./database/connection");
const contactsRoutes = require("./routes/contacts");
const { swaggerUi, swaggerSpec } = require("./docs/swagger");

const app = express();

app.use(cors());                    // Allow cross-origin requests (needed for Swagger Try it out & future frontends)
app.use(express.json());            // Parse JSON request bodies

app.use("/api-docs", swaggerUi.serve);
app.get(
  "/api-docs",
  swaggerUi.setup(swaggerSpec, {
    explorer: true,                           
    swaggerOptions: {
      supportedSubmitMethods: ["get", "post", "put", "delete"], 
      persistAuthorization: true,             
      defaultModelsExpandDepth: -1,           
    },
    customCss: ".swagger-ui .topbar { background-color: #2d3748; }", 
    customSiteTitle: "Contacts API Documentation",
  })
);


// Friendly root endpoint (shows API is alive + lists all endpoints)
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Contacts API is running 🚀",
    documentation: "/api-docs (interactive Swagger UI)",
    endpoints: [
      "GET    /contacts          → Get all contacts",
      "GET    /contacts/:id      → Get single contact by ID",
      "POST   /contacts          → Create new contact (returns new ID)",
      "PUT    /contacts/:id      → Update contact (full replace)",
      "DELETE /contacts/:id      → Delete contact",
    ],
    health: "/health → Simple status check",
  });
});

// Simple health check (useful for Render / monitoring tools)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Main API routes
app.use("/contacts", contactsRoutes);

// ────────────────────────────────────────────────
// 404 Handler (catch unmatched routes)
// ────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
    documentation: "/api-docs",
  });
});


// Global Error Handler (last middleware)
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  });
});


// Start Server (after DB connection)
const PORT = process.env.PORT || 3000;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`Health check:      http://localhost:${PORT}/health`);
      if (process.env.RENDER) {
        console.log(`Deployed on Render – live at https://webservices-contacts-api.onrender.com`);
      }
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit if DB connection fails (Render will restart)
  });