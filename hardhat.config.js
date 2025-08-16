require("@nomicfoundation/hardhat-ethers");
require('dotenv').config({ path: '.env.local' });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    chiliz: {
      url: process.env.CHILIZ_RPC_URL || "https://spicy-rpc.chiliz.com/",
      accounts: process.env.CHILIZ_PRIVATE_KEY ? [process.env.CHILIZ_PRIVATE_KEY] : [],
      chainId: 88882,
      gasPrice: 'auto'
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || `https://ethereum-sepolia.publicnode.com`,
      accounts: process.env.CHILIZ_PRIVATE_KEY ? [process.env.CHILIZ_PRIVATE_KEY] : [],
      chainId: 11155111,
      gasPrice: 'auto'
    },
    arbitrumSepolia: {
      url: process.env.ARBITRUM_SEPOLIA_RPC_URL || `https://sepolia-rollup.arbitrum.io/rpc`,
      accounts: process.env.CHILIZ_PRIVATE_KEY ? [process.env.CHILIZ_PRIVATE_KEY] : [],
      chainId: 421614,
      gasPrice: 'auto'
    },
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || `https://sepolia.base.org`,
      accounts: process.env.CHILIZ_PRIVATE_KEY ? [process.env.CHILIZ_PRIVATE_KEY] : [],
      chainId: 84532,
      gasPrice: 'auto'
    },
    hardhat: {
      chainId: 1337
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};