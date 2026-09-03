// Pool figures fall back to mock TVL/APY when RPC is not configured.
const express = require('express');
const blockchain = require('../../services/blockchain');

const router = express.Router();

const demoPools = [
  {
    id: 'conservative',
    name: 'Conservative Pool',
    apy: '18%',
    tvl: '2.4M BET',
    lockDays: 30,
    description: 'Steady yield that supports core player rewards.',
    poolIndex: 0,
    source: 'demo',
  },
  {
    id: 'growth',
    name: 'Growth Pool',
    apy: '42%',
    tvl: '1.1M BET',
    lockDays: 90,
    description: 'Higher participation upside for long-term stakers.',
    poolIndex: 1,
    source: 'demo',
  },
  {
    id: 'ecosystem',
    name: 'Ecosystem Pool',
    apy: '63%',
    tvl: '860K BET',
    lockDays: 180,
    description: 'Deep alignment with Limit Break V2 game launches.',
    poolIndex: 2,
    source: 'demo',
  },
];

const DEMO_COPY = {
  conservative: 'Steady yield that supports core player rewards.',
  growth: 'Higher participation upside for long-term stakers.',
  ecosystem: 'Deep alignment with Limit Break V2 game launches.',
};

const DEMO_NAMES = {
  conservative: 'Conservative Pool',
  growth: 'Growth Pool',
  ecosystem: 'Ecosystem Pool',
};

const stakes = [];

async function listPools() {
  const snapshot = await blockchain.getProtocolSnapshot();
  if (!snapshot.configured || !snapshot.pools.length) {
    return { pools: demoPools, source: 'demo', chain: snapshot };
  }

  const pools = snapshot.pools.map((pool) => ({
    id: pool.id,
    name: DEMO_NAMES[pool.id] || pool.id,
    apy: pool.apy,
    tvl: pool.tvl,
    lockDays: pool.lockDays,
    description: DEMO_COPY[pool.id] || 'On-chain Limit Break staking pool.',
    poolIndex: pool.poolIndex,
    active: pool.active,
    source: 'chain',
  }));

  return { pools, source: 'chain', chain: snapshot };
}

router.get('/pools', async (_req, res) => {
  const { pools, source } = await listPools();
  res.status(200).json({
    success: true,
    source,
    data: pools,
  });
});

router.post('/stake', async (req, res) => {
  const { poolId, amount, wallet, txHash } = req.body || {};
  const { pools } = await listPools();
  const pool = pools.find((p) => p.id === poolId);

  if (!pool) {
    return res.status(400).json({
      success: false,
      message: 'Unknown staking pool',
    });
  }

  const parsedAmount = Number(amount);
  if (!parsedAmount || parsedAmount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Amount must be a positive number',
    });
  }

  const onchain = blockchain.isConfigured();
  const entry = {
    id: txHash || `stake_${Date.now()}`,
    poolId,
    poolIndex: pool.poolIndex,
    amount: parsedAmount,
    wallet: wallet || 'demo',
    txHash: txHash || null,
    createdAt: new Date().toISOString(),
    source: txHash ? 'chain' : onchain ? 'pending-wallet' : 'demo',
  };
  stakes.push(entry);

  return res.status(200).json({
    success: true,
    message: txHash
      ? `On-chain stake of ${parsedAmount} BET into ${pool.name} indexed.`
      : onchain
        ? `Sign the wallet transaction to stake ${parsedAmount} BET into ${pool.name}.`
        : `Demo stake of ${parsedAmount} BET into ${pool.name} recorded.`,
    data: entry,
    contracts: blockchain.resolveAddresses(),
  });
});

router.get('/stakes', async (req, res) => {
  const wallet = req.query.wallet;
  let onchain = [];
  if (wallet) {
    try {
      onchain = await blockchain.getPositions(wallet);
    } catch {
      onchain = [];
    }
  }

  res.status(200).json({
    success: true,
    data: {
      demo: wallet ? stakes.filter((s) => s.wallet === wallet) : stakes,
      onchain,
    },
  });
});

module.exports = router;
