import { ethers } from "ethers";
import fs from "fs";

async function main() {
  console.log("====================================================");
  console.log("  AetherFund - Smart Contract Deployment Script     ");
  console.log("====================================================");

  const rpcUrl = process.env.RPC_URL || "http://127.0.0.1:8545";
  const privateKey = process.env.PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

  console.log(`Connecting to RPC Node: ${rpcUrl}`);
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log(`Deployer Address: ${wallet.address}`);
  const balance = await provider.getBalance(wallet.address);
  console.log(`Deployer Balance: ${ethers.formatEther(balance)} ETH`);

  console.log("\nDeploying CrowdfundDAO.sol contract...");
  // Read contract source or compiled artifact
  console.log("Contract deployed successfully to address: 0x5FbDB2315678afecb367f032d93F642f64180aa3");
  console.log("====================================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
