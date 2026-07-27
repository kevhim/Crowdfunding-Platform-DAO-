// SPDX-License-Identifier: MIT
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
        uint256 amountToRelease; // Percentage or absolute amount in Wei
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
    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed creator,
        string title,
        uint256 targetGoal,
        uint256 deadline
    );
    event ContributionMade(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amount,
        uint256 newTotalRaised
    );
    event RefundClaimed(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amount
    );
    event MilestoneProposed(
        uint256 indexed campaignId,
        uint256 indexed milestoneIndex,
        string title,
        uint256 amountToRelease
    );
    event VoteCast(
        uint256 indexed campaignId,
        uint256 indexed milestoneIndex,
        address indexed voter,
        bool support,
        uint256 weight
    );
    event MilestoneFundsReleased(
        uint256 indexed campaignId,
        uint256 indexed milestoneIndex,
        uint256 amount
    );

    constructor() {
        _status = _NOT_ENTERED;
    }

    /**
     * @notice Create a new crowdfunding campaign with milestones
     */
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

    /**
     * @notice Contribute ETH to an active campaign
     */
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

    /**
     * @notice Propose next milestone payout to DAO vote (Only Creator)
     */
    function proposeMilestonePayout(uint256 campaignId, uint256 milestoneIndex, uint256 votingDurationDays) external {
        Campaign storage campaign = campaigns[campaignId];
        if (msg.sender != campaign.creator) revert Unauthorized();
        if (campaign.totalRaised < campaign.targetGoal) revert GoalNotReached();
        if (milestoneIndex >= campaign.totalMilestones) revert InvalidAmount();

        Milestone storage milestone = campaignMilestones[campaignId][milestoneIndex];
        if (milestone.isReleased) revert MilestoneAlreadyProcessed();
        if (milestone.votingActive) revert VotingPeriodActive();

        milestone.votingActive = true;
        milestone.votingDeadline = block.timestamp + (votingDurationDays * 1 days);

        emit MilestoneProposed(campaignId, milestoneIndex, milestone.title, milestone.amountToRelease);
    }

    /**
     * @notice Vote on a milestone proposal (Backers vote with weight = contribution amount)
     */
    function voteOnMilestone(uint256 campaignId, uint256 milestoneIndex, bool support) external {
        uint256 backerContribution = contributions[campaignId][msg.sender];
        if (backerContribution == 0) revert Unauthorized();

        Milestone storage milestone = campaignMilestones[campaignId][milestoneIndex];
        if (!milestone.votingActive) revert VotingPeriodEnded();
        if (block.timestamp > milestone.votingDeadline) revert VotingPeriodEnded();
        if (hasVotedOnMilestone[campaignId][milestoneIndex][msg.sender]) revert AlreadyVoted();

        hasVotedOnMilestone[campaignId][milestoneIndex][msg.sender] = true;

        if (support) {
            milestone.votesFor += backerContribution;
        } else {
            milestone.votesAgainst += backerContribution;
        }

        emit VoteCast(campaignId, milestoneIndex, msg.sender, support, backerContribution);
    }

    /**
     * @notice Finalize milestone payout after voting period ends
     */
    function executeMilestoneRelease(uint256 campaignId, uint256 milestoneIndex) external nonReentrant {
        Campaign storage campaign = campaigns[campaignId];
        Milestone storage milestone = campaignMilestones[campaignId][milestoneIndex];

        if (!milestone.votingActive) revert InvalidAmount();
        if (block.timestamp <= milestone.votingDeadline) revert VotingPeriodActive();
        if (milestone.isReleased) revert MilestoneAlreadyProcessed();

        milestone.votingActive = false;

        // Approval condition: votesFor > votesAgainst
        if (milestone.votesFor > milestone.votesAgainst) {
            milestone.isReleased = true;
            campaign.currentMilestoneIndex++;

            uint256 payout = milestone.amountToRelease;
            if (payout > address(this).balance) {
                payout = address(this).balance;
            }

            (bool success, ) = campaign.creator.call{value: payout}("");
            require(success, "Transfer failed");

            emit MilestoneFundsReleased(campaignId, milestoneIndex, payout);
        }
    }

    /**
     * @notice Claim refund if campaign failed to reach goal by deadline
     */
    function claimRefund(uint256 campaignId) external nonReentrant {
        Campaign storage campaign = campaigns[campaignId];
        if (campaign.id == 0) revert CampaignNotFound();
        if (block.timestamp <= campaign.deadline && campaign.totalRaised < campaign.targetGoal) {
            revert CampaignNotEnded();
        }
        if (campaign.totalRaised >= campaign.targetGoal) {
            revert GoalAlreadyReached();
        }

        uint256 contributedAmount = contributions[campaignId][msg.sender];
        if (contributedAmount == 0) revert AlreadyClaimed();

        // Checks-Effects-Interactions Pattern
        contributions[campaignId][msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: contributedAmount}("");
        require(success, "Refund transfer failed");

        emit RefundClaimed(campaignId, msg.sender, contributedAmount);
    }

    /**
     * @notice Getter for campaign details
     */
    function getCampaign(uint256 campaignId) external view returns (Campaign memory) {
        return campaigns[campaignId];
    }
}
