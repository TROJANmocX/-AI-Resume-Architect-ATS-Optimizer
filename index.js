/**
 * Main Application Entry Point (index.js)
 * 
 * This file serves as the main entry point for the CareerForge server.
 * It is responsible for setting up the environment, establishing the MongoDB
 * database connection, and starting the Express server.
 */

require('dotenv').config();
const app = require('./app');

// Import the database connection utility
const dbConnect = require('./backend/database/mongodb').default || require('./backend/database/mongodb');

const port = process.env.PORT || 5000;

// Connect to MongoDB
dbConnect()
  .then(() => {
    console.log("[MongoDB] Successfully connected to the database.");
    
    // Start the server only after a successful database connection
    app.listen(port, () => {
      console.log(`[Server] Application is running and listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("[MongoDB] Failed to connect to the database:", err);
    // Exit the process with failure if the database cannot be connected
    process.exit(1);
  });
