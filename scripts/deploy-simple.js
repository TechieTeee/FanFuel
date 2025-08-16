const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Deploying SimpleFanFuelOFT to testnet...\n");

    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    
    const balance = await deployer.getBalance();
    console.log("Account balance:", ethers.formatEther(balance), "ETH\n");

    // Deploy SimpleFanFuelOFT
    const SimpleFanFuelOFT = await ethers.getContractFactory("SimpleFanFuelOFT");
    
    console.log("⏳ Deploying SimpleFanFuelOFT...");
    const contract = await SimpleFanFuelOFT.deploy(deployer.address);
    
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();

    console.log("✅ SimpleFanFuelOFT deployed successfully!");
    console.log("📍 Contract Address:", contractAddress);
    console.log("👤 Owner:", deployer.address);

    // Verify initial state
    const totalSupply = await contract.totalSupply();
    const ownerBalance = await contract.balanceOf(deployer.address);
    
    console.log("\n📊 Initial State:");
    console.log("   Total Supply:", ethers.formatEther(totalSupply), "FUEL");
    console.log("   Owner Balance:", ethers.formatEther(ownerBalance), "FUEL");

    // Display reaction costs
    console.log("\n🎯 Reaction Costs:");
    const reactionTypes = ["clap", "fire", "gem", "strong", "legend", "king"];
    for (const type of reactionTypes) {
        const cost = await contract.getReactionCost(type);
        console.log(`   ${type}: ${ethers.formatEther(cost)} FUEL`);
    }

    console.log("\n🎉 LayerZero OFT deployment complete!");
    console.log("Contract ready for cross-chain athlete support!");

    return {
        contractAddress,
        deployer: deployer.address,
        network: hre.network.name
    };
}

if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = { main };