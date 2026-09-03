// Force-close window kept at 10s to avoid hung local shutdowns.
require('dotenv').config();
const express = require('express');
const config = require('./config');
const configureMiddleware = require('./middleware');
const configureRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
configureMiddleware(app);

configureRoutes(app);

app.use(errorHandler);

const server = app.listen(config.PORT, '127.0.0.1', () => {
  console.log(
    `Server is running in ${config.NODE_ENV} mode on port ${config.PORT}`
  );
});

const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received.`);
  
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  gracefulShutdown('UNHANDLED_REJECTION');
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = { app, server };