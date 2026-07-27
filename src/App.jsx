import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Header } from "./components/Header";
import { StatsOverview } from "./components/StatsOverview";
import { CampaignCard } from "./components/CampaignCard";
import { CampaignDetailsModal } from "./components/CampaignDetailsModal";
import { CreateCampaignModal } from "./components/CreateCampaignModal";
import { DAOGovernancePanel } from "./components/DAOGovernancePanel";
import { SolidityCodeViewer } from "./components/SolidityCodeViewer";
import { web3Service } from "./services/web3Service";
import { Search, CheckCircle2 } from "lucide-react";

/**
 * @file App.jsx
 * @description Main application container for PulseDAO Decentralized Crowdfunding Platform.
 * Implements React performance best practices (useCallback, useMemo) and web3 state management.
 */
export function App() {
  const [walletState, setWalletState] = useState({
    mode: "sandbox",
    address: web3Service.userAddress,
    balance: web3Service.userBalanceEth
  });

  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("explore"); // 'explore' | 'dao' | 'code'
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toastMessage, setToastMessage] = useState(null);

  // Synchronize campaign list on initial mount
  useEffect(() => {
    setCampaigns([...web3Service.getCampaigns()]);
  }, []);

  // Helper toast notification launcher
  const showToast = useCallback((title, hash, block) => {
    setToastMessage({ title, hash, block });
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const handleResetDemo = useCallback(() => {
    const res = web3Service.resetSandboxData();
    setWalletState({
      mode: "sandbox",
      address: web3Service.userAddress,
      balance: res.balance
    });
    setCampaigns([...web3Service.getCampaigns()]);
    setSelectedCampaign(null);
    showToast("Sandbox data restored to initial state", null, null);
  }, [showToast]);

  const handleConnectMetaMask = useCallback(async () => {
    const res = await web3Service.connectMetaMask();
    setWalletState({
      mode: res.mode,
      address: res.address,
      balance: res.balance
    });
    showToast("Connected to MetaMask Wallet", null, null);
  }, [showToast]);

  const handleSwitchSandbox = useCallback(() => {
    const res = web3Service.switchToSandbox();
    setWalletState({
      mode: res.mode,
      address: res.address,
      balance: res.balance
    });
    showToast("Switched to Virtual Sandbox", null, null);
  }, [showToast]);

  const handleContribute = useCallback(async (campaignId, amountEth) => {
    const tx = await web3Service.contribute(campaignId, amountEth);
    setWalletState(prev => ({ ...prev, balance: tx.userNewBalanceEth }));
    setCampaigns([...web3Service.getCampaigns()]);
    setSelectedCampaign(prev => prev && prev.id === campaignId ? { ...web3Service.getCampaignById(campaignId) } : prev);
    showToast(`Funded ${amountEth} ETH successfully!`, tx.hash, tx.blockNumber);
  }, [showToast]);

  const handleClaimRefund = useCallback(async (campaignId) => {
    const tx = await web3Service.claimRefund(campaignId);
    setWalletState(prev => ({ ...prev, balance: web3Service.userBalanceEth }));
    setCampaigns([...web3Service.getCampaigns()]);
    setSelectedCampaign(prev => prev && prev.id === campaignId ? { ...web3Service.getCampaignById(campaignId) } : prev);
    showToast(`Refund of ${tx.refundAmount.toFixed(2)} ETH Processed!`, tx.hash, tx.blockNumber);
  }, [showToast]);

  const handleCreateCampaign = useCallback(async (newCampaignData) => {
    const tx = await web3Service.createCampaign(newCampaignData);
    setCampaigns([...web3Service.getCampaigns()]);
    showToast("Campaign Deployed to Blockchain!", tx.hash, tx.blockNumber);
  }, [showToast]);

  const handleProposeMilestone = useCallback(async (campaignId, milestoneIndex) => {
    const tx = await web3Service.proposeMilestone(campaignId, milestoneIndex);
    setCampaigns([...web3Service.getCampaigns()]);
    setSelectedCampaign(prev => prev && prev.id === campaignId ? { ...web3Service.getCampaignById(campaignId) } : prev);
    showToast("Milestone Payout Proposed to DAO", tx.hash, tx.blockNumber);
  }, [showToast]);

  const handleVote = useCallback(async (campaignId, milestoneIndex, support) => {
    try {
      const tx = await web3Service.voteOnMilestone(campaignId, milestoneIndex, support);
      setCampaigns([...web3Service.getCampaigns()]);
      setSelectedCampaign(prev => prev && prev.id === campaignId ? { ...web3Service.getCampaignById(campaignId) } : prev);
      showToast(`Cast ${support ? 'APPROVE' : 'REJECT'} Vote (${tx.weight.toFixed(2)} ETH Power)`, tx.hash, tx.blockNumber);
    } catch (err) {
      alert(err.message);
    }
  }, [showToast]);

  const handleExecuteRelease = useCallback(async (campaignId, milestoneIndex) => {
    const tx = await web3Service.executeMilestoneRelease(campaignId, milestoneIndex);
    setWalletState(prev => ({ ...prev, balance: web3Service.userBalanceEth }));
    setCampaigns([...web3Service.getCampaigns()]);
    setSelectedCampaign(prev => prev && prev.id === campaignId ? { ...web3Service.getCampaignById(campaignId) } : prev);
    showToast(tx.approved ? "Milestone Payout Executed!" : "Milestone Payout Rejected", tx.hash, tx.blockNumber);
  }, [showToast]);

  // Memoize search & category filtering for optimal rendering performance
  const filteredCampaigns = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return campaigns.filter(c => {
      const matchesSearch = !query || c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query);
      const matchesCategory = categoryFilter === "All" || c.category === categoryFilter;
      const matchesStatus = statusFilter === "All" || c.state === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [campaigns, searchQuery, categoryFilter, statusFilter]);

  return (
    <div className="app-container">
      <Header
        walletState={walletState}
        onConnectMetaMask={handleConnectMetaMask}
        onSwitchSandbox={handleSwitchSandbox}
        onOpenCreateModal={() => setIsCreateOpen(true)}
        onResetDemo={handleResetDemo}
      />

      <StatsOverview campaigns={campaigns} />

      {/* Main Tab Navigation & Controls */}
      <div className="controls-bar">
        <div className="nav-tabs">
          <button
            className={`nav-tab ${currentTab === 'explore' ? 'active' : ''}`}
            onClick={() => setCurrentTab('explore')}
          >
            Explore Campaigns
          </button>
          <button
            className={`nav-tab ${currentTab === 'dao' ? 'active' : ''}`}
            onClick={() => setCurrentTab('dao')}
          >
            DAO Milestone Governance
          </button>
          <button
            className={`nav-tab ${currentTab === 'code' ? 'active' : ''}`}
            onClick={() => setCurrentTab('code')}
          >
            Solidity Architecture
          </button>
        </div>

        {currentTab === 'explore' && (
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <Search size={15} style={{ position: "absolute", left: "0.65rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: "2rem", width: "210px", height: "36px", fontSize: "0.85rem" }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
              style={{ width: "130px", height: "36px", padding: "0.3rem 0.65rem", fontSize: "0.85rem" }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Successful">Successful</option>
              <option value="Failed">Expired/Failed</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-select"
              style={{ width: "175px", height: "36px", padding: "0.3rem 0.65rem", fontSize: "0.85rem" }}
            >
              <option value="All">All Categories</option>
              <option value="DeAI & Infrastructure">DeAI & Infrastructure</option>
              <option value="Clean Tech & Energy">Clean Tech & Energy</option>
              <option value="Web3 Security & ZK">Web3 Security & ZK</option>
            </select>
          </div>
        )}
      </div>

      {/* Content views */}
      {currentTab === 'explore' && (
        <div className="campaigns-grid">
          {filteredCampaigns.map(c => (
            <CampaignCard
              key={c.id}
              campaign={c}
              onSelect={setSelectedCampaign}
            />
          ))}
        </div>
      )}

      {currentTab === 'dao' && (
        <DAOGovernancePanel
          campaigns={campaigns}
          userAddress={walletState.address}
          userContributions={web3Service.userContributions}
          onVote={handleVote}
        />
      )}

      {currentTab === 'code' && (
        <SolidityCodeViewer />
      )}

      {/* Modals */}
      {selectedCampaign && (
        <CampaignDetailsModal
          campaign={selectedCampaign}
          userAddress={walletState.address}
          userContribution={web3Service.userContributions[selectedCampaign.id] || 0}
          onClose={() => setSelectedCampaign(null)}
          onContribute={handleContribute}
          onVote={handleVote}
          onProposeMilestone={handleProposeMilestone}
          onExecuteRelease={handleExecuteRelease}
          onClaimRefund={handleClaimRefund}
        />
      )}

      {isCreateOpen && (
        <CreateCampaignModal
          onClose={() => setIsCreateOpen(false)}
          onCreate={handleCreateCampaign}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <CheckCircle2 color="#10b981" size={18} />
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)" }}>{toastMessage.title}</div>
              {toastMessage.hash && (
                <div style={{ fontSize: "0.725rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                  Tx: {toastMessage.hash.slice(0, 10)}...{toastMessage.hash.slice(-8)} • Block #{toastMessage.block}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
