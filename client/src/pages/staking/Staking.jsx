import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import "./Staking.css";
import { BRAND_NAME } from "../../utils/brand";
import { useWallet } from "../../context/WalletContext";
import WalletConnectButton from "../../components/wallet/WalletConnectButton";
import { isOnchainReady, stakeBet } from "../../web3/protocol";

const fallbackPools = [
  {
    id: "conservative",
    name: "Conservative Pool",
    apy: "18%",
    tvl: "2.4M BET",
    lockDays: 30,
    description: "Steady yield that supports core player rewards.",
  },
  {
    id: "growth",
    name: "Growth Pool",
    apy: "42%",
    tvl: "1.1M BET",
    lockDays: 90,
    description: "Higher participation upside for long-term stakers.",
  },
  {
    id: "ecosystem",
    name: "Ecosystem Pool",
    apy: "63%",
    tvl: "860K BET",
    lockDays: 180,
    description: "Deep alignment with Limit Break V2 game launches.",
  },
];

const Staking = () => {
  const { address, isConnected } = useWallet();
  const [pools, setPools] = useState(fallbackPools);
  const [amount, setAmount] = useState("100");
  const [selectedPool, setSelectedPool] = useState("conservative");
  const [status, setStatus] = useState("");
  const [gasless, setGasless] = useState(null);
  const [busy, setBusy] = useState(false);
  const onchain = isOnchainReady();

  useEffect(() => {
    fetch("/api/staking/pools")
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          setPools(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const quoteGasless = async () => {
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/gasless/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "stake",
          poolId: selectedPool,
          amount,
          wallet: address || "demo",
        }),
      });
      const data = await res.json();
      setGasless(data?.data || { sponsored: true, gasFee: "0", note: "Demo quote" });
    } catch {
      setGasless({
        sponsored: true,
        gasFee: "0 ETH",
        note: "Demo mode — gasless quote unavailable from API.",
      });
    } finally {
      setBusy(false);
    }
  };

  const stake = async () => {
    if (!isConnected) {
      setStatus("Connect a wallet before staking.");
      return;
    }
    setBusy(true);
    setStatus("");
    try {
      let txHash = null;
      if (onchain) {
        const receipt = await stakeBet(selectedPool, amount);
        txHash = receipt?.hash || receipt?.transactionHash || null;
      }

      const res = await fetch("/api/staking/stake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          poolId: selectedPool,
          amount: Number(amount) || 0,
          wallet: address,
          txHash,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        setStatus(data.message || "Stake recorded.");
      } else {
        setStatus(data?.message || "Unable to stake right now.");
      }
    } catch (err) {
      setStatus(err?.message || `Could not stake ${amount} BET into ${selectedPool}.`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{BRAND_NAME} | Staking</title>
        <meta
          name="description"
          content="Stake BET into Limit Break V2 ecosystem pools with gasless demo claims."
        />
      </Helmet>
      <section id="staking" className="lb-staking">
        <div className="container mt-4 mb-5 mt-md-5 pt-lg-3">
          <div className="row mx-2 pageTitle mb-4">
            <div className="col-12 col-lg-8">
              <span className="d-block F1 textS1">
                <span className="lemon">BET</span> Staking
              </span>
              <span className="d-block F3 textS2 mt-2">
                Participate in the ecosystem — stake BET into on-chain lock pools
                {onchain ? " (wallet will submit LimitBreakStaking.stake)." : " (demo ledger until contracts are deployed)."}
              </span>
            </div>
            <div className="col-12 col-lg-4 d-flex align-items-center justify-content-lg-end mt-3 mt-lg-0">
              <WalletConnectButton />
            </div>
          </div>

          <div className="row g-4 mx-1">
            {pools.map((pool) => (
              <div key={pool.id} className="col-md-4">
                <button
                  type="button"
                  className={`lb-pool-card ${selectedPool === pool.id ? "active" : ""}`}
                  onClick={() => setSelectedPool(pool.id)}
                >
                  <div className="lb-pool-apy">{pool.apy} APY</div>
                  <h3>{pool.name}</h3>
                  <p>{pool.description}</p>
                  <div className="lb-pool-meta">
                    <span>TVL {pool.tvl}</span>
                    <span>{pool.lockDays}d lock</span>
                  </div>
                </button>
              </div>
            ))}
          </div>

          <div className="row mx-1 mt-4">
            <div className="col-lg-7">
              <div className="lb-stake-panel">
                <h3 className="F3 mb-3">Stake amount</h3>
                <label className="lb-field-label" htmlFor="stake-amount">
                  BET amount
                </label>
                <input
                  id="stake-amount"
                  className="lb-input"
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <button
                    type="button"
                    className="tv-btn lb-btn-solid"
                    onClick={stake}
                    disabled={busy}
                  >
                    {busy ? "Working…" : onchain ? "Stake on-chain" : "Stake (demo)"}
                  </button>
                  <button
                    type="button"
                    className="tv-btn tv-btn-outline"
                    onClick={quoteGasless}
                    disabled={busy}
                  >
                    Quote gasless claim
                  </button>
                </div>
                {status ? <p className="lb-status mt-3">{status}</p> : null}
              </div>
            </div>
            <div className="col-lg-5 mt-4 mt-lg-0">
              <div className="lb-gasless-panel">
                <h3 className="F3 mb-2">Gasless transactions</h3>
                <p className="F4 mb-3">
                  V2 sponsors eligible staking and claim actions so players stay in the experience.
                  Quotes include the EIP-2771 forwarder address when the protocol is deployed.
                </p>
                {gasless ? (
                  <ul className="lb-gasless-list">
                    <li>
                      <strong>Sponsored:</strong> {gasless.sponsored ? "Yes" : "No"}
                    </li>
                    <li>
                      <strong>Gas fee:</strong> {gasless.gasFee || "0"}
                    </li>
                    <li>
                      <strong>Note:</strong> {gasless.note || "Demo quote"}
                    </li>
                    {gasless.forwarder ? (
                      <li>
                        <strong>Forwarder:</strong> {gasless.forwarder}
                      </li>
                    ) : null}
                  </ul>
                ) : (
                  <p className="F4 mb-0">Request a quote to preview sponsored fees.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Staking;
