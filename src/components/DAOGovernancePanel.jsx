import React from "react";
import { Vote, CheckCircle2, Shield, Clock } from "lucide-react";

export function DAOGovernancePanel({ campaigns, userAddress, userContributions, onVote }) {
  const activeProposals = [];
  campaigns.forEach(c => {
    c.milestones.forEach((m, mIdx) => {
      if (m.votingActive) {
        activeProposals.push({
          campaignId: c.id,
          campaignTitle: c.title,
          milestoneIndex: mIdx,
          milestoneTitle: m.title,
          amountEth: m.amountEth,
          votesForEth: m.votesForEth,
          votesAgainstEth: m.votesAgainstEth,
          votingDeadline: m.votingDeadline,
          userWeight: userContributions[c.id] || 0
        });
      }
    });
  });

  return (
    <div className="panel-card" style={{ padding: "1.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <h2 style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-primary)" }}>
            <Shield color="#0d9488" size={20} />
            DAO Milestone Governance Dashboard
          </h2>
          <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
            Backers vote on creator payout proposals. Voting power is proportional to ETH contributed.
          </p>
        </div>
        <span className="category-tag">
          {activeProposals.length} Active Proposals
        </span>
      </div>

      {activeProposals.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2.5rem 1rem", border: "1px dashed var(--border-color)", borderRadius: "10px", background: "var(--bg-subtle)" }}>
          <CheckCircle2 size={36} color="#10b981" style={{ margin: "0 auto 0.75rem auto" }} />
          <h3 style={{ fontSize: "1rem", marginBottom: "0.25rem", color: "var(--text-primary)" }}>No Pending Proposals</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.825rem", maxWidth: "440px", margin: "0 auto" }}>
            All milestone funds are currently locked or have already been executed by past DAO consensus.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {activeProposals.map((p, idx) => {
            const total = p.votesForEth + p.votesAgainstEth;
            const percentFor = total > 0 ? (p.votesForEth / total) * 100 : 50;

            return (
              <div key={idx} style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.6rem" }}>
                  <div>
                    <span style={{ fontSize: "0.725rem", color: "var(--primary-brand)", fontWeight: "700" }}>
                      CAMPAIGN: {p.campaignTitle}
                    </span>
                    <h3 style={{ fontSize: "1rem", color: "var(--text-primary)", marginTop: "0.1rem" }}>
                      Release {p.amountEth} ETH for: {p.milestoneTitle}
                    </h3>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "#d97706", background: "#fef3c7", padding: "0.15rem 0.5rem", borderRadius: "999px" }}>
                    <Clock size={12} /> Voting Active
                  </div>
                </div>

                <div style={{ marginBottom: "0.85rem", background: "var(--bg-subtle)", padding: "0.75rem", borderRadius: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.775rem", marginBottom: "0.3rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Consensus Ratio ({percentFor.toFixed(1)}% For)</span>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
                      For: {p.votesForEth.toFixed(2)} ETH | Against: {p.votesAgainstEth.toFixed(2)} ETH
                    </span>
                  </div>
                  <div className="progress-bar-bg" style={{ height: "6px" }}>
                    <div className="progress-bar-fill" style={{ width: `${percentFor}%`, background: "var(--accent-emerald)" }}></div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    Your Voting Power: <span style={{ color: "var(--accent-emerald)", fontWeight: "700", fontFamily: "var(--font-mono)" }}>{p.userWeight.toFixed(2)} ETH</span>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => onVote(p.campaignId, p.milestoneIndex, true)}
                      className="btn-success"
                      style={{ padding: "0.3rem 0.85rem", fontSize: "0.75rem" }}
                      disabled={p.userWeight === 0}
                    >
                      <Vote size={13} /> Approve Payout
                    </button>
                    <button
                      onClick={() => onVote(p.campaignId, p.milestoneIndex, false)}
                      className="btn-secondary"
                      style={{ padding: "0.3rem 0.85rem", fontSize: "0.75rem" }}
                      disabled={p.userWeight === 0}
                    >
                      Reject Payout
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
