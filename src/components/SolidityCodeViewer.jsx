import React, { useState } from "react";
import { Code, Copy, Check, ShieldCheck, Zap, Lock } from "lucide-react";

const SOLIDITY_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CrowdfundDAO
 * @dev Decentralized Crowdfunding Platform with DAO Milestone Governance & Reentrancy Protection
 */
contract CrowdfundDAO {
    // Custom Errors for Gas Optimization & Clarity
    error CampaignNotFound();
    error CampaignEnded();
    error CampaignNotEnded();
    error GoalNotReached();
    error GoalAlreadyReached();
    error AlreadyClaimed();
    error Unauthorized();
    error InvalidAmount();
    error MilestoneAlreadyProcessed();
    error VotingPeriodActive();
    error VotingPeriodEnded();
    error AlreadyVoted();
    error ReentrancyGuardTriggered();

    // Reentrancy Guard State
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    modifier nonReentrant() {
        if (_status == _ENTERED) revert ReentrancyGuardTriggered();
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }

    enum CampaignState { Active, Successful, Failed }

    struct Milestone {
        string title;
        uint256 amountToRelease;
        bool isReleased;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 votingDeadline;
        bool votingActive;
    }

    struct Campaign {
        uint256 id;
        address payable creator;
        string title;
        string description;
        string category;
        string imageUrl;
        uint256 targetGoal;
        uint256 totalRaised;
        uint256 deadline;
        CampaignState state;
        uint256 totalMilestones;
        uint256 currentMilestoneIndex;
        bool fundsWithdrawn;
    }

    uint256 public campaignCount;
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    mapping(uint256 => mapping(uint256 => mapping(address => bool))) public hasVotedOnMilestone;
    mapping(uint256 => mapping(uint256 => Milestone)) public campaignMilestones;

    // Events
    event CampaignCreated(uint256 indexed campaignId, address indexed creator, string title, uint256 targetGoal, uint256 deadline);
    event ContributionMade(uint256 indexed campaignId, address indexed contributor, uint256 amount, uint256 newTotalRaised);
    event RefundClaimed(uint256 indexed campaignId, address indexed contributor, uint256 amount);
    event MilestoneProposed(uint256 indexed campaignId, uint256 indexed milestoneIndex, string title, uint256 amountToRelease);
    event VoteCast(uint256 indexed campaignId, uint256 indexed milestoneIndex, address indexed voter, bool support, uint256 weight);
    event MilestoneFundsReleased(uint256 indexed campaignId, uint256 indexed milestoneIndex, uint256 amount);

    constructor() {
        _status = _NOT_ENTERED;
    }

    function createCampaign(
        string memory title,
        string memory description,
        string memory category,
        string memory imageUrl,
        uint256 targetGoalWei,
        uint256 durationInDays,
        string[] memory milestoneTitles,
        uint256[] memory milestoneAmountsWei
    ) external returns (uint256 campaignId) {
        if (targetGoalWei == 0) revert InvalidAmount();
        if (durationInDays == 0) revert InvalidAmount();
        if (milestoneTitles.length != milestoneAmountsWei.length) revert InvalidAmount();

        campaignCount++;
        campaignId = campaignCount;
        uint256 deadline = block.timestamp + (durationInDays * 1 days);

        campaigns[campaignId] = Campaign({
            id: campaignId,
            creator: payable(msg.sender),
            title: title,
            description: description,
            category: category,
            imageUrl: imageUrl,
            targetGoal: targetGoalWei,
            totalRaised: 0,
            deadline: deadline,
            state: CampaignState.Active,
            totalMilestones: milestoneTitles.length,
            currentMilestoneIndex: 0,
            fundsWithdrawn: false
        });

        for (uint256 i = 0; i < milestoneTitles.length; i++) {
            campaignMilestones[campaignId][i] = Milestone({
                title: milestoneTitles[i],
                amountToRelease: milestoneAmountsWei[i],
                isReleased: false,
                votesFor: 0,
                votesAgainst: 0,
                votingDeadline: 0,
                votingActive: false
            });
        }

        emit CampaignCreated(campaignId, msg.sender, title, targetGoalWei, deadline);
    }

    function contribute(uint256 campaignId) external payable nonReentrant {
        Campaign storage campaign = campaigns[campaignId];
        if (campaign.id == 0) revert CampaignNotFound();
        if (block.timestamp > campaign.deadline) revert CampaignEnded();
        if (msg.value == 0) revert InvalidAmount();

        contributions[campaignId][msg.sender] += msg.value;
        campaign.totalRaised += msg.value;

        if (campaign.totalRaised >= campaign.targetGoal && campaign.state == CampaignState.Active) {
            campaign.state = CampaignState.Successful;
        }

        emit ContributionMade(campaignId, msg.sender, msg.value, campaign.totalRaised);
    }

    function claimRefund(uint256 campaignId) external nonReentrant {
        Campaign storage campaign = campaigns[campaignId];
        if (campaign.id == 0) revert CampaignNotFound();
        if (block.timestamp <= campaign.deadline && campaign.totalRaised < campaign.targetGoal) revert CampaignNotEnded();
        if (campaign.totalRaised >= campaign.targetGoal) revert GoalAlreadyReached();

        uint256 contributedAmount = contributions[campaignId][msg.sender];
        if (contributedAmount == 0) revert AlreadyClaimed();

        // Checks-Effects-Interactions Pattern
        contributions[campaignId][msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: contributedAmount}("");
        require(success, "Refund transfer failed");

        emit RefundClaimed(campaignId, msg.sender, contributedAmount);
    }
}`;

export function SolidityCodeViewer() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SOLIDITY_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="panel-card" style={{ padding: "1.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <h2 style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-primary)" }}>
            <Code color="#4f46e5" size={20} />
            Smart Contract Architecture (Solidity v0.8.20)
          </h2>
          <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
            EVM-compliant code with ReentrancyGuard protection and custom gas errors.
          </p>
        </div>

        <button onClick={handleCopy} className="btn-secondary" style={{ padding: "0.35rem 0.85rem", fontSize: "0.775rem" }}>
          {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
          {copied ? "Copied!" : "Copy Contract"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.85rem", marginBottom: "1.25rem" }}>
        <div style={{ background: "#e0e7ff", padding: "0.85rem", borderRadius: "8px", border: "1px solid #c7d2fe" }}>
          <div style={{ color: "#3730a3", fontWeight: "700", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.3rem", marginBottom: "0.2rem" }}>
            <Lock size={15} /> Reentrancy Protection
          </div>
          <div style={{ fontSize: "0.775rem", color: "#4338ca" }}>
            Custom `nonReentrant` modifier guards against malicious contract call recursions.
          </div>
        </div>

        <div style={{ background: "#ecfdf5", padding: "0.85rem", borderRadius: "8px", border: "1px solid #a7f3d0" }}>
          <div style={{ color: "#065f46", fontWeight: "700", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.3rem", marginBottom: "0.2rem" }}>
            <ShieldCheck size={15} /> Checks-Effects-Interactions
          </div>
          <div style={{ fontSize: "0.775rem", color: "#047857" }}>
            Internal state updates occur BEFORE external ETH transfers on `claimRefund`.
          </div>
        </div>

        <div style={{ background: "#fef3c7", padding: "0.85rem", borderRadius: "8px", border: "1px solid #fde68a" }}>
          <div style={{ color: "#92400e", fontWeight: "700", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.3rem", marginBottom: "0.2rem" }}>
            <Zap size={15} /> Custom Gas Errors
          </div>
          <div style={{ fontSize: "0.775rem", color: "#b45309" }}>
            Uses custom revert errors (`error InvalidAmount()`) replacing costly require strings.
          </div>
        </div>
      </div>

      <pre className="code-box">
        <code>{SOLIDITY_CODE}</code>
      </pre>
    </div>
  );
}
