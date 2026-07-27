// Web3 Service & Ethereum Sandbox Engine
import { ethers } from "ethers";

// Seed campaigns for instant interactive experience
const INITIAL_CAMPAIGN_DATA = [
  {
    id: 1,
    creator: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    title: "EcoGrid: Autonomous Solar Microgrids for Off-Grid Villages",
    description: "Deploying solar microgrids managed by smart contract IoT sensors to bring clean power and decentralized energy trading to underserved rural regions.",
    category: "Clean Tech & Energy",
    imageUrl: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80",
    targetGoalEth: 15.0,
    totalRaisedEth: 11.45,
    deadlineTimestamp: Date.now() + 14 * 86400 * 1000, // 14 days left
    state: "Active",
    totalMilestones: 3,
    currentMilestoneIndex: 1,
    milestones: [
      {
        title: "Hardware Procurement & Inverter Fabrication",
        amountEth: 5.0,
        isReleased: true,
        votesForEth: 10.2,
        votesAgainstEth: 0.1,
        votingDeadline: Date.now() - 86400 * 1000,
        votingActive: false
      },
      {
        title: "Phase 1 Grid Deployment & IoT Node Setup",
        amountEth: 6.0,
        isReleased: false,
        votesForEth: 8.4,
        votesAgainstEth: 1.2,
        votingDeadline: Date.now() + 3 * 86400 * 1000,
        votingActive: true
      },
      {
        title: "Peer-to-Peer Energy Market Smart Contracts",
        amountEth: 4.0,
        isReleased: false,
        votesForEth: 0,
        votesAgainstEth: 0,
        votingDeadline: 0,
        votingActive: false
      }
    ],
    backers: [
      { address: "0x3C44CdD45969421E448784403B2CA28125659524", amountEth: 4.5, time: "2 hours ago" },
      { address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", amountEth: 3.2, time: "1 day ago" },
      { address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", amountEth: 3.75, time: "3 days ago" }
    ]
  },
  {
    id: 2,
    creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    title: "Aegis Privacy: Zero-Knowledge Encrypted Vault for dApps",
    description: "A client-side ZK-SNARK privacy protocol enabling anonymous identity verification and encrypted data sharing across EVM blockchains.",
    category: "Web3 Security & ZK",
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
    targetGoalEth: 25.0,
    totalRaisedEth: 26.8,
    deadlineTimestamp: Date.now() + 5 * 86400 * 1000, // Goal met!
    state: "Successful",
    totalMilestones: 2,
    currentMilestoneIndex: 1,
    milestones: [
      {
        title: "Circom Circuit Audits & Formal Verification",
        amountEth: 12.5,
        isReleased: true,
        votesForEth: 22.0,
        votesAgainstEth: 0.5,
        votingDeadline: Date.now() - 5 * 86400 * 1000,
        votingActive: false
      },
      {
        title: "Multi-Chain SDK & Browser Extension Launch",
        amountEth: 12.5,
        isReleased: false,
        votesForEth: 18.3,
        votesAgainstEth: 2.1,
        votingDeadline: Date.now() + 2 * 86400 * 1000,
        votingActive: true
      }
    ],
    backers: [
      { address: "0x15d34AA54267DB7D7c367839AAf71A00a2C6A65E", amountEth: 10.0, time: "5 hours ago" },
      { address: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc", amountEth: 8.5, time: "2 days ago" },
      { address: "0x976EA74026E726554dB657fA54763abd0C3a0aa9", amountEth: 8.3, time: "4 days ago" }
    ]
  },
  {
    id: 3,
    creator: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    title: "OpenRender: Decentralized GPU Rendering Network",
    description: "Connecting indie 3D artists with idle GPU compute capacity worldwide using automated micro-payment smart contracts on Layer-2.",
    category: "DeAI & Infrastructure",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    targetGoalEth: 8.0,
    totalRaisedEth: 3.2,
    deadlineTimestamp: Date.now() + 20 * 86400 * 1000,
    state: "Active",
    totalMilestones: 2,
    currentMilestoneIndex: 0,
    milestones: [
      {
        title: "Peer Compute Node Daemon & CUDA Benchmark Suite",
        amountEth: 4.0,
        isReleased: false,
        votesForEth: 0,
        votesAgainstEth: 0,
        votingDeadline: 0,
        votingActive: false
      },
      {
        title: "Blender Plugin Integration & Public Beta",
        amountEth: 4.0,
        isReleased: false,
        votesForEth: 0,
        votesAgainstEth: 0,
        votingDeadline: 0,
        votingActive: false
      }
    ],
    backers: [
      { address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", amountEth: 2.0, time: "1 day ago" },
      { address: "0x3C44CdD45969421E448784403B2CA28125659524", amountEth: 1.2, time: "2 days ago" }
    ]
  },
  {
    id: 4,
    creator: "0x15d34AA54267DB7D7c367839AAf71A00a2C6A65E",
    title: "Legacy Carbon Trace: AI Verification Protocol",
    description: "An archived carbon tracking experiment that missed its funding target and allowed full refunds for early supporters.",
    category: "Clean Tech & Energy",
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    targetGoalEth: 10.0,
    totalRaisedEth: 2.5,
    deadlineTimestamp: Date.now() - 2 * 86400 * 1000, // Expired!
    state: "Failed",
    totalMilestones: 1,
    currentMilestoneIndex: 0,
    milestones: [
      {
        title: "Carbon Sensor API & Satellite Verification",
        amountEth: 2.5,
        isReleased: false,
        votesForEth: 0,
        votesAgainstEth: 0,
        votingDeadline: 0,
        votingActive: false
      }
    ],
    backers: [
      { address: "0x3C44CdD45969421E448784403B2CA28125659524", amountEth: 2.5, time: "3 days ago" }
    ]
  }
];

class Web3Service {
  constructor() {
    this.resetSandboxData();
  }

  resetSandboxData() {
    this.mode = "sandbox";
    this.provider = null;
    this.signer = null;
    this.userAddress = "0x3C44CdD45969421E448784403B2CA28125659524";
    this.userBalanceEth = 12.450;
    this.blockNumber = 19482104;
    this.gasPriceGwei = 18.5;
    this.ethUsdPrice = 3250.0;
    this.campaigns = JSON.parse(JSON.stringify(INITIAL_CAMPAIGN_DATA));
    this.userContributions = {
      1: 4.5,
      2: 0,
      3: 1.2,
      4: 2.5
    };
    this.userVotes = {};
    return { success: true, balance: this.userBalanceEth };
  }

  // Connect to Wallet or Toggle Mode
  async connectMetaMask() {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const balanceBig = await provider.getBalance(address);
        
        this.mode = "metamask";
        this.provider = provider;
        this.signer = signer;
        this.userAddress = address;
        this.userBalanceEth = parseFloat(ethers.formatEther(balanceBig));
        return { success: true, mode: "metamask", address, balance: this.userBalanceEth };
      } catch (err) {
        console.warn("MetaMask connection failed, reverting to sandbox:", err);
      }
    }
    this.mode = "sandbox";
    return { success: true, mode: "sandbox", address: this.userAddress, balance: this.userBalanceEth };
  }

  switchToSandbox() {
    this.mode = "sandbox";
    return { mode: "sandbox", address: this.userAddress, balance: this.userBalanceEth };
  }

  getCampaigns() {
    return this.campaigns;
  }

  getCampaignById(id) {
    return this.campaigns.find(c => c.id === parseInt(id));
  }

  // Contribute ETH to a campaign
  async contribute(campaignId, amountEth) {
    const numericAmount = parseFloat(amountEth);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      throw new Error("Invalid contribution amount.");
    }

    if (numericAmount > this.userBalanceEth) {
      throw new Error("Insufficient ETH balance in wallet.");
    }

    const campaign = this.getCampaignById(campaignId);
    if (!campaign) throw new Error("Campaign not found.");
    if (campaign.state === "Failed" || Date.now() > campaign.deadlineTimestamp) {
      throw new Error("Campaign has expired.");
    }

    this.userBalanceEth -= numericAmount;
    campaign.totalRaisedEth += numericAmount;
    this.userContributions[campaignId] = (this.userContributions[campaignId] || 0) + numericAmount;
    this.blockNumber++;

    if (campaign.totalRaisedEth >= campaign.targetGoalEth && campaign.state === "Active") {
      campaign.state = "Successful";
    }

    campaign.backers.unshift({
      address: this.userAddress,
      amountEth: numericAmount,
      time: "Just now"
    });

    const txHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join("");
    return {
      hash: txHash,
      blockNumber: this.blockNumber,
      gasUsed: "48210",
      effectiveGasPriceGwei: this.gasPriceGwei.toString(),
      newTotalRaisedEth: campaign.totalRaisedEth,
      userNewBalanceEth: this.userBalanceEth
    };
  }

  // Claim Refund if campaign failed target goal
  async claimRefund(campaignId) {
    const campaign = this.getCampaignById(campaignId);
    if (!campaign) throw new Error("Campaign not found.");
    if (Date.now() <= campaign.deadlineTimestamp && campaign.totalRaisedEth < campaign.targetGoalEth) {
      throw new Error("Campaign deadline has not passed yet.");
    }
    if (campaign.totalRaisedEth >= campaign.targetGoalEth) {
      throw new Error("Campaign reached target goal, refund unavailable.");
    }

    const refundAmount = this.userContributions[campaignId] || 0;
    if (refundAmount <= 0) {
      throw new Error("You have 0 ETH contributed to claim refund for.");
    }

    this.userContributions[campaignId] = 0;
    this.userBalanceEth += refundAmount;
    this.blockNumber++;

    const txHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join("");
    return {
      hash: txHash,
      blockNumber: this.blockNumber,
      refundAmount
    };
  }

  // Create Campaign
  async createCampaign({ title, description, category, imageUrl, targetGoalEth, durationDays, milestones }) {
    const goal = parseFloat(targetGoalEth);
    if (isNaN(goal) || goal <= 0) throw new Error("Invalid target goal.");

    const newId = this.campaigns.length + 1;
    const newCampaign = {
      id: newId,
      creator: this.userAddress,
      title,
      description,
      category,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
      targetGoalEth: goal,
      totalRaisedEth: 0,
      deadlineTimestamp: Date.now() + (parseInt(durationDays) || 14) * 86400 * 1000,
      state: "Active",
      totalMilestones: milestones.length,
      currentMilestoneIndex: 0,
      milestones: milestones.map(m => ({
        title: m.title,
        amountEth: parseFloat(m.amountEth) || (goal / milestones.length),
        isReleased: false,
        votesForEth: 0,
        votesAgainstEth: 0,
        votingDeadline: 0,
        votingActive: false
      })),
      backers: []
    };

    this.campaigns.unshift(newCampaign);
    this.blockNumber++;

    const txHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join("");
    return {
      campaignId: newId,
      hash: txHash,
      blockNumber: this.blockNumber
    };
  }

  // Propose Milestone release
  async proposeMilestone(campaignId, milestoneIndex, votingDurationDays = 3) {
    const campaign = this.getCampaignById(campaignId);
    if (!campaign) throw new Error("Campaign not found.");
    
    const milestone = campaign.milestones[milestoneIndex];
    if (!milestone) throw new Error("Milestone not found.");

    milestone.votingActive = true;
    milestone.votingDeadline = Date.now() + votingDurationDays * 86400 * 1000;
    this.blockNumber++;

    const txHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join("");
    return { hash: txHash, blockNumber: this.blockNumber };
  }

  // Vote on Milestone proposal
  async voteOnMilestone(campaignId, milestoneIndex, support) {
    const campaign = this.getCampaignById(campaignId);
    if (!campaign) throw new Error("Campaign not found.");

    const milestone = campaign.milestones[milestoneIndex];
    if (!milestone) throw new Error("Milestone not found.");

    const userWeight = this.userContributions[campaignId] || 0;
    if (userWeight <= 0) {
      throw new Error("Only campaign backers with a non-zero contribution can vote.");
    }

    const voteKey = `${campaignId}_${milestoneIndex}`;
    if (this.userVotes[voteKey]) {
      throw new Error("You have already cast your vote on this milestone.");
    }

    this.userVotes[voteKey] = true;
    if (support) {
      milestone.votesForEth += userWeight;
    } else {
      milestone.votesAgainstEth += userWeight;
    }

    this.blockNumber++;
    const txHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join("");
    return { hash: txHash, blockNumber: this.blockNumber, weight: userWeight };
  }

  // Finalize Milestone Release
  async executeMilestoneRelease(campaignId, milestoneIndex) {
    const campaign = this.getCampaignById(campaignId);
    if (!campaign) throw new Error("Campaign not found.");

    const milestone = campaign.milestones[milestoneIndex];
    if (!milestone) throw new Error("Milestone not found.");

    if (milestone.votesForEth > milestone.votesAgainstEth) {
      milestone.isReleased = true;
      milestone.votingActive = false;
      campaign.currentMilestoneIndex++;
      
      if (campaign.creator.toLowerCase() === this.userAddress.toLowerCase()) {
        this.userBalanceEth += milestone.amountEth;
      }
    } else {
      milestone.votingActive = false;
    }

    this.blockNumber++;
    const txHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join("");
    return { hash: txHash, blockNumber: this.blockNumber, approved: milestone.isReleased };
  }
}

export const web3Service = new Web3Service();
