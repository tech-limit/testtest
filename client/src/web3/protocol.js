import { BrowserProvider, Contract, parseUnits } from "ethers";
import { BET_TOKEN_ABI, NFT_ABI, POOL_INDEX, STAKING_ABI } from "./abis";
import { getInjectedProvider } from "./injected";

const ZERO = "0x0000000000000000000000000000000000000000";

export const protocolAddresses = {
  chainId: Number(import.meta.env.VITE_CHAIN_ID || 0),
  bet: import.meta.env.VITE_BET_TOKEN_ADDRESS || "",
  staking: import.meta.env.VITE_STAKING_ADDRESS || "",
  nft: import.meta.env.VITE_NFT_ADDRESS || "",
  forwarder: import.meta.env.VITE_FORWARDER_ADDRESS || "",
};

export const isOnchainReady = () =>
  Boolean(protocolAddresses.bet && protocolAddresses.staking && protocolAddresses.nft);

const isAddress = (value) =>
  typeof value === "string" && value.startsWith("0x") && value.length === 42 && value !== ZERO;

export async function getSigner() {
  const ethereum = getInjectedProvider();
  if (!ethereum?.request) {
    throw new Error("Connect a wallet first.");
  }
  const provider = new BrowserProvider(ethereum);
  if (protocolAddresses.chainId) {
    const network = await provider.getNetwork();
    if (Number(network.chainId) !== protocolAddresses.chainId) {
      throw new Error(`Switch wallet to chain ${protocolAddresses.chainId}.`);
    }
  }
  return provider.getSigner();
}

export async function stakeBet(poolId, amount) {
  const signer = await getSigner();
  const poolIndex = POOL_INDEX[poolId];
  if (poolIndex === undefined) {
    throw new Error("Unknown staking pool");
  }
  const value = parseUnits(String(amount), 18);
  const token = new Contract(protocolAddresses.bet, BET_TOKEN_ABI, signer);
  const staking = new Contract(protocolAddresses.staking, STAKING_ABI, signer);
  const owner = await signer.getAddress();
  const allowance = await token.allowance(owner, protocolAddresses.staking);
  if (allowance < value) {
    const approveTx = await token.approve(protocolAddresses.staking, value);
    await approveTx.wait();
  }
  const tx = await staking.stake(poolIndex, value);
  return tx.wait();
}

export async function mintAsset(uri) {
  const signer = await getSigner();
  const token = new Contract(protocolAddresses.bet, BET_TOKEN_ABI, signer);
  const nft = new Contract(protocolAddresses.nft, NFT_ABI, signer);
  const price = await nft.mintPrice();
  if (price > 0n) {
    const owner = await signer.getAddress();
    const allowance = await token.allowance(owner, protocolAddresses.nft);
    if (allowance < price) {
      const approveTx = await token.approve(protocolAddresses.nft, price);
      await approveTx.wait();
    }
  }
  const tx = await nft.mint(uri);
  return tx.wait();
}

export { isAddress };
