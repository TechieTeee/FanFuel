import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("🚀 Deploying FanFuel contracts to Chiliz Spicy Testnet");
  console.log("=======================================================");
  console.log("Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "CHZ");
  
  if (balance === 0n) {
    console.log("❌ No CHZ balance! Get testnet CHZ from: https://spicy-faucet.chiliz.com/");
    return;
  }

  // Deploy ReactionNFT first
  console.log("\n🎨 Deploying ReactionNFT contract...");
  const ReactionNFT = await ethers.getContractFactory("ReactionNFT");
  const reactionNFT = await ReactionNFT.deploy(
    deployer.address, // owner
    "https://fanfuel.app/api/metadata/" // base metadata URI
  );
  
  await reactionNFT.waitForDeployment();
  const reactionNFTAddress = await reactionNFT.getAddress();
  console.log("✅ ReactionNFT deployed to:", reactionNFTAddress);

  // Deploy FanFuelToken for Sarah Johnson (Basketball)
  console.log("\n🏀 Deploying FanFuelToken for Sarah Johnson...");
  const FanFuelToken = await ethers.getContractFactory("FanFuelToken");
  const sarahToken = await FanFuelToken.deploy(
    "Sarah Johnson Fan Token", // name
    "SJBASKET", // symbol
    deployer.address, // athlete wallet (using deployer for demo)
    deployer.address, // platform wallet (using deployer for demo)
    "Sarah Johnson", // athlete name
    "Basketball", // sport
    "University of Alabama", // university
    "Point Guard" // position
  );
  
  await sarahToken.waitForDeployment();
  const sarahTokenAddress = await sarahToken.getAddress();
  console.log("✅ Sarah's FanFuelToken deployed to:", sarahTokenAddress);

  // Deploy FanFuelToken for Marcus Williams (Football)
  console.log("\n🏈 Deploying FanFuelToken for Marcus Williams...");
  const marcusToken = await FanFuelToken.deploy(
    "Marcus Williams Fan Token", // name
    "MWFOOT", // symbol
    deployer.address, // athlete wallet (using deployer for demo)
    deployer.address, // platform wallet (using deployer for demo)
    "Marcus Williams", // athlete name
    "Football", // sport
    "University of Oregon", // university
    "Wide Receiver" // position
  );
  
  await marcusToken.waitForDeployment();
  const marcusTokenAddress = await marcusToken.getAddress();
  console.log("✅ Marcus's FanFuelToken deployed to:", marcusTokenAddress);

  // Set ReactionNFT contract address in tokens
  console.log("\n🔗 Linking contracts...");
  await reactionNFT.setFanFuelTokenAddress(sarahTokenAddress);
  console.log("✅ ReactionNFT linked to Sarah's token");

  // Test a sample support transaction
  console.log("\n💰 Testing support transaction...");
  const supportAmount = ethers.parseEther("0.1"); // 0.1 CHZ for testing
  
  try {
    const tx = await sarahToken.supportAthlete("fire", { value: supportAmount });
    await tx.wait();
    console.log("✅ Test support transaction completed");

    // Get updated stats
    const [totalEarnings, fanCount, totalSupported, transactionCount] = await sarahToken.getAthleteStats();
    console.log("\n📊 Sarah's Updated Stats:");
    console.log("- Total Earnings:", ethers.formatEther(totalEarnings), "CHZ");
    console.log("- Fan Count:", fanCount.toString());
    console.log("- Total Supported:", ethers.formatEther(totalSupported), "CHZ");
    console.log("- Transactions:", transactionCount.toString());
  } catch (error) {
    console.log("⚠️  Test transaction failed (expected on testnet):", error.message);
  }

  console.log("\n🚀 Deployment Summary - LIVE ON CHILIZ TESTNET:");
  console.log("================================================");
  console.log("🎨 ReactionNFT:", reactionNFTAddress);
  console.log("🏀 Sarah Johnson Token:", sarahTokenAddress);
  console.log("🏈 Marcus Williams Token:", marcusTokenAddress);
  console.log("🌐 Network: Chiliz Spicy Testnet (Chain ID: 88882)");
  console.log("🔍 Explorer: https://spicy-explorer.chiliz.com/");
  console.log("\n📝 Contract Addresses for Frontend Integration:");
  console.log(`SARAH_TOKEN: '${sarahTokenAddress}',`);
  console.log(`MARCUS_TOKEN: '${marcusTokenAddress}',`);
  console.log(`REACTION_NFT: '${reactionNFTAddress}'`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});