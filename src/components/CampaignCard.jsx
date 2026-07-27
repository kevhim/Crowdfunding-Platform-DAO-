import React from "react";
import { Clock, Users, ArrowUpRight } from "lucide-react";

export function CampaignCard({ campaign, onSelect }) {
  const percentRaised = Math.min(100, (campaign.totalRaisedEth / campaign.targetGoalEth) * 100);
  const daysLeft = Math.max(0, Math.ceil((campaign.deadlineTimestamp - Date.now()) / (1000 * 60 * 60 * 24)));

  const getBadgeClass = (state) => {
    if (state === "Successful") return "badge-successful";
    if (state === "Failed") return "badge-failed";
    return "badge-active";
  };

  return (
    <div className="glass-card" onClick={() => onSelect(campaign)} style={{ cursor: "pointer" }}>
      <div className="campaign-card-img-wrapper">
        <img src={campaign.imageUrl} alt={campaign.title} className="campaign-card-img" />
        <span className="category-tag">{campaign.category}</span>
        <span className={`state-badge ${getBadgeClass(campaign.state)}`}>
          {campaign.state}
        </span>
      </div>

      <div className="campaign-card-body">
        <div>
          <h3 className="campaign-title">{campaign.title}</h3>
          <p className="campaign-desc">{campaign.description}</p>
        </div>

        <div>
          <div className="progress-container">
            <div className="progress-header">
              <span className="font-semibold" style={{ fontWeight: "700", color: "var(--text-primary)" }}>
                {campaign.totalRaisedEth.toFixed(2)} ETH
              </span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.775rem" }}>
                Goal: {campaign.targetGoalEth} ETH ({percentRaised.toFixed(0)}%)
              </span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${percentRaised}%` }}></div>
            </div>
          </div>

          <div className="campaign-footer">
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Clock size={13} color="#64748b" />
              <span>{daysLeft} days left</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Users size={13} color="#64748b" />
              <span>{campaign.backers.length} backers</span>
            </div>
            <button className="btn-secondary" style={{ padding: "0.25rem 0.55rem", fontSize: "0.75rem" }}>
              View <ArrowUpRight size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
