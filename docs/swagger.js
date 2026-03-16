const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Contacts API",
      version: "1.0.0",
      description: "API for managing contacts in MongoDB",
    },
    servers: [
      {
        url: "{protocol}://{host}",  // Placeholder for dynamic URL
        description: "Current server",
        variables: {
          protocol: {
            enum: ["http", "https"],
            default: "https",  // Render uses HTTPS
          },
          host: {
            default: "webservices-contacts-api.onrender.com",  
          },
        },
      },
      // Keep localhost for local dev
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
    ],
  },
  // Better glob pattern – scans all .js files in routes folder recursively if i add more later
  apis: [path.join(__dirname, "../routes/**/*.js")],  // or specifically: path.join(__dirname, "../routes/contacts.js")
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };