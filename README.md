---
## Protocol

Contracts live in `contracts/` and compile with Hardhat (`hardhat.config.js`).

| Contract                     | Role                                          |
| ---------------------------- | --------------------------------------------- |
| `BETToken`                 | ERC-20 + permit (`BET`)                     |
| `LimitBreakStaking`        | 30 / 90 / 180 day lock pools, EIP-2771 claims |
| `LimitBreakNFT`            | ERC-721 player assets, BET mint settlement    |
| `LimitBreakForwarder`      | Trusted meta-transaction forwarder            |
| `LimitBreakPlayerRegistry` | Player identity registry                      |
| `LimitBreakAchievements`   | On-chain achievement records                  |
| `LimitBreakQuestBoard`     | Quest definitions and claims                  |
| `LimitBreakSeason`         | Seasonal competition windows                  |

Local chain workflow:

```bash
npm run chain:compile
npm run chain:test
npx hardhat node
npm run chain:deploy
```

Copy the printed addresses into `.env` (`BET_TOKEN_ADDRESS`, `STAKING_ADDRESS`, `NFT_ADDRESS`, `FORWARDER_ADDRESS`) so the API and client can talk to the deployment.
---
---

Copyright © 2026
