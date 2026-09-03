let currentProvider = null;

export const setInjectedProvider = (provider) => {
  currentProvider = provider || null;
};

export const getInjectedProvider = () => {
  if (currentProvider?.request) return currentProvider;
  if (typeof window !== "undefined" && window.ethereum) return window.ethereum;
  return null;
};
