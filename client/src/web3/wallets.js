const WALLET_OPTIONS = [
  {
    id: "metamask",
    name: "MetaMask",
    rdns: ["io.metamask", "io.metamask.flask"],
    flags: ["isMetaMask"],
    installUrl: "https://metamask.io/download/",
    color: "#f6851b",
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    rdns: ["com.coinbase.wallet"],
    flags: ["isCoinbaseWallet", "isCoinbaseBrowser"],
    windowKeys: ["coinbaseWalletExtension"],
    installUrl: "https://www.coinbase.com/wallet/downloads",
    color: "#0052ff",
  },
  {
    id: "rabby",
    name: "Rabby",
    rdns: ["io.rabby"],
    flags: ["isRabby"],
    installUrl: "https://rabby.io/",
    color: "#8697ff",
  },
  {
    id: "brave",
    name: "Brave Wallet",
    rdns: ["com.brave.wallet"],
    flags: ["isBraveWallet"],
    installUrl: "https://brave.com/wallet/",
    color: "#fb542b",
  },
  {
    id: "trust",
    name: "Trust Wallet",
    rdns: ["com.trustwallet.app"],
    flags: ["isTrust", "isTrustWallet"],
    installUrl: "https://trustwallet.com/download",
    color: "#3375bb",
  },
  {
    id: "okx",
    name: "OKX Wallet",
    rdns: ["com.okex.wallet", "com.okx.wallet"],
    flags: ["isOkxWallet", "isOKExWallet"],
    windowKeys: ["okxwallet"],
    installUrl: "https://www.okx.com/web3",
    color: "#ffffff",
  },
  {
    id: "phantom",
    name: "Phantom",
    rdns: ["app.phantom"],
    flags: ["isPhantom"],
    windowKeys: ["phantom.ethereum"],
    installUrl: "https://phantom.app/download",
    color: "#ab9ff2",
  },
  {
    id: "injected",
    name: "Browser wallet",
    rdns: [],
    flags: [],
    fallbackInjected: true,
    installUrl: "",
    color: "#3d9ad1",
  },
];

const getByPath = (root, path) =>
  path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), root);

const ethereumList = () => {
  if (typeof window === "undefined") return [];
  const eth = window.ethereum;
  if (!eth) return [];
  if (Array.isArray(eth.providers) && eth.providers.length) return eth.providers;
  return [eth];
};

export const announceInjectedWallets = () => {
  if (typeof window === "undefined") return [];
  const announced = [];
  const onAnnounce = (event) => {
    if (event?.detail?.info && event?.detail?.provider) {
      announced.push(event.detail);
    }
  };
  window.addEventListener("eip6963:announceProvider", onAnnounce);
  window.dispatchEvent(new Event("eip6963:requestProvider"));
  window.removeEventListener("eip6963:announceProvider", onAnnounce);
  return announced;
};

export const resolveWalletProvider = (wallet, announced = []) => {
  if (!wallet) return null;

  const byRdns = announced.find((item) =>
    wallet.rdns.includes(item.info?.rdns)
  );
  if (byRdns) return byRdns.provider;

  if (wallet.windowKeys) {
    for (const key of wallet.windowKeys) {
      const candidate = getByPath(window, key);
      if (candidate?.request) return candidate;
    }
  }

  const injected = ethereumList();
  for (const flag of wallet.flags) {
    const match = injected.find((provider) => provider?.[flag]);
    if (match) return match;
  }

  if (wallet.fallbackInjected) {
    return window.ethereum || null;
  }

  return null;
};

export const listWallets = () => {
  const announced = announceInjectedWallets();
  return WALLET_OPTIONS.map((wallet) => {
    const provider = resolveWalletProvider(wallet, announced);
    const available = Boolean(provider);
    if (wallet.id === "injected" && !available) return null;
    return {
      ...wallet,
      available,
      announcedName: announced.find((item) => wallet.rdns.includes(item.info?.rdns))
        ?.info?.name,
    };
  }).filter(Boolean);
};

export { WALLET_OPTIONS };
