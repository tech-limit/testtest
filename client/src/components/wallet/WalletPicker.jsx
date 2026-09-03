import { useEffect, useMemo, useState } from "react";
import { useWallet } from "../../context/WalletContext";
import { listWallets } from "../../web3/wallets";
import { WalletIcon } from "./WalletIcons";
import "./WalletPicker.css";

const WalletPicker = () => {
  const { pickerOpen, closePicker, connect, connecting, error } = useWallet();
  const [wallets, setWallets] = useState([]);
  const [pendingId, setPendingId] = useState("");

  useEffect(() => {
    if (!pickerOpen) return;
    setPendingId("");
    setWallets(listWallets());
  }, [pickerOpen]);

  const ordered = useMemo(
    () => [...wallets].sort((a, b) => Number(b.available) - Number(a.available)),
    [wallets]
  );

  if (!pickerOpen) return null;

  const choose = async (wallet) => {
    if (!wallet.available) {
      if (wallet.installUrl) window.open(wallet.installUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setPendingId(wallet.id);
    await connect(wallet.id).catch(() => {});
    setPendingId("");
  };

  return (
    <div className="lb-wallet-overlay" onClick={closePicker} role="presentation">
      <div
        className="lb-wallet-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lb-wallet-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="lb-wallet-modal-head">
          <div>
            <p className="lb-wallet-kicker">Limit Break</p>
            <h2 id="lb-wallet-title">Connect a wallet</h2>
          </div>
          <button type="button" className="lb-wallet-close" onClick={closePicker} aria-label="Close">
            ×
          </button>
        </div>
        <p className="lb-wallet-copy">Select a provider to sign in. Installed wallets connect in one click.</p>
        <div className="lb-wallet-list">
          {ordered.map((wallet) => {
            const busy = connecting && pendingId === wallet.id;
            return (
              <button
                key={wallet.id}
                type="button"
                className={`lb-wallet-option ${wallet.available ? "available" : ""} ${busy ? "busy" : ""}`}
                onClick={() => choose(wallet)}
                disabled={connecting}
              >
                <span className="lb-wallet-logo">
                  <WalletIcon id={wallet.id} />
                </span>
                <span className="lb-wallet-meta">
                  <strong>{wallet.announcedName || wallet.name}</strong>
                  <small>{busy ? "Waiting for approval…" : wallet.available ? "Ready to connect" : "Not installed"}</small>
                </span>
                <span className={`lb-wallet-chip ${wallet.available ? "on" : ""}`}>
                  {wallet.available ? "Installed" : "Get"}
                </span>
              </button>
            );
          })}
        </div>
        {error ? <p className="lb-wallet-error">{error}</p> : null}
        <p className="lb-wallet-foot">
          New to wallets?{" "}
          <a href="https://ethereum.org/wallets/" target="_blank" rel="noreferrer">
            Learn how they work
          </a>
        </p>
      </div>
    </div>
  );
};

export default WalletPicker;
