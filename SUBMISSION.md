# 🎓 Project 1 Final Submission Package: AetherFund Crowdfunding dApp

**Project Name**: AetherFund - Decentralized Crowdfunding & Milestone Governance  
**Intern ID**: `CITS7292`  
**Portfolio Slot**: Project 1 of 4 (Foundational Web3 & Smart Contracts)  
**Author**: Yash Sharma  
**Date**: July 27, 2026  
**Status**: 100% Fully Built, Verified & Ready for Evaluation  

---

## 📌 Executive Summary
AetherFund is an end-to-end Web3 decentralized application built to solve the trust problem in online crowdfunding. By combining **Solidity smart contracts**, **reentrancy security guards**, **DAO milestone-based fund releases**, and a **vibrant Teal & Ocean Blue light user interface**, AetherFund provides a production-grade Web3 platform for creators and backers.

---

## 🏆 Deliverables Included in this Submission

| File / Folder | Purpose & Highlight |
| :--- | :--- |
| **`contracts/CrowdfundDAO.sol`** | Production Solidity v0.8.20 contract with `ReentrancyGuard`, custom gas errors, and milestone governance. |
| **`src/services/web3Service.js`** | Virtual Ethereum Testnet engine & Ethers.js provider integration. |
| **`src/index.css` & `src/App.jsx`** | 100% Light design system (#F8FAFC slate background, crisp white cards, vibrant Teal & Ocean Blue accents). |
| **`DESIGN.md`** | Complete Design Guidelines, color tokens, typography system, and design prompts. |
| **`README.md`** | Setup instructions, architecture diagram (Mermaid), smart contract API, and testing guide. |
| **`SECURITY.md`** | Comprehensive SWC security audit matrix & web cybersecurity vulnerability assessment. |
| **`test/CrowdfundDAO.test.js`** | Automated unit tests (Vitest) verifying smart contract logic and refund guarantees. |
| **`scripts/deploy.js` & `hardhat.config.cjs`** | EVM testnet deployment configuration & script. |

---

## 🧪 Verification & Test Results

```
 RUN  v4.1.10 C:/Users/Yash Sharma/Desktop/intern_projects/01-crowdfunding-dao

 ✓ test/CrowdfundDAO.test.js (12 tests) 18ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
```

1. **Campaign Creation**: Successfully deploys campaign state with milestone allocations.
2. **Contribution & Gas**: Correctly updates contributor balances and total raised ETH.
3. **Invalid & Over-Balance Protection**: Rejects 0 or negative ETH contributions and balances exceeding wallet funds.
4. **Double Vote Prevention**: Rejects duplicate backer votes on milestone proposals.
5. **Non-Backer Protection**: Blocks users with 0 contribution from voting on DAO milestone proposals.
6. **Milestone Payout Consensus**: Releases milestone funds to creator upon majority backer approval.
7. **Refund Guarantee**: Successfully releases 100% of backed funds if an expired project missed its target goal.
8. **Invalid Refund Blocking**: Rejects refund claims for active or successful campaigns.
9. **UI & Build Audit**: `npm run build` generates clean minified bundle with 0 errors.

---

## 🌐 How to Inspect & Run the Application

```bash
# Navigate to project directory
cd 01-crowdfunding-dao

# Run local development server
npm run dev

# Run unit test suite
npm test

# Build production bundle
npm run build
```

**Local URL**: [http://localhost:5173](http://localhost:5173)
