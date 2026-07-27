import React from "react";
import { ShieldCheck, Wallet, PlusCircle, RefreshCw, RotateCcw } from "lucide-react";

export function Header({ walletState, onConnectMetaMask, onSwitchSandbox, onOpenCreateModal, onResetDemo }) {
  return (
    <header className="header">
      <div className="brand-logo">
        <div className="brand-icon">
          <ShieldCheck size={22} color="#ffffff" />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className="gradient-text" style={{ fontSize: "1.35rem", lineHeight: "1.1" }}>AetherFund</span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "500", marginTop: "0.1rem" }}>
            Decentralized Crowdfunding & Governance
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
        <button
          onClick={onResetDemo}
          className="btn-secondary"
          title="Reset sandbox data to default state"
          style={{ padding: "0.5rem 0.8rem", fontSize: "0.8rem" }}
        >
          <RotateCcw size={14} /> Reset Sandbox
        </button>

        <button
          onClick={onOpenCreateModal}
          className="btn-primary"
        >
          <PlusCircle size={16} />
          Create Campaign
        </button>

        <div className="wallet-badge">
          <span className={`wallet-mode-indicator ${walletState.mode === 'metamask' ? 'wallet-mode-metamask' : 'wallet-mode-sandbox'}`}>
            {walletState.mode === 'metamask' ? 'MetaMask EVM' : 'Sandbox'}
          </span>
          <Wallet size={15} color="#0d9488" />
          <span className="address-tag">
            {walletState.address.slice(0, 6)}...{walletState.address.slice(-4)}
          </span>
          <span className="balance-tag">
            {walletState.balance.toFixed(3)} ETH
          </span>

          {walletState.mode === 'sandbox' ? (
            <button
              onClick={onConnectMetaMask}
              className="btn-secondary"
              style={{ padding: "0.2rem 0.55rem", fontSize: "0.725rem", borderRadius: "999px" }}
              title="Connect real browser wallet"
            >
              MetaMask
            </button>
          ) : (
            <button
              onClick={onSwitchSandbox}
              className="btn-secondary"
              style={{ padding: "0.2rem 0.55rem", fontSize: "0.725rem", borderRadius: "999px" }}
              title="Switch to local virtual testnet"
            >
              <RefreshCw size={12} /> Sandbox
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
