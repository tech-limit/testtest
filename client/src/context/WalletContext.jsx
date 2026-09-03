import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { BrowserProvider } from "ethers";
import { setInjectedProvider } from "../web3/injected";
import { announceInjectedWallets, listWallets, resolveWalletProvider, WALLET_OPTIONS } from "../web3/wallets";

const WalletContext = createContext(null);
const LAST_WALLET_KEY = "lb.wallet.id";
const EXPECTED_CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 0);

const toHexChainId = (id) => `0x${Number(id).toString(16)}`;

const findWallet = (walletId) =>
  WALLET_OPTIONS.find((item) => item.id === walletId) || WALLET_OPTIONS.find((item) => item.id === "injected");

async function ensureChain(ethereum) {
  if (!EXPECTED_CHAIN_ID) return;
  const chainId = await ethereum.request({ method: "eth_chainId" });
  if (Number(chainId) === EXPECTED_CHAIN_ID) return;
  await ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: toHexChainId(EXPECTED_CHAIN_ID) }],
  });
}

export const WalletProvider = ({ children }) => {
  const [address, setAddress] = useState("");
  const [walletId, setWalletId] = useState("");
  const [walletName, setWalletName] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState("");
  const providerRef = useRef(null);

  const onAccountsChanged = useCallback((accounts) => {
    if (!accounts?.length) {
      setAddress("");
      return;
    }
    setAddress(accounts[0]);
  }, []);

  const onChainChanged = useCallback(() => {
    window.location.reload();
  }, []);

  const detachListeners = useCallback(() => {
    const provider = providerRef.current;
    if (provider?.removeListener) {
      provider.removeListener("accountsChanged", onAccountsChanged);
      provider.removeListener("chainChanged", onChainChanged);
    }
  }, [onAccountsChanged, onChainChanged]);

  const attachListeners = useCallback((provider) => {
    detachListeners();
    providerRef.current = provider;
    if (provider?.on) {
      provider.on("accountsChanged", onAccountsChanged);
      provider.on("chainChanged", onChainChanged);
    }
  }, [detachListeners, onAccountsChanged, onChainChanged]);

  const connect = useCallback(async (selectedId) => {
    const wallet = findWallet(selectedId);
    setConnecting(true);
    setError("");
    try {
      const announced = announceInjectedWallets();
      const ethereum = resolveWalletProvider(wallet, announced);
      if (!ethereum?.request) {
        throw new Error(`${wallet.name} is not installed in this browser.`);
      }
      await ethereum.request({ method: "eth_requestAccounts" });
      await ensureChain(ethereum);
      const browserProvider = new BrowserProvider(ethereum);
      const signer = await browserProvider.getSigner();
      const nextAddress = await signer.getAddress();
      setInjectedProvider(ethereum);
      attachListeners(ethereum);
      setAddress(nextAddress);
      setWalletId(wallet.id);
      setWalletName(wallet.name);
      localStorage.setItem(LAST_WALLET_KEY, wallet.id);
      setPickerOpen(false);
    } catch (err) {
      const message = err?.message || "Wallet connection failed";
      setError(message);
      throw err;
    } finally {
      setConnecting(false);
    }
  }, [attachListeners]);

  const disconnect = useCallback(() => {
    detachListeners();
    providerRef.current = null;
    setInjectedProvider(null);
    setAddress("");
    setWalletId("");
    setWalletName("");
    setError("");
    localStorage.removeItem(LAST_WALLET_KEY);
  }, [detachListeners]);

  const openPicker = useCallback(() => {
    setError("");
    setPickerOpen(true);
  }, []);

  const closePicker = useCallback(() => {
    if (!connecting) setPickerOpen(false);
  }, [connecting]);

  const reconnecting = useRef(false);

  useEffect(() => {
    if (reconnecting.current) return undefined;
    const lastId = localStorage.getItem(LAST_WALLET_KEY);
    if (!lastId) return undefined;
    const available = listWallets().find((item) => item.id === lastId && item.available);
    if (!available) return undefined;
    reconnecting.current = true;
    connect(lastId).catch(() => {
      reconnecting.current = false;
    });
    return undefined;
  }, [connect]);

  useEffect(() => () => detachListeners(), [detachListeners]);

  const value = useMemo(
    () => ({
      address,
      walletId,
      walletName,
      connecting,
      pickerOpen,
      error,
      connect,
      disconnect,
      openPicker,
      closePicker,
      isConnected: Boolean(address),
    }),
    [address, walletId, walletName, connecting, pickerOpen, error, connect, disconnect, openPicker, closePicker]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return ctx;
};
