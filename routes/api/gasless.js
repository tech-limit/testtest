// EIP-2612 permit + EIP-2771 forwarder quotes. Relayer submit is optional.
const express = require('express');
const blockchain = require('../../services/blockchain');

const router = express.Router();

router.post('/quote', (req, res) => {
  const { action = 'stake', poolId, amount, wallet } = req.body || {};
  const addresses = blockchain.resolveAddresses();
  const configured = blockchain.isConfigured();

  res.status(200).json({
    success: true,
    data: {
      sponsored: true,
      gasFee: configured ? 'relayer-pays' : '0 ETH',
      action,
      poolId: poolId || null,
      amount: amount || null,
      wallet: wallet || 'demo',
      forwarder: addresses.forwarder || null,
      token: addresses.bet || null,
      staking: addresses.staking || null,
      flow: [
        'Player signs EIP-2612 BET.permit (no gas).',
        'Relayer or player submits LimitBreakStaking.stake via EIP-2771 forwarder.',
      ],
      note: configured
        ? 'Limit Break V2 gasless quote — forwarder is deployed; set RELAYER_PRIVATE_KEY to submit meta-transactions.'
        : 'Limit Break V2 gasless quote — deploy contracts and set RPC_URL to enable the relayer path.',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    },
  });
});

module.exports = router;
