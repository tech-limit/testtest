// Route modules mounted in a stable order for auth → catalog → web3 demos.
/**
 * Configure all application routes
 * @param {Express} app - Express application instance
 */
const configureRoutes = (app) => {
  // API routes
  app.use('/api/auth', require('./api/auth'));
  app.use('/api/users', require('./api/users'));
  app.use('/api/collections', require('./api/collections'));
  app.use('/api/nfts', require('./api/nfts'));
  app.use('/api/ai', require('./api/ai'));
  app.use('/api/staking', require('./api/staking'));
  app.use('/api/gasless', require('./api/gasless'));
  app.use('/api/chain', require('./api/chain'));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
    });
  });

  // API root endpoint
  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Limit Break V2 API',
      version: '2.0.0',
    });
  });

  // 404 handler for undefined routes
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
      path: req.originalUrl,
    });
  });
};

module.exports = configureRoutes;
