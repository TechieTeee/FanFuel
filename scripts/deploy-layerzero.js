const { ethers } = require("hardhat");
const { LZ_ENDPOINTS } = require("../config/layerzero-endpoints");

async function main() {
    console.log("🚀 Deploying FanFuelOFT (LayerZero) to multiple chains...\n");

    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    
    const balance = await deployer.getBalance();
    console.log("Account balance:", ethers.formatEther(balance), "ETH\n");

    // Contract parameters
    const tokenName = "FanFuel Token";
    const tokenSymbol = "FUEL";
    const feeRecipient = deployer.address; // For demo, can be changed later

    // Get the contract factory
    const FanFuelOFT = await ethers.getContractFactory("FanFuelOFT");

    // Deploy to different networks based on current network
    const networkName = hre.network.name;
    console.log("Current network:", networkName);

    let lzEndpoint;
    let chainId;

    // Get LayerZero endpoint based on network
    switch (networkName) {
        case "ethereum":
        case "mainnet":
            lzEndpoint = LZ_ENDPOINTS.ETHEREUM_MAINNET.endpoint;
            chainId = LZ_ENDPOINTS.ETHEREUM_MAINNET.chainId;
            break;
        case "sepolia":
            lzEndpoint = LZ_ENDPOINTS.ETHEREUM_SEPOLIA.endpoint;
            chainId = LZ_ENDPOINTS.ETHEREUM_SEPOLIA.chainId;
            break;
        case "polygon":
            lzEndpoint = LZ_ENDPOINTS.POLYGON_MAINNET.endpoint;
            chainId = LZ_ENDPOINTS.POLYGON_MAINNET.chainId;
            break;
        case "arbitrum":
            lzEndpoint = LZ_ENDPOINTS.ARBITRUM_MAINNET.endpoint;
            chainId = LZ_ENDPOINTS.ARBITRUM_MAINNET.chainId;
            break;
        case "optimism":
            lzEndpoint = LZ_ENDPOINTS.OPTIMISM_MAINNET.endpoint;
            chainId = LZ_ENDPOINTS.OPTIMISM_MAINNET.chainId;
            break;
        case "base":
            lzEndpoint = LZ_ENDPOINTS.BASE_MAINNET.endpoint;
            chainId = LZ_ENDPOINTS.BASE_MAINNET.chainId;
            break;
        case "chiliz":
            lzEndpoint = "0x6EDCE65403992e310A62460808c4b910D972f10f"; // LayerZero endpoint for Chiliz
            chainId = 88882;
            break;
        default:
            // Default to Sepolia for testing
            lzEndpoint = LZ_ENDPOINTS.ETHEREUM_SEPOLIA.endpoint;
            chainId = LZ_ENDPOINTS.ETHEREUM_SEPOLIA.chainId;
            console.log("⚠️  Using default Sepolia endpoint for unknown network");
    }

    console.log(`📡 LayerZero Endpoint: ${lzEndpoint}`);
    console.log(`🔗 Chain ID: ${chainId}`);

    try {
        // Deploy the contract
        console.log("\n⏳ Deploying FanFuelOFT...");
        const fanFuelOFT = await FanFuelOFT.deploy(
            tokenName,
            tokenSymbol,
            lzEndpoint,
            deployer.address, // delegate (owner)
            feeRecipient
        );

        await fanFuelOFT.waitForDeployment();
        const contractAddress = await fanFuelOFT.getAddress();

        console.log("✅ FanFuelOFT deployed successfully!");
        console.log("📍 Contract Address:", contractAddress);
        console.log("🏷️  Token Name:", tokenName);
        console.log("🏷️  Token Symbol:", tokenSymbol);
        console.log("👤 Owner:", deployer.address);
        console.log("💰 Fee Recipient:", feeRecipient);

        // Verify initial state
        const totalSupply = await fanFuelOFT.totalSupply();
        const ownerBalance = await fanFuelOFT.balanceOf(deployer.address);
        
        console.log("\n📊 Initial State:");
        console.log("   Total Supply:", ethers.formatEther(totalSupply), "FUEL");
        console.log("   Owner Balance:", ethers.formatEther(ownerBalance), "FUEL");

        // Display reaction costs
        console.log("\n🎯 Reaction Costs:");
        const reactionTypes = ["clap", "fire", "gem", "strong", "legend", "king"];
        for (const type of reactionTypes) {
            const cost = await fanFuelOFT.getReactionCost(type);
            console.log(`   ${type}: ${ethers.formatEther(cost)} FUEL`);
        }

        // Save deployment info
        const deploymentInfo = {
            network: networkName,
            chainId: chainId,
            contractAddress: contractAddress,
            tokenName: tokenName,
            tokenSymbol: tokenSymbol,
            lzEndpoint: lzEndpoint,
            owner: deployer.address,
            feeRecipient: feeRecipient,
            totalSupply: totalSupply.toString(),
            deployedAt: new Date().toISOString(),
            txHash: fanFuelOFT.deploymentTransaction()?.hash
        };

        console.log("\n📝 Deployment Summary:");
        console.log(JSON.stringify(deploymentInfo, null, 2));

        // Instructions
        console.log("\n🔧 Next Steps:");
        console.log("1. Verify contract on block explorer if needed");
        console.log("2. Set up cross-chain connections with other deployments");
        console.log("3. Configure trusted remotes for LayerZero messaging");
        console.log("4. Test cross-chain functionality");
        console.log("\n🎉 LayerZero OFT deployment complete!");

        return deploymentInfo;

    } catch (error) {
        console.error("❌ Deployment failed:", error);
        throw error;
    }
}

// Configuration for LayerZero endpoints (fallback if config file missing)
const LZ_ENDPOINTS_FALLBACK = {
    ETHEREUM_MAINNET: { endpoint: "0x1a44076050125825900e736c501f859c50fE728c", chainId: 1 },
    ETHEREUM_SEPOLIA: { endpoint: "0x6EDCE65403992e310A62460808c4b910D972f10f", chainId: 11155111 },
    POLYGON_MAINNET: { endpoint: "0x1a44076050125825900e736c501f859c50fE728c", chainId: 137 },
    ARBITRUM_MAINNET: { endpoint: "0x1a44076050125825900e736c501f859c50fE728c", chainId: 42161 },
    OPTIMISM_MAINNET: { endpoint: "0x1a44076050125825900e736c501f859c50fE728c", chainId: 10 },
    BASE_MAINNET: { endpoint: "0x1a44076050125825900e736c501f859c50fE728c", chainId: 8453 }
};

// Handle script execution
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = { main };