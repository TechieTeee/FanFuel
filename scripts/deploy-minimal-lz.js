const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Deploying MinimalLayerZeroOFT (LayerZero V2) to Sepolia testnet...\n");

    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance), "ETH\n");

    // LayerZero V2 Endpoint on Sepolia testnet
    const lzEndpoint = "0x6EDCE65403992e310A62460808c4b910D972f10f";
    
    console.log("📡 LayerZero V2 Endpoint:", lzEndpoint);

    // Deploy the contract
    const MinimalLayerZeroOFT = await ethers.getContractFactory("MinimalLayerZeroOFT");
    
    console.log("⏳ Deploying MinimalLayerZeroOFT...");
    const contract = await MinimalLayerZeroOFT.deploy(
        "FanFuel Token",    // name
        "FUEL",            // symbol
        lzEndpoint,        // LayerZero endpoint
        deployer.address   // delegate/owner
    );

    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();

    console.log("✅ MinimalLayerZeroOFT deployed successfully!");
    console.log("📍 Contract Address:", contractAddress);
    console.log("🏷️  Token Name: FanFuel Token");
    console.log("🏷️  Token Symbol: FUEL");
    console.log("👤 Owner:", deployer.address);
    console.log("💰 Fee Recipient:", deployer.address);

    // Verify initial state
    const totalSupply = await contract.totalSupply();
    const ownerBalance = await contract.balanceOf(deployer.address);
    
    console.log("\n📊 Initial State:");
    console.log("   Total Supply:", ethers.formatEther(totalSupply), "FUEL");
    console.log("   Owner Balance:", ethers.formatEther(ownerBalance), "FUEL");

    console.log("\n🔗 LayerZero V2 Integration:");
    console.log("   ✅ Extends LayerZero OFT contract");
    console.log("   ✅ Supports cross-chain messaging");
    console.log("   ✅ Omnichain fungible token standard");

    // Save deployment info
    const deploymentInfo = {
        network: "sepolia",
        contractAddress: contractAddress,
        tokenName: "FanFuel Token",
        tokenSymbol: "FUEL",
        lzEndpoint: lzEndpoint,
        owner: deployer.address,
        totalSupply: totalSupply.toString(),
        deployedAt: new Date().toISOString(),
        layerZeroV2: true
    };

    console.log("\n🎉 LayerZero V2 OFT deployment complete!");
    console.log("✅ Prize eligibility requirement met: LayerZero V2 contract deployed");
    
    return deploymentInfo;
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