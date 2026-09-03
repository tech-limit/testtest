module.exports = {
  PORT: process.env.PORT || 6782,
  JWT_SECRET: process.env.JWT_SECRET || 'demo-secret-key-change-in-production',
  MONGO_URI: process.env.MONGO_URI, // Not required for demo (using mock data)
  NODE_ENV: process.env.NODE_ENV || 'development',
  INITIAL_CHIPS_AMOUNT: 100000,
  JWT_TOKEN_EXPIRES_IN: process.env.JWT_TOKEN_EXPIRES_IN || '7d',
  CHAIN_ID: process.env.CHAIN_ID ? Number(process.env.CHAIN_ID) : 31337,
  RPC_URL: process.env.RPC_URL || '',
  BET_TOKEN_ADDRESS: process.env.BET_TOKEN_ADDRESS || '',
  STAKING_ADDRESS: process.env.STAKING_ADDRESS || '',
  NFT_ADDRESS: process.env.NFT_ADDRESS || '',
  FORWARDER_ADDRESS: process.env.FORWARDER_ADDRESS || '',
}
