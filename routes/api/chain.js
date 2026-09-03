const express = require("express");
const blockchain = require("../../services/blockchain");

const router = express.Router();

router.get("/status", async (_req, res) => {
  const snapshot = await blockchain.getProtocolSnapshot();
  res.status(200).json({
    success: true,
    data: snapshot,
  });
});

router.get("/positions/:wallet", async (req, res) => {
  try {
    const positions = await blockchain.getPositions(req.params.wallet);
    res.status(200).json({
      success: true,
      data: positions,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
