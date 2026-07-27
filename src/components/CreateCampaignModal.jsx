import React, { useState } from "react";
import { X, Plus, Trash2, Rocket } from "lucide-react";

export function CreateCampaignModal({ onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("DeAI & Infrastructure");
  const [description, setDescription] = useState("");
  const [targetGoalEth, setTargetGoalEth] = useState("10.0");
  const [durationDays, setDurationDays] = useState("14");
  const [imageUrl, setImageUrl] = useState("");

  const [milestones, setMilestones] = useState([
    { title: "Prototype Development & Core Setup", amountEth: "5.0" },
    { title: "Public Deployment & Mainnet Release", amountEth: "5.0" }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const addMilestone = () => {
    setMilestones([...milestones, { title: "", amountEth: "1.0" }]);
  };

  const removeMilestone = (index) => {
    if (milestones.length <= 1) return;
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (index, field, value) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onCreate({
        title,
        category,
        description,
        targetGoalEth,
        durationDays,
        imageUrl,
        milestones
      });
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Rocket color="#4f46e5" size={20} />
            <h2 style={{ fontSize: "1.2rem", color: "var(--text-primary)" }}>Launch Crowdfunding Campaign</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label className="form-label">Project Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              placeholder="e.g. Decentralized Storage Indexer"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
              >
                <option value="DeAI & Infrastructure">DeAI & Infrastructure</option>
                <option value="Clean Tech & Energy">Clean Tech & Energy</option>
                <option value="Web3 Security & ZK">Web3 Security & ZK</option>
                <option value="DeFi & Governance">DeFi & Governance</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Funding Goal (ETH)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={targetGoalEth}
                onChange={(e) => setTargetGoalEth(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
            <div className="form-group">
              <label className="form-label">Duration (Days)</label>
              <input
                type="number"
                min="1"
                max="90"
                required
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cover Image URL (Optional)</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="form-input"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              placeholder="Describe the mission, technical architecture, and impact of your project..."
            />
          </div>

          {/* Dynamic Milestones */}
          <div style={{ marginTop: "1.25rem", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
              <label className="form-label" style={{ marginBottom: 0 }}>DAO Milestone Payout Roadmap</label>
              <button type="button" onClick={addMilestone} className="btn-secondary" style={{ padding: "0.2rem 0.5rem", fontSize: "0.725rem" }}>
                <Plus size={12} /> Add Milestone
              </button>
            </div>

            {milestones.map((m, idx) => (
              <div key={idx} style={{ display: "flex", gap: "0.4rem", marginBottom: "0.4rem", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)", width: "20px" }}>
                  #{idx + 1}
                </span>
                <input
                  type="text"
                  required
                  placeholder="Milestone title..."
                  value={m.title}
                  onChange={(e) => updateMilestone(idx, "title", e.target.value)}
                  className="form-input"
                  style={{ flex: 2 }}
                />
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="ETH"
                  value={m.amountEth}
                  onChange={(e) => updateMilestone(idx, "amountEth", e.target.value)}
                  className="form-input"
                  style={{ flex: 1 }}
                />
                {milestones.length > 1 && (
                  <button type="button" onClick={() => removeMilestone(idx)} className="close-btn" style={{ padding: "0.3rem" }}>
                    <Trash2 size={15} color="#ef4444" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: "1.25rem", display: "flex", justifyContent: "flex-end", gap: "0.6rem" }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Deploying..." : "Deploy Campaign On-Chain"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
