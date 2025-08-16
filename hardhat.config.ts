import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
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
    hardhat: {
      chainId: 1337
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  etherscan: {
    apiKey: {
      chiliz: "dummy_api_key" // Chiliz explorer doesn't require API key
    },
    customChains: [
      {
        network: "chiliz",
        chainId: 88882,
        urls: {
          apiURL: "https://spicy-explorer.chiliz.com/api",
          browserURL: "https://spicy-explorer.chiliz.com/"
        }
      }
    ]
  }
};

export default config;