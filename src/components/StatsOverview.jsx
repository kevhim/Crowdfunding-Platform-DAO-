import React from "react";
import { Coins, Users, Target, ShieldCheck } from "lucide-react";

export function StatsOverview({ campaigns }) {
  const totalRaised = campaigns.reduce((acc, c) => acc + c.totalRaisedEth, 0);
  const totalBackersCount = campaigns.reduce((acc, c) => acc + c.backers.length, 0);
  const activeCampaignsCount = campaigns.filter(c => c.state === "Active").length;
  const successfulCount = campaigns.filter(c => c.state === "Successful").length;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon-box" style={{ color: "#4f46e5", background: "#e0e7ff" }}>
          <Coins size={22} />
        </div>
        <div>
          <div className="stat-val">{totalRaised.toFixed(2)} ETH</div>
          <div className="stat-lbl">Total Value Funded</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-box" style={{ color: "#0284c7", background: "#e0f2fe" }}>
          <Users size={22} />
        </div>
        <div>
          <div className="stat-val">{totalBackersCount}</div>
          <div className="stat-lbl">Total On-Chain Backers</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-box" style={{ color: "#059669", background: "#ecfdf5" }}>
          <Target size={22} />
        </div>
        <div>
          <div className="stat-val">{activeCampaignsCount} Active</div>
          <div className="stat-lbl">{successfulCount} Target Goals Met</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-box" style={{ color: "#d97706", background: "#fef3c7" }}>
          <ShieldCheck size={22} />
        </div>
        <div>
          <div className="stat-val" style={{ fontSize: "1.15rem" }}>DAO Protected</div>
          <div className="stat-lbl">Milestone Payout Security</div>
        </div>
      </div>
    </div>
  );
}
