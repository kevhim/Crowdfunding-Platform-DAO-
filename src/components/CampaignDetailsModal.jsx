import React, { useState } from "react";
import { X, Send, Vote, CheckCircle2, AlertTriangle, Layers, Download, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";

export function CampaignDetailsModal({
  campaign,
  userAddress,
  userContribution,
  onClose,
  onContribute,
  onVote,
  onProposeMilestone,
  onExecuteRelease,
  onClaimRefund
}) {
  const [fundAmount, setFundAmount] = useState("0.5");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("fund"); // 'fund' | 'milestones' | 'backers'

  const percentRaised = Math.min(100, (campaign.totalRaisedEth / campaign.targetGoalEth) * 100);
  const isCreator = campaign.creator.toLowerCase() === userAddress.toLowerCase();
  const isExpired = Date.now() > campaign.deadlineTimestamp;
  const isGoalFailed = isExpired && campaign.totalRaisedEth < campaign.targetGoalEth;

  const handleFundSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onContribute(campaign.id, fundAmount);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
      setFundAmount("0.5");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaimRefund = async () => {
    setIsSubmitting(true);
    try {
      await onClaimRefund(campaign.id);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(campaign, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `pulsedao_campaign_${campaign.id}_audit.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="category-tag" style={{ position: "static", display: "inline-block", marginBottom: "0.35rem" }}>
              {campaign.category}
            </span>
            <h2 style={{ fontSize: "1.25rem", color: "var(--text-primary)" }}>{campaign.title}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Modal Tab Control */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div className="nav-tabs">
              <button
                className={`nav-tab ${activeTab === 'fund' ? 'active' : ''}`}
                onClick={() => setActiveTab('fund')}
              >
                Overview & Funding
              </button>
              <button
                className={`nav-tab ${activeTab === 'milestones' ? 'active' : ''}`}
                onClick={() => setActiveTab('milestones')}
              >
                <Layers size={13} /> DAO Milestones ({campaign.milestones.length})
              </button>
              <button
                className={`nav-tab ${activeTab === 'backers' ? 'active' : ''}`}
                onClick={() => setActiveTab('backers')}
              >
                On-Chain Backers ({campaign.backers.length})
              </button>
            </div>

            <button onClick={handleExportJSON} className="btn-secondary" style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem" }} title="Export Audit JSON">
              <Download size={13} /> Audit JSON
            </button>
          </div>

          {activeTab === 'fund' && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div>
                  <img
                    src={campaign.imageUrl}
                    alt={campaign.title}
                    style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "10px", border: "1px solid var(--border-color)" }}
                  />
                </div>
                <div>
                  <div className="progress-container" style={{ marginBottom: "1rem" }}>
                    <div className="progress-header">
                      <span style={{ fontWeight: "700", fontSize: "1.1rem", color: "var(--primary-indigo)" }}>
                        {campaign.totalRaisedEth.toFixed(2)} ETH
                      </span>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Goal: {campaign.targetGoalEth} ETH</span>
                    </div>
                    <div className="progress-bar-bg" style={{ height: "8px" }}>
                      <div className="progress-bar-fill" style={{ width: `${percentRaised}%` }}></div>
                    </div>
                  </div>

                  <div style={{ background: "var(--bg-subtle)", padding: "0.85rem", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "0.825rem", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                      <span style={{ color: "var(--text-secondary)" }}>Creator Address:</span>
                      <span style={{ fontFamily: "var(--font-mono)", color: "var(--primary-indigo)" }}>
                        {campaign.creator.slice(0, 6)}...{campaign.creator.slice(-4)}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--text-secondary)" }}>Your Contribution:</span>
                      <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-emerald)", fontWeight: "700" }}>
                        {(userContribution || 0).toFixed(2)} ETH
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.55", marginBottom: "1.25rem" }}>
                {campaign.description}
              </p>

              {/* Fund Action Form or Refund Alert */}
              {isGoalFailed ? (
                <div style={{ background: "var(--accent-red-light)", padding: "1.25rem", borderRadius: "10px", border: "1px solid #fecaca" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#b91c1c", fontWeight: "600", marginBottom: "0.5rem" }}>
                    <AlertTriangle size={18} /> Campaign Expired Without Meeting Goal
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "#7f1d1d", marginBottom: "1rem" }}>
                    Because the campaign deadline passed before meeting the target, all backers can claim 100% of their contributed ETH back via the contract's `claimRefund()` function.
                  </p>
                  {userContribution > 0 ? (
                    <button onClick={handleClaimRefund} className="btn-secondary" disabled={isSubmitting} style={{ borderColor: "#fca5a5", color: "#b91c1c" }}>
                      <RefreshCw size={14} /> Claim Refund ({userContribution.toFixed(2)} ETH)
                    </button>
                  ) : (
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>You have 0 ETH contributed to refund.</div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleFundSubmit} style={{ background: "#f8fafc", padding: "1.1rem", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                  <h4 style={{ marginBottom: "0.6rem", fontSize: "0.925rem", color: "var(--text-primary)" }}>Contribute ETH to Campaign</h4>
                  <div style={{ display: "flex", gap: "0.6rem" }}>
                    <input
                      type="number"
                      step="0.05"
                      min="0.01"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                      className="form-input"
                      style={{ flex: 1 }}
                      placeholder="ETH Amount (e.g. 0.5)"
                      required
                    />
                    <button type="submit" className="btn-primary" disabled={isSubmitting}>
                      <Send size={15} />
                      {isSubmitting ? "Processing..." : "Fund On-Chain"}
                    </button>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
                    ≈ ${(parseFloat(fundAmount || 0) * 3250).toLocaleString()} USD • Protected by Smart Contract ReentrancyGuard
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === 'milestones' && (
            <div>
              <div style={{ marginBottom: "1rem", fontSize: "0.825rem", color: "var(--text-secondary)" }}>
                Funds are released incrementally to creator wallet only after receiving majority vote approval from campaign backers.
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {campaign.milestones.map((m, idx) => {
                  const totalVotes = m.votesForEth + m.votesAgainstEth;
                  const percentFor = totalVotes > 0 ? (m.votesForEth / totalVotes) * 100 : 0;

                  return (
                    <div key={idx} style={{ background: "#ffffff", padding: "1rem", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                        <div>
                          <span style={{ fontSize: "0.725rem", color: "var(--primary-indigo)", fontWeight: "700" }}>
                            MILESTONE #{idx + 1}
                          </span>
                          <h4 style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>{m.title}</h4>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontFamily: "var(--font-mono)", fontWeight: "700", color: "var(--accent-emerald)", fontSize: "0.9rem" }}>
                            {m.amountEth} ETH
                          </span>
                          {m.isReleased ? (
                            <div style={{ color: "var(--accent-emerald)", fontSize: "0.725rem", display: "flex", alignItems: "center", gap: "0.2rem", justifyContent: "flex-end", marginTop: "0.1rem" }}>
                              <CheckCircle2 size={12} /> Released
                            </div>
                          ) : m.votingActive ? (
                            <div style={{ color: "var(--accent-amber)", fontSize: "0.725rem", fontWeight: "600" }}>
                              Voting Active
                            </div>
                          ) : (
                            <div style={{ color: "var(--text-muted)", fontSize: "0.725rem" }}>
                              Locked
                            </div>
                          )}
                        </div>
                      </div>

                      {m.votingActive && (
                        <div style={{ marginTop: "0.6rem", background: "#fef3c7", padding: "0.75rem", borderRadius: "8px", border: "1px solid #fde68a" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.775rem", marginBottom: "0.3rem" }}>
                            <span style={{ color: "#92400e", fontWeight: "600" }}>Backer Consensus</span>
                            <span style={{ fontFamily: "var(--font-mono)", color: "#78350f" }}>For: {m.votesForEth.toFixed(2)} ETH | Against: {m.votesAgainstEth.toFixed(2)} ETH</span>
                          </div>
                          <div className="progress-bar-bg" style={{ height: "6px", marginBottom: "0.6rem" }}>
                            <div className="progress-bar-fill" style={{ width: `${percentFor}%`, background: "var(--accent-emerald)" }}></div>
                          </div>

                          <div style={{ display: "flex", gap: "0.4rem" }}>
                            <button
                              onClick={() => onVote(campaign.id, idx, true)}
                              className="btn-success"
                              style={{ padding: "0.25rem 0.65rem", fontSize: "0.75rem" }}
                            >
                              <Vote size={12} /> Vote Approve
                            </button>
                            <button
                              onClick={() => onVote(campaign.id, idx, false)}
                              className="btn-secondary"
                              style={{ padding: "0.25rem 0.65rem", fontSize: "0.75rem" }}
                            >
                              Vote Reject
                            </button>
                            {isCreator && (
                              <button
                                onClick={() => onExecuteRelease(campaign.id, idx)}
                                className="btn-primary"
                                style={{ padding: "0.25rem 0.65rem", fontSize: "0.75rem", marginLeft: "auto" }}
                              >
                                Finalize Payout
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {!m.isReleased && !m.votingActive && isCreator && (
                        <div style={{ marginTop: "0.4rem" }}>
                          <button
                            onClick={() => onProposeMilestone(campaign.id, idx)}
                            className="btn-secondary"
                            style={{ padding: "0.25rem 0.65rem", fontSize: "0.75rem" }}
                          >
                            Propose Payout to DAO
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'backers' && (
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {campaign.backers.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    No backer transactions yet. Be the first to back this campaign!
                  </div>
                ) : (
                  campaign.backers.map((b, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.65rem 0.85rem", background: "var(--bg-subtle)", border: "1px solid var(--border-color)", borderRadius: "8px", fontSize: "0.825rem" }}>
                      <div style={{ fontFamily: "var(--font-mono)", color: "var(--primary-indigo)" }}>
                        {b.address.slice(0, 8)}...{b.address.slice(-6)}
                      </div>
                      <div style={{ display: "flex", gap: "0.85rem", alignItems: "center" }}>
                        <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-emerald)", fontWeight: "700" }}>
                          +{b.amountEth} ETH
                        </span>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                          {b.time}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
