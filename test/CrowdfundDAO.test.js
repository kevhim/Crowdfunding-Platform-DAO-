import { describe, it, expect, beforeEach } from "vitest";
import { web3Service } from "../src/services/web3Service";

describe("CrowdfundDAO Smart Contract & Service Tests", () => {
  beforeEach(() => {
    web3Service.resetSandboxData();
  });

  it("should initialize default campaigns correctly", () => {
    const campaigns = web3Service.getCampaigns();
    expect(campaigns.length).toBeGreaterThanOrEqual(4);
    expect(campaigns[0].title).toContain("EcoGrid");
    expect(campaigns[1].state).toBe("Successful");
  });

  it("should allow contributing ETH to an active campaign", async () => {
    const initialBalance = web3Service.userBalanceEth;
    const tx = await web3Service.contribute(1, "1.0");

    expect(tx.hash).toBeDefined();
    expect(web3Service.userBalanceEth).toBeCloseTo(initialBalance - 1.0);
    expect(web3Service.userContributions[1]).toBe(5.5); // Initial 4.5 + 1.0
  });

  it("should reject contribution with invalid or zero amount", async () => {
    await expect(web3Service.contribute(1, "0")).rejects.toThrow("Invalid contribution amount");
    await expect(web3Service.contribute(1, "-1.5")).rejects.toThrow("Invalid contribution amount");
  });

  it("should reject contribution exceeding user wallet balance", async () => {
    await expect(web3Service.contribute(1, "9999.0")).rejects.toThrow("Insufficient ETH balance");
  });

  it("should prevent funding an expired campaign", async () => {
    // Campaign ID 4 is expired
    await expect(web3Service.contribute(4, "0.5")).rejects.toThrow("Campaign has expired");
  });

  it("should deploy a new crowdfunding campaign with milestones", async () => {
    const res = await web3Service.createCampaign({
      title: "Quantum Key Distribution Network",
      description: "Satellite-based QKD for unhackable encryption key exchange.",
      category: "Web3 Security & ZK",
      targetGoalEth: "12.0",
      durationDays: "14",
      imageUrl: "",
      milestones: [
        { title: "Hardware Photonic Detector Assembly", amountEth: "6.0" },
        { title: "Orbital Payload Launch", amountEth: "6.0" }
      ]
    });

    expect(res.campaignId).toBeDefined();
    const created = web3Service.getCampaignById(res.campaignId);
    expect(created.title).toBe("Quantum Key Distribution Network");
    expect(created.milestones.length).toBe(2);
  });

  it("should allow proposing a milestone payout for creator", async () => {
    const tx = await web3Service.proposeMilestone(1, 1);
    expect(tx.hash).toBeDefined();
    const campaign = web3Service.getCampaignById(1);
    expect(campaign.milestones[1].votingActive).toBe(true);
  });

  it("should handle backer voting on milestone proposal", async () => {
    // Campaign 1 milestone index 1 is voting active
    const tx = await web3Service.voteOnMilestone(1, 1, true);
    expect(tx.hash).toBeDefined();
    expect(tx.weight).toBe(4.5); // User's contribution weight

    // Should block double voting
    await expect(web3Service.voteOnMilestone(1, 1, true)).rejects.toThrow("already cast your vote");
  });

  it("should prevent non-backers from voting on milestones", async () => {
    // Campaign 2 user contribution is 0
    await expect(web3Service.voteOnMilestone(2, 1, true)).rejects.toThrow("Only campaign backers");
  });

  it("should execute milestone release payout when majority votes approve", async () => {
    const initialCreatorBal = web3Service.userBalanceEth;
    // Execute release on approved milestone (votesFor > votesAgainst)
    const tx = await web3Service.executeMilestoneRelease(1, 1);
    expect(tx.approved).toBe(true);

    const campaign = web3Service.getCampaignById(1);
    expect(campaign.milestones[1].isReleased).toBe(true);
  });

  it("should allow claiming refund for expired failed campaign", async () => {
    // Campaign 4 is expired and failed
    const initialBal = web3Service.userBalanceEth;
    const userContributionBefore = web3Service.userContributions[4]; // 2.5 ETH
    expect(userContributionBefore).toBe(2.5);

    const tx = await web3Service.claimRefund(4);
    expect(tx.refundAmount).toBe(2.5);
    expect(web3Service.userContributions[4]).toBe(0);
    expect(web3Service.userBalanceEth).toBe(initialBal + 2.5);
  });

  it("should reject refund claims if campaign reached its funding target", async () => {
    // Campaign 2 is successful
    await expect(web3Service.claimRefund(2)).rejects.toThrow("Campaign reached target goal");
  });
});
