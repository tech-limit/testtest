import "./WalletConnectButton.css";
import { useWallet } from "../../context/WalletContext";

const short = (addr) =>
  addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";

const WalletConnectButton = ({ className = "" }) => {
  const { address, connecting, openPicker, disconnect, walletName } = useWallet();

  if (address) {
    return (
      <button
        type="button"
        className={`lb-wallet-btn connected ${className}`}
        onClick={disconnect}
        title={`${walletName || "Wallet"} connected — click to disconnect`}
      >
        {walletName ? `${walletName} · ` : ""}
        {short(address)}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`lb-wallet-btn ${className}`}
      onClick={openPicker}
      disabled={connecting}
    >
      {connecting ? "Connecting…" : "Connect Wallet"}
    </button>
  );
};

export default WalletConnectButton;
